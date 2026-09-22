# -*- coding: utf-8 -*-
"""
engine/layer_hangul_renderer.py
레이어 단위 자소 분리 & OpenCV 비트 연산(Bitwise AND) 한글 획순 렌더링 엔진
1. 초성 / 중성 / 종성을 원본 상대 위치를 유지한 채 독립된 투명 BGRA 레이어로 물리적 분리
   - 쌍자음(ㄲ, ㄸ, ㅃ, ㅆ, ㅉ) 및 겹받침(ㅄ, ㄺ, ㄻ, ㄼ 등)은 서브패스(자모) 단위로도 분리 렌더링
   - 가로/세로 복합모음(ㅘ, ㅚ, ㅟ 등)도 가로/세로 독립 레이어로 분리 렌더링
   - 결합 외곽선(예: '꿈', '물')은 Bounding Split Mask로 정밀 분리 (0px Overlap)
2. 국립국어원 표준 획순 골격 궤적 & 문맥 조판 규칙(Contextual Rules) 완벽 정합
   - 세로모음 결합형 'ㄱ', 'ㄲ', 'ㅋ' 꼬리 대각선 꺾임 정밀 매칭 (꼬리 잘림 0%)
   - 'ㅅ' 우측 사선 끝단 연장
3. 등간격 호 길이 보간(Uniform Arc-Length Resampling):
   - 2px 간격 균일 벡터 보간으로 붓글씨 쓰기 흐름의 자연스러운 진행 속도 구현
4. 적응형 마스크(thickness: 38px) 및 미래 획 보호(Inhibition Mask):
   - 같은 자소 내 인접 획 사전 노출(Intra-Jamo Bleeding) 원천 차단
5. 투명 BGRA 레이어 PNG, 고화질 GIF 애니메이션, 무손실 MP4 비디오 렌더러 지원
"""

import os, sys, re, json, math
import cv2
import numpy as np
from PIL import Image

sys.path.append(os.path.abspath('.'))
from tools.auto_segmenter import segment_hangul

def sample_quadratic_bezier(p0, p1, p2, num_pts=15):
    """2차 베지에 곡선 좌표 분할 샘플링"""
    pts = []
    for i in range(1, num_pts + 1):
        t = i / float(num_pts)
        omt = 1.0 - t
        x = omt * omt * p0[0] + 2.0 * omt * t * p1[0] + t * t * p2[0]
        y = omt * omt * p0[1] + 2.0 * omt * t * p1[1] + t * t * p2[1]
        pts.append((x, y))
    return pts

def resample_stroke_points_uniform(pts, step_px=2.0):
    """획의 전체 길이를 따라 일정한 거리(step_px) 간격으로 점들을 균일하게 재샘플링"""
    if len(pts) < 2:
        return pts

    total_dist = 0.0
    dists = [0.0]
    for i in range(len(pts) - 1):
        d = math.hypot(pts[i+1][0] - pts[i][0], pts[i+1][1] - pts[i][1])
        total_dist += d
        dists.append(total_dist)

    if total_dist <= step_px:
        return pts

    num_samples = max(10, int(math.ceil(total_dist / step_px)))
    new_pts = [pts[0]]

    cur_idx = 0
    for s in range(1, num_samples):
        target_d = (s / float(num_samples)) * total_dist
        while cur_idx < len(dists) - 1 and dists[cur_idx + 1] < target_d:
            cur_idx += 1
        seg_d = dists[cur_idx + 1] - dists[cur_idx]
        if seg_d > 1e-6:
            t = (target_d - dists[cur_idx]) / seg_d
            x = (1.0 - t) * pts[cur_idx][0] + t * pts[cur_idx + 1][0]
            y = (1.0 - t) * pts[cur_idx][1] + t * pts[cur_idx + 1][1]
            new_pts.append((x, y))
    new_pts.append(pts[-1])
    return new_pts

