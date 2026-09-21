# -*- coding: utf-8 -*-
"""
engine/layer_hangul_renderer.py
레이어 단위 자소 분리 (Layer Separation) & OpenCV 비트 연산(Bitwise AND) 한글 획순 렌더링 엔진
1. 초성 / 중성 / 종성을 원본 상대 위치를 유지한 채 독립된 투명 BGRA 레이어로 물리적 분리
2. cv2.threshold + cv2.bitwise_and 엄격한 이진 마스크 스위칭 (색 번짐, 반투명 가산 왜곡 0% 차단)
3. 둥근 캡(Round Cap) + 미세 가우시안 블러(Gaussian Blur) 먹물 스밈 효과
"""

import os, sys, re, json, math
import cv2
import numpy as np
from PIL import Image

sys.path.append(os.path.abspath('.'))
from tools.auto_segmenter import segment_hangul

# 베지에 곡선 다각형 변환 유틸
def sample_quadratic_bezier(p0, p1, p2, num_pts=10):
    pts = []
    for i in range(1, num_pts + 1):
        t = i / float(num_pts)
        omt = 1.0 - t
        x = omt * omt * p0[0] + 2.0 * omt * t * p1[0] + t * t * p2[0]
        y = omt * omt * p0[1] + 2.0 * omt * t * p1[1] + t * t * p2[1]
        pts.append((x, y))
    return pts