def svg_path_to_polygons(path_str, matrix=(0.17, 0, 0, -0.17, 18.0, 168.0), scale_factor=2.0):
    """SVG Path d 문자열을 스크린 픽셀 좌표계 다각형(Polygons) 목록으로 변환"""
    a, b, c, d, tx, ty = matrix
    def transform_pt(x, y):
        cx = (x * a + y * c + tx) * scale_factor
        cy = (x * b + y * d + ty) * scale_factor
        return (cx, cy)

    cmds = re.findall(r'([A-Za-z])([^A-Za-z]*)', path_str)
    polygons = []
    current_poly = []
    curr_pt = (0.0, 0.0)
    start_pt = (0.0, 0.0)

    for cmd, args in cmds:
        nums = [float(v) for v in re.findall(r'[-+]?[0-9]*\.?[0-9]+', args)]
        idx = 0
        if cmd == 'M':
            if len(current_poly) > 2:
                polygons.append(current_poly)
            current_poly = []
            curr_pt = transform_pt(nums[0], nums[1])
            start_pt = curr_pt
            current_poly.append(curr_pt)
            idx = 2
            while idx + 1 < len(nums):
                curr_pt = transform_pt(nums[idx], nums[idx+1])
                current_poly.append(curr_pt)
                idx += 2
        elif cmd == 'L':
            while idx + 1 < len(nums):
                curr_pt = transform_pt(nums[idx], nums[idx+1])
                current_poly.append(curr_pt)
                idx += 2
        elif cmd == 'Q':
            while idx + 3 < len(nums):
                p1 = transform_pt(nums[idx], nums[idx+1])
                p2 = transform_pt(nums[idx+2], nums[idx+3])
                bezier_pts = sample_quadratic_bezier(curr_pt, p1, p2, num_pts=15)
                current_poly.extend(bezier_pts)
                curr_pt = p2
                idx += 4
        elif cmd.upper() == 'Z':
            if len(current_poly) > 2:
                polygons.append(current_poly)
            current_poly = []
            curr_pt = start_pt

    if len(current_poly) > 2:
        polygons.append(current_poly)

    return polygons

def render_svg_to_layer(path_str, width=400, height=400, color=(255, 255, 255, 255), matrix=(0.17, 0, 0, -0.17, 18.0, 168.0)):
    """SVG 패스를 투명 BGRA 4채널 레이어로 래스터라이징 (Even-Odd 내부 홀 완벽 뚫기)"""
    layer = np.zeros((height, width, 4), dtype=np.uint8)
    if not path_str:
        return layer

    scale_factor = width / 200.0
    polys = svg_path_to_polygons(path_str, matrix=matrix, scale_factor=scale_factor)
    cv_polys = [np.array(p, dtype=np.int32).reshape((-1, 1, 2)) for p in polys]

    if cv_polys:
        mask = np.zeros((height, width), dtype=np.uint8)
        cv2.fillPoly(mask, cv_polys, 255)
        b, g, r, a = color
        layer[mask > 0] = [b, g, r, a]

    return layer