def svg_path_to_polygons(path_str, matrix=(0.17, 0, 0, -0.17, 18.0, 168.0), scale_factor=2.0):
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
                bezier_pts = sample_quadratic_bezier(curr_pt, p1, p2, num_pts=10)
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
    def __init__(self, char, width=400, height=400):
        self.char = char
        self.width = width
        self.height = height
        self.scale_factor = width / 200.0

        # 1. 완성형 글리프 역분해
        self.seg = segment_hangul(char)
        if not self.seg:
            raise ValueError(f"글자 '{char}'에 대한 글리프를 추출할 수 없습니다.")

        # 2. 색상 팔레트 (BGRA)
        self.COLOR_CHO  = (248, 189, 56,  255) # Skyblue
        self.COLOR_JUNG = (252, 132, 192, 255) # Purple
        self.COLOR_JONG1 = (60,  146, 251, 255) # Orange
        self.COLOR_JONG2 = (182, 114, 244, 255) # Pink

        # 3. 레이어 단위 물리적 분리 렌더링 (원점 좌표 100% 보존)
        self.layer_cho = render_svg_to_layer(self.seg['choPath'], width, height, color=self.COLOR_CHO)
        self.layer_jung = render_svg_to_layer(self.seg['jungPath'], width, height, color=self.COLOR_JUNG)

        # 종성 (단일받침 또는 겹받침 분리)
        if len(self.seg['jongPaths']) > 1:
            self.layer_jong1 = render_svg_to_layer(self.seg['jongPaths'][0], width, height, color=self.COLOR_JONG1)
            self.layer_jong2 = render_svg_to_layer(self.seg['jongPaths'][1], width, height, color=self.COLOR_JONG2)
            self.layer_jong = cv2.add(self.layer_jong1, self.layer_jong2)
        elif len(self.seg['jongPaths']) == 1:
            self.layer_jong1 = render_svg_to_layer(self.seg['jongPaths'][0], width, height, color=self.COLOR_JONG1)
            self.layer_jong2 = None
            self.layer_jong = self.layer_jong1
        else:
            self.layer_jong1 = None
            self.layer_jong2 = None
            self.layer_jong = np.zeros((height, width, 4), dtype=np.uint8)

        # 전체 은은한 밑바탕 가이드
        self.layer_guide = render_svg_to_layer(self.seg['totalPath'], width, height, color=(60, 60, 60, 70))

        # 획순 스케줄 로드
        self._load_strokes()

    def _load_strokes(self):
        # hangul_font_vectors 및 stroke_composer 플랜 로드
        with open('assets/hangul_stroke_data.json', 'r', encoding='utf-8') as f:
            stroke_db = json.load(f)

        # 임시 기본 획순 좌표 로직 (hangul_stroke_composer와 1:1 대응)
        # 각 획 정보: { 'role': 'cho'|'jung'|'jong', 'pts': [...] }
        # 실제 좌표 파서
        self.stroke_plans = self._extract_stroke_points()

    def _extract_stroke_points(self):
        # node 스크립트를 통해 HangulStrokeComposer.composeStrokePlan(char)에서 점 목록 추출
        # 또는 파이썬 정규식으로 직접 추출
        import subprocess
        node_cmd = f"node -e \"const c = require('./assets/hangul_stroke_composer.js'); console.log(JSON.stringify(c.composeStrokePlan('{self.char}')));\""
        out = subprocess.check_output(node_cmd, shell=True, encoding='utf-8')
        plan = json.loads(out)
        
        strokes = []
        for st in plan['strokes']:
            d = st['d']
            # SVG d 문자열에서 점들 파싱
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
                        curve = sample_quadratic_bezier(curr, p1, p2, num_pts=15)
                        pts.extend(curve)
                        curr = p2
            strokes.append({
                'role': st['role'],
                'bx': st['bx'] * self.scale_factor,
                'by': st['by'] * self.scale_factor,
                'pts': pts
            })
        return strokes

    def create_stroke_mask(self, stroke_pts, progress, thickness=36, blur=True):
        """
        주어진 획의 점 목록과 진행도(0.0 ~ 1.0)에 따라 그레이스케일 마스크 생성
        - Stroke Cap: Round (cv2.LINE_AA, line_cap 원형)
        - 이진화: cv2.threshold
        - 가우시안 블러: 먹물 스밈 엣지
        """
        mask = np.zeros((self.height, self.width), dtype=np.uint8)
        if not stroke_pts or progress <= 0.0:
            return mask

        num_pts = len(stroke_pts)
        cutoff = max(1, int(math.ceil(num_pts * progress)))
        active_pts = stroke_pts[:cutoff]

        # 둥근 캡과 이어진 선 그리기
        int_pts = [np.array(active_pts, dtype=np.int32).reshape((-1, 1, 2))]
        cv2.polylines(mask, int_pts, isClosed=False, color=255, thickness=thickness, lineType=cv2.LINE_AA)

        # 핵심 기법 3: 모든 꺾임점과 끝점에 둥근 원(Round Cap & Join) 확실하게 보장
        r = thickness // 2
        for p in active_pts:
            cv2.circle(mask, (int(round(p[0])), int(round(p[1]))), r, 255, -1, lineType=cv2.LINE_AA)

        # 핵심 기법 2: 마스크를 이진화(Binary)하여 반투명으로 겹치는 현상 차단
        _, mask_binary = cv2.threshold(mask, 10, 255, cv2.THRESH_BINARY)

        # 핵심 기법 3: 미세 가우시안 블러로 먹물이 스며들듯 자연스러운 엣지
        if blur:
            mask_binary = cv2.GaussianBlur(mask_binary, (5, 5), 0)

        return mask_binary

    def render_frame(self, current_stroke_idx, stroke_progress):
        """
        핵심 기법 1: 레이어 단위 자소 분리 및 순차 활성화
        - 초성 획 진행 중: layer_cho에만 마스크 적용
        - 초성 완료 후: layer_cho 100% 유지 + layer_jung에 마스크 시작
        - 중성 완료 후: layer_cho + layer_jung 100% + layer_jong에 마스크 시작
        """
        active_cho_mask  = np.zeros((self.height, self.width), dtype=np.uint8)
        active_jung_mask = np.zeros((self.height, self.width), dtype=np.uint8)
        active_jong1_mask = np.zeros((self.height, self.width), dtype=np.uint8)
        active_jong2_mask = np.zeros((self.height, self.width), dtype=np.uint8)

        for idx, st in enumerate(self.stroke_plans):
            if idx < current_stroke_idx:
                prog = 1.0
            elif idx == current_stroke_idx:
                prog = stroke_progress
            else:
                prog = 0.0

            if prog <= 0.0:
                continue

            m = self.create_stroke_mask(st['pts'], prog, thickness=60, blur=False)

            if st['role'] == 'cho':
                active_cho_mask = cv2.bitwise_or(active_cho_mask, m)
            elif st['role'] == 'jung':
                active_jung_mask = cv2.bitwise_or(active_jung_mask, m)
            elif st['role'] == 'jong':
                if self.layer_jong2 is not None and st['bx'] >= self.width * 0.5:
                    active_jong2_mask = cv2.bitwise_or(active_jong2_mask, m)
                else:
                    active_jong1_mask = cv2.bitwise_or(active_jong1_mask, m)

        # 핵심 기법 2: 각 레이어별로 엄격한 cv2.bitwise_and 추출 (타 자소 침범 0%)
        cho_masked = cv2.bitwise_and(self.layer_cho, self.layer_cho, mask=active_cho_mask)
        jung_masked = cv2.bitwise_and(self.layer_jung, self.layer_jung, mask=active_jung_mask)

        jong_out = np.zeros((self.height, self.width, 4), dtype=np.uint8)
        if self.layer_jong2 is not None:
            j1 = cv2.bitwise_and(self.layer_jong1, self.layer_jong1, mask=active_jong1_mask)
            j2 = cv2.bitwise_and(self.layer_jong2, self.layer_jong2, mask=active_jong2_mask)
            jong_out = cv2.add(j1, j2)
        else:
            jong_out = cv2.bitwise_and(self.layer_jong, self.layer_jong, mask=active_jong1_mask)

        # 최종 합성: 다크 배경(0x07, 0x0b, 0x14) 위에 가이드 + 자소별 레이어 오버레이
        bg = np.full((self.height, self.width, 3), (20, 11, 7), dtype=np.uint8) # BGR dark

        # 가이드 밑바탕 합성
        self._overlay_rgba(bg, self.layer_guide)

        # 분리된 자소 마스킹 결과 순차 합성 (물리적으로 분리되어 있어 겹침 번짐 0%)
        self._overlay_rgba(bg, cho_masked)
        self._overlay_rgba(bg, jung_masked)
        self._overlay_rgba(bg, jong_out)

        return bg

    def _overlay_rgba(self, bg_bgr, layer_rgba):
        alpha = layer_rgba[:, :, 3] / 255.0
        for c in range(3):
            bg_bgr[:, :, c] = (1.0 - alpha) * bg_bgr[:, :, c] + alpha * layer_rgba[:, :, c]

    def render_animation_gif(self, output_path='test/layer_stroke_anim.gif', fps=20):
        frames = []
        num_strokes = len(self.stroke_plans)
        steps_per_stroke = 8

        print(f"Rendering animation for '{self.char}' ({num_strokes} strokes)...")
        for s_idx in range(num_strokes):
            for step in range(1, steps_per_stroke + 1):
                prog = step / float(steps_per_stroke)
                bgr = self.render_frame(s_idx, prog)
                rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)
                frames.append(Image.fromarray(rgb))

            # 획 간 짧은 정지
            for _ in range(2):
                frames.append(frames[-1])

        # 완료 후 잠시 대기
        for _ in range(10):
            frames.append(frames[-1])

        frames[0].save(
            output_path,
            save_all=True,
            append_images=frames[1:],
            duration=int(1000 / fps),
            loop=0
        )
        print(f"Saved animation to {output_path} ({len(frames)} frames)")
        return output_path