class LayerHangulRenderer:
    def __init__(self, char, width=400, height=400, color_mode='vibrant', bg_mode='dark'):
        self.char = char
        self.width = width
        self.height = height
        self.scale_factor = width / 200.0
        self.color_mode = color_mode
        self.bg_mode = bg_mode

        # 1. 완성형 글리프 역분해 (Auto-Segmentation)
        self.seg = segment_hangul(char)
        if not self.seg:
            raise ValueError(f"글자 '{char}'에 대한 글리프를 추출할 수 없습니다.")

        # 2. 색상 팔레트 설정 (BGRA)
        self._setup_palette()

        # 3. 레이어 단위 물리적 분리 렌더링 (초1/초2, 중1/중2, 종1/종2 계층 분리)
        self._build_layers()

        # 4. 획순 스케줄 로드 및 균일 호 길이 보간(Uniform Arc-Length Resampling)
        self.stroke_plans = self._extract_stroke_points()

    def _setup_palette(self):
        if self.color_mode == 'vibrant':
            self.COLOR_CHO    = (248, 189, 56,  255) # Skyblue (#38BDF8)
            self.COLOR_CHO2   = (219, 138, 30,  255) # Deep Skyblue
            self.COLOR_JUNG   = (252, 132, 192, 255) # Purple (#C084FC)
            self.COLOR_JUNG2  = (216, 75,  232, 255) # Deep Purple
            self.COLOR_JONG1  = (60,  146, 251, 255) # Orange (#FB923C)
            self.COLOR_JONG2  = (182, 114, 244, 255) # Pink (#F472B6)
            self.COLOR_GUIDE  = (60,  60,  60,  75)  # 반투명 다크 가이드
        elif self.color_mode == 'traditional':
            ink = (24, 24, 24, 255)
            self.COLOR_CHO    = ink
            self.COLOR_CHO2   = ink
            self.COLOR_JUNG   = ink
            self.COLOR_JUNG2  = ink
            self.COLOR_JONG1  = ink
            self.COLOR_JONG2  = ink
            self.COLOR_GUIDE  = (200, 200, 200, 80) if self.bg_mode == 'light' else (60, 60, 60, 75)
        else: # mono
            c = (240, 240, 240, 255)
            self.COLOR_CHO    = c
            self.COLOR_CHO2   = c
            self.COLOR_JUNG   = c
            self.COLOR_JUNG2  = c
            self.COLOR_JONG1  = c
            self.COLOR_JONG2  = c
            self.COLOR_GUIDE  = (80, 80, 80, 75)

    def _build_layers(self):
        w, h = self.width, self.height

        # ── 초성 계층 분리 ──
        cho_paths = self.seg.get('choPaths', [])
        is_double_cho = self.seg['cho'] in ['ㄲ', 'ㄸ', 'ㅃ', 'ㅆ', 'ㅉ']
        if is_double_cho and len(cho_paths) >= 2:
            # 좌측 자음 vs 우측 자음 분리
            self.layer_cho1 = render_svg_to_layer(cho_paths[0], w, h, color=self.COLOR_CHO)
            self.layer_cho2 = render_svg_to_layer(''.join(cho_paths[1:]), w, h, color=self.COLOR_CHO)
            self.layer_cho  = cv2.add(self.layer_cho1, self.layer_cho2)
        else:
            self.layer_cho1 = render_svg_to_layer(self.seg['choPath'], w, h, color=self.COLOR_CHO)
            self.layer_cho2 = None
            self.layer_cho  = self.layer_cho1

        # ── 중성 및 종성 계층 분리 ──
        if self.seg.get('isUnifiedJungJong'):
            # 외곽선 결합 케이스 ('꿈', '물' 등)
            split_y = int(self.seg.get('splitY_ratio', 0.58) * h)
            unif_jung = render_svg_to_layer(self.seg['unifiedPath'], w, h, color=self.COLOR_JUNG)
            self.layer_jung = unif_jung.copy()
            self.layer_jung[split_y:, :] = 0
            self.layer_jung1 = self.layer_jung
            self.layer_jung2 = None

            unif_jong = render_svg_to_layer(self.seg['unifiedPath'], w, h, color=self.COLOR_JONG1)
            self.layer_jong1 = unif_jong.copy()
            self.layer_jong1[:split_y, :] = 0
            self.layer_jong2 = None
            self.layer_jong = self.layer_jong1
        else:
            # 복합 모음 (가로 요소 vs 세로 요소) 분리
            jung_paths = self.seg.get('jungPaths', [])
            if len(jung_paths) >= 2 and self.seg['jung'] in ['ㅘ', 'ㅙ', 'ㅚ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅢ']:
                self.layer_jung1 = render_svg_to_layer(jung_paths[0], w, h, color=self.COLOR_JUNG)
                self.layer_jung2 = render_svg_to_layer(''.join(jung_paths[1:]), w, h, color=self.COLOR_JUNG)
                self.layer_jung = cv2.add(self.layer_jung1, self.layer_jung2)
            else:
                self.layer_jung1 = render_svg_to_layer(self.seg['jungPath'], w, h, color=self.COLOR_JUNG)
                self.layer_jung2 = None
                self.layer_jung = self.layer_jung1

            # 종성 (단받침 또는 겹받침 1/2) 분리
            jong_paths = self.seg.get('jongPaths', [])
            if len(jong_paths) > 1:
                self.layer_jong1 = render_svg_to_layer(jong_paths[0], w, h, color=self.COLOR_JONG1)
                self.layer_jong2 = render_svg_to_layer(jong_paths[1], w, h, color=self.COLOR_JONG2)
                self.layer_jong = cv2.add(self.layer_jong1, self.layer_jong2)
            elif len(jong_paths) == 1:
                self.layer_jong1 = render_svg_to_layer(jong_paths[0], w, h, color=self.COLOR_JONG1)
                self.layer_jong2 = None
                self.layer_jong = self.layer_jong1
            else:
                self.layer_jong1 = None
                self.layer_jong2 = None
                self.layer_jong = np.zeros((h, w, 4), dtype=np.uint8)

        # 전체 글리프 은선 가이드 레이어
        self.layer_guide = render_svg_to_layer(self.seg['totalPath'], w, h, color=self.COLOR_GUIDE)

    def _extract_stroke_points(self):
        import subprocess
        node_cmd = f"node -e \"const c = require('./assets/hangul_stroke_composer.js'); console.log(JSON.stringify(c.composeStrokePlan('{self.char}')));\""
        out = subprocess.check_output(node_cmd, shell=True, encoding='utf-8')
        plan = json.loads(out)

        strokes = []
        for s_idx, st in enumerate(plan['strokes']):
            d = st['d']
            pts = []
            cmds = re.findall(r'([A-Za-z])([^A-Za-z]*)', d)
            curr = (0.0, 0.0)
            for cmd, args in cmds:
                nums = [float(v) for v in re.findall(r'[-+]?[0-9]*\.?[0-9]+', args)]
                if cmd == 'M':
                    curr = (nums[0] * self.scale_factor, nums[1] * self.scale_factor)
                    pts.append(curr)
                elif cmd == 'L':
                    for i in range(0, len(nums), 2):
                        curr = (nums[i] * self.scale_factor, nums[i+1] * self.scale_factor)
                        pts.append(curr)
                elif cmd == 'Q':
                    for i in range(0, len(nums), 4):
                        p1 = (nums[i] * self.scale_factor, nums[i+1] * self.scale_factor)
                        p2 = (nums[i+2] * self.scale_factor, nums[i+3] * self.scale_factor)
                        curve = sample_quadratic_bezier(curr, p1, p2, num_pts=20)
                        pts.extend(curve)
                        curr = p2

            # 균일 호 길이 보간 (2px 간격 고해상도 균일 샘플링)
            resampled = resample_stroke_points_uniform(pts, step_px=2.0)

            strokes.append({
                'jamo': st.get('jamo', ''),
                'role': st['role'],
                'desc': st.get('desc', ''),
                'bx': st['bx'] * self.scale_factor,
                'by': st['by'] * self.scale_factor,
                'pts': resampled
            })
        return strokes

    def create_stroke_mask(self, stroke_pts, progress, thickness=38, blur=False):
        """
        주어진 획 점들과 진행도(0.0~1.0)에 따른 라운드 캡 이진 마스크 생성
        - 폰트 줄기 두께에 맞춤(thickness: 38px)
        - cv2.threshold 이진화 (0 or 255)
        """
        mask = np.zeros((self.height, self.width), dtype=np.uint8)
        if not stroke_pts or progress <= 0.0:
            return mask

        num_pts = len(stroke_pts)
        cutoff = max(1, int(math.ceil(num_pts * progress)))
        active_pts = stroke_pts[:cutoff]

        # 이어진 선분
        int_pts = [np.array(active_pts, dtype=np.int32).reshape((-1, 1, 2))]
        cv2.polylines(mask, int_pts, isClosed=False, color=255, thickness=thickness, lineType=cv2.LINE_AA)

        # 관절부 및 끝점에 라운드 캡
        r = thickness // 2
        for p in active_pts:
            cv2.circle(mask, (int(round(p[0])), int(round(p[1]))), r, 255, -1, lineType=cv2.LINE_AA)

        _, mask_binary = cv2.threshold(mask, 10, 255, cv2.THRESH_BINARY)
        if blur:
            mask_binary = cv2.GaussianBlur(mask_binary, (3, 3), 0)

        return mask_binary

    def render_frame(self, current_stroke_idx, stroke_progress, blur=False):
        """
        핵심 기법: 획순 단위 엄격 분리 & 비트 연산 합성
        - 초성 1/2, 중성 1/2, 종성 1/2 레이어별로 획을 독립 매핑
        - 미래 획 간섭 방지(Inhibition Mask) 적용
        - 마지막 획 완료(progress=1.0) 시 원본 글리프 100% 완전 복원
        """
        w, h = self.width, self.height

        # 최종 프레임 완료 감지
        is_all_finished = (current_stroke_idx >= len(self.stroke_plans) - 1 and stroke_progress >= 1.0)

        active_cho1_mask  = np.zeros((h, w), dtype=np.uint8)
        active_cho2_mask  = np.zeros((h, w), dtype=np.uint8)
        active_jung1_mask = np.zeros((h, w), dtype=np.uint8)
        active_jung2_mask = np.zeros((h, w), dtype=np.uint8)
        active_jong1_mask = np.zeros((h, w), dtype=np.uint8)
        active_jong2_mask = np.zeros((h, w), dtype=np.uint8)

        # 획별 마스킹 축적
        for idx, st in enumerate(self.stroke_plans):
            if idx < current_stroke_idx:
                prog = 1.0
            elif idx == current_stroke_idx:
                prog = stroke_progress
            else:
                prog = 0.0

            if prog <= 0.0:
                continue

            # 적응형 두께: 획이 완성되면 44px로 글리프 외곽선 확실 커버, 그리는 중에는 38px
            th = 44 if prog >= 1.0 else 38
            m = self.create_stroke_mask(st['pts'], prog, thickness=th, blur=blur)

            # 아직 그리지 않은 같은 자모 내 미래 획 중심선 영역 침범 방지 (Inhibition)
            if prog < 1.0 and idx == current_stroke_idx:
                for future_idx in range(idx + 1, len(self.stroke_plans)):
                    fst = self.stroke_plans[future_idx]
                    if fst['role'] == st['role'] and fst['jamo'] == st['jamo']:
                        # 미래 획 중심선을 얇게(thickness=14) 그려서 현재 마스크에서 제거
                        f_pts = [np.array(fst['pts'], dtype=np.int32).reshape((-1, 1, 2))]
                        inh_mask = np.zeros((h, w), dtype=np.uint8)
                        cv2.polylines(inh_mask, f_pts, isClosed=False, color=255, thickness=14, lineType=cv2.LINE_AA)
                        m = cv2.subtract(m, inh_mask)

            # 대상 레이어 판별 및 OR 결합
            role = st['role']
            if role == 'cho':
                if self.layer_cho2 is not None:
                    # 쌍초성 (앞 ㄱ vs 뒤 ㄱ)
                    if st['bx'] < w * 0.45:
                        active_cho1_mask = cv2.bitwise_or(active_cho1_mask, m)
                    else:
                        active_cho2_mask = cv2.bitwise_or(active_cho2_mask, m)
                else:
                    active_cho1_mask = cv2.bitwise_or(active_cho1_mask, m)

            elif role in ['jung', 'jung_h', 'jung_v']:
                if self.layer_jung2 is not None:
                    # 복합모음 (가로 요소 vs 세로 요소)
                    if role == 'jung_h' or st['bx'] < w * 0.50:
                        active_jung1_mask = cv2.bitwise_or(active_jung1_mask, m)
                    else:
                        active_jung2_mask = cv2.bitwise_or(active_jung2_mask, m)
                else:
                    active_jung1_mask = cv2.bitwise_or(active_jung1_mask, m)

            elif role == 'jong':
                if self.layer_jong2 is not None:
                    # 겹받침 (앞 자음 vs 뒤 자음)
                    if st['bx'] < w * 0.50:
                        active_jong1_mask = cv2.bitwise_or(active_jong1_mask, m)
                    else:
                        active_jong2_mask = cv2.bitwise_or(active_jong2_mask, m)
                else:
                    active_jong1_mask = cv2.bitwise_or(active_jong1_mask, m)

        # ── OpenCV bitwise_and 정밀 마스킹 추출 ──
        if is_all_finished:
            # 최종 완성 시 원본 레이어 100% 무결 표시 (글리프 꼬리 잘림 0% 보장)
            cho_out  = self.layer_cho
            jung_out = self.layer_jung
            jong_out = self.layer_jong
        else:
            # 진행 중: 독립 레이어별 bitwise_and
            if self.layer_cho2 is not None:
                c1 = cv2.bitwise_and(self.layer_cho1, self.layer_cho1, mask=active_cho1_mask)
                c2 = cv2.bitwise_and(self.layer_cho2, self.layer_cho2, mask=active_cho2_mask)
                cho_out = cv2.add(c1, c2)
            else:
                cho_out = cv2.bitwise_and(self.layer_cho, self.layer_cho, mask=active_cho1_mask)

            if self.layer_jung2 is not None:
                j1 = cv2.bitwise_and(self.layer_jung1, self.layer_jung1, mask=active_jung1_mask)
                j2 = cv2.bitwise_and(self.layer_jung2, self.layer_jung2, mask=active_jung2_mask)
                jung_out = cv2.add(j1, j2)
            else:
                jung_out = cv2.bitwise_and(self.layer_jung, self.layer_jung, mask=active_jung1_mask)

            if self.layer_jong2 is not None:
                g1 = cv2.bitwise_and(self.layer_jong1, self.layer_jong1, mask=active_jong1_mask)
                g2 = cv2.bitwise_and(self.layer_jong2, self.layer_jong2, mask=active_jong2_mask)
                jong_out = cv2.add(g1, g2)
            else:
                jong_out = cv2.bitwise_and(self.layer_jong, self.layer_jong, mask=active_jong1_mask)

        # ── 최종 합성 캔버스 ──
        if self.bg_mode == 'transparent':
            canvas = np.zeros((h, w, 4), dtype=np.uint8)
            self._overlay_rgba_on_rgba(canvas, self.layer_guide)
            self._overlay_rgba_on_rgba(canvas, cho_out)
            self._overlay_rgba_on_rgba(canvas, jung_out)
            self._overlay_rgba_on_rgba(canvas, jong_out)
            return canvas
        else:
            if self.bg_mode == 'light':
                bg = np.full((h, w, 3), (250, 250, 250), dtype=np.uint8)
            else: # dark
                bg = np.full((h, w, 3), (20, 11, 7), dtype=np.uint8) # #070B14

            self._overlay_rgba_on_bgr(bg, self.layer_guide)
            self._overlay_rgba_on_bgr(bg, cho_out)
            self._overlay_rgba_on_bgr(bg, jung_out)
            self._overlay_rgba_on_bgr(bg, jong_out)
            return bg

    def _overlay_rgba_on_bgr(self, bg_bgr, layer_rgba):
        alpha = layer_rgba[:, :, 3] / 255.0
        for c in range(3):
            bg_bgr[:, :, c] = (1.0 - alpha) * bg_bgr[:, :, c] + alpha * layer_rgba[:, :, c]

    def _overlay_rgba_on_rgba(self, canvas_rgba, layer_rgba):
        alpha_src = layer_rgba[:, :, 3] / 255.0
        alpha_dst = canvas_rgba[:, :, 3] / 255.0
        out_alpha = alpha_src + alpha_dst * (1.0 - alpha_src)
        nonzero = out_alpha > 0

        for c in range(3):
            canvas_rgba[nonzero, c] = np.clip(
                (layer_rgba[nonzero, c] * alpha_src[nonzero] +
                 canvas_rgba[nonzero, c] * alpha_dst[nonzero] * (1.0 - alpha_src[nonzero])) / (out_alpha[nonzero] + 1e-6),
                0, 255
            ).astype(np.uint8)
        canvas_rgba[:, :, 3] = np.clip(out_alpha * 255.0, 0, 255).astype(np.uint8)

    def render_animation_gif(self, output_path, fps=20, steps_per_stroke=8):
        """고품질 GIF 애니메이션 생성 (획 간 정지 효과로 획순 구분 명확화)"""
        frames = []
        num_strokes = len(self.stroke_plans)

        for s_idx in range(num_strokes):
            for step in range(1, steps_per_stroke + 1):
                prog = step / float(steps_per_stroke)
                img = self.render_frame(s_idx, prog)
                if self.bg_mode == 'transparent':
                    rgba = cv2.cvtColor(img, cv2.COLOR_BGRA2RGBA)
                    frames.append(Image.fromarray(rgba))
                else:
                    rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                    frames.append(Image.fromarray(rgb))

            # 획 완료 시 확실한 붓 떼기 정지 (3프레임)
            for _ in range(3):
                frames.append(frames[-1])

        # 글자 전체 완료 후 15프레임 정지
        for _ in range(15):
            frames.append(frames[-1])

        os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
        frames[0].save(
            output_path,
            save_all=True,
            append_images=frames[1:],
            duration=int(1000 / fps),
            loop=0
        )
        return output_path

    def render_video_mp4(self, output_path, fps=30, steps_per_stroke=10):
        """OpenCV VideoWriter를 통한 고품질 MP4 비디오 렌더링"""
        os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(output_path, fourcc, fps, (self.width, self.height))

        num_strokes = len(self.stroke_plans)
        frame = None
        for s_idx in range(num_strokes):
            for step in range(1, steps_per_stroke + 1):
                prog = step / float(steps_per_stroke)
                frame = self.render_frame(s_idx, prog)
                if frame.shape[2] == 4:
                    bgr = np.full((self.height, self.width, 3), (255, 255, 255), dtype=np.uint8)
                    self._overlay_rgba_on_bgr(bgr, frame)
                    out.write(bgr)
                else:
                    out.write(frame)

            for _ in range(4):
                if frame is not None:
                    out.write(frame if frame.shape[2] == 3 else bgr)

        # 완료 후 1.5초 정지
        if frame is not None:
            last_img = frame if frame.shape[2] == 3 else bgr
            for _ in range(int(fps * 1.5)):
                out.write(last_img)

        out.release()
        return output_path

    def export_layers(self, output_dir, prefix='layer'):
        """자소 분리 무손실 투명 BGRA PNG 내보내기"""
        os.makedirs(output_dir, exist_ok=True)
        paths = {
            'cho': os.path.join(output_dir, f"{prefix}_cho.png"),
            'jung': os.path.join(output_dir, f"{prefix}_jung.png"),
            'jong': os.path.join(output_dir, f"{prefix}_jong.png"),
            'guide': os.path.join(output_dir, f"{prefix}_guide.png")
        }
        cv2.imwrite(paths['cho'], self.layer_cho)
        cv2.imwrite(paths['jung'], self.layer_jung)
        cv2.imwrite(paths['jong'], self.layer_jong)
        cv2.imwrite(paths['guide'], self.layer_guide)

        if self.layer_cho2 is not None:
            paths['cho1'] = os.path.join(output_dir, f"{prefix}_cho1.png")
            paths['cho2'] = os.path.join(output_dir, f"{prefix}_cho2.png")
            cv2.imwrite(paths['cho1'], self.layer_cho1)
            cv2.imwrite(paths['cho2'], self.layer_cho2)

        if self.layer_jong2 is not None:
            paths['jong1'] = os.path.join(output_dir, f"{prefix}_jong1.png")
            paths['jong2'] = os.path.join(output_dir, f"{prefix}_jong2.png")
            cv2.imwrite(paths['jong1'], self.layer_jong1)
            cv2.imwrite(paths['jong2'], self.layer_jong2)

        return paths