if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--char', default='값', help='Target syllable')
    parser.add_argument('--name', default='gap', help='Output base filename')
    args = parser.parse_args()

    char = args.char
    name = args.name

    print(f"Starting rendering for char: '{char}' (output name: {name})")
    renderer = LayerHangulRenderer(char, width=400, height=400)

    # 개별 레이어 파일로 저장하여 분리 검증
    cv2.imwrite(f'test/layer_{name}_cho.png', renderer.layer_cho)
    cv2.imwrite(f'test/layer_{name}_jung.png', renderer.layer_jung)
    cv2.imwrite(f'test/layer_{name}_jong.png', renderer.layer_jong)
    print(f"Saved individual layers for '{char}' ({name})")

    # 중간 진행 프레임 저장 (초성 완료, 중성 진행 중 상태)
    mid_frame = renderer.render_frame(current_stroke_idx=1, stroke_progress=0.7)
    cv2.imwrite(f'test/frame_{name}_mid.png', mid_frame)

    # 최종 완료 프레임 저장
    final_frame = renderer.render_frame(current_stroke_idx=len(renderer.stroke_plans)-1, stroke_progress=1.0)
    cv2.imwrite(f'test/frame_{name}_final.png', final_frame)

    # GIF 애니메이션 저장
    renderer.render_animation_gif(f'test/anim_{name}_bitwise.gif')