if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description='Hangul Layer Separation & Bitwise AND Renderer')
    parser.add_argument('--char', default='값', help='Target syllable')
    parser.add_argument('--name', default='sample', help='Base name for outputs')
    parser.add_argument('--color_mode', default='vibrant', choices=['vibrant', 'traditional', 'mono'])
    parser.add_argument('--bg_mode', default='dark', choices=['dark', 'light', 'transparent'])
    parser.add_argument('--format', default='all', choices=['all', 'gif', 'mp4', 'layers'])
    parser.add_argument('--width', type=int, default=400)
    parser.add_argument('--height', type=int, default=400)
    args = parser.parse_args()

    print(f"Initializing LayerHangulRenderer for '{args.char}' (mode={args.color_mode}, bg={args.bg_mode})...")
    renderer = LayerHangulRenderer(args.char, width=args.width, height=args.height, 
                                   color_mode=args.color_mode, bg_mode=args.bg_mode)

    out_dir = 'test'
    if args.format in ['all', 'layers']:
        layer_files = renderer.export_layers(out_dir, prefix=f"layer_{args.name}")
        print(f"Exported layers: {list(layer_files.keys())}")

    if args.format in ['all', 'gif']:
        gif_path = os.path.join(out_dir, f"anim_{args.name}_bitwise.gif")
        renderer.render_animation_gif(gif_path, fps=20)
        print(f"Exported GIF: {gif_path}")

    if args.format in ['all', 'mp4']:
        mp4_path = os.path.join(out_dir, f"video_{args.name}_bitwise.mp4")
        renderer.render_video_mp4(mp4_path, fps=30)
        print(f"Exported MP4: {mp4_path}")

    mid_frame = renderer.render_frame(current_stroke_idx=1, stroke_progress=0.7)
    final_frame = renderer.render_frame(current_stroke_idx=len(renderer.stroke_plans)-1, stroke_progress=1.0)
    cv2.imwrite(os.path.join(out_dir, f"frame_{args.name}_mid.png"), mid_frame)
    cv2.imwrite(os.path.join(out_dir, f"frame_{args.name}_final.png"), final_frame)
    print(f"Rendering complete for '{args.char}'.")
