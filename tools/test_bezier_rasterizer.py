# -*- coding: utf-8 -*-
import re, json, cv2, numpy as np

def sample_quadratic_bezier(p0, p1, p2, num_pts=8):
    pts = []
    for i in range(1, num_pts + 1):
        t = i / float(num_pts)
        omt = 1.0 - t
        x = omt * omt * p0[0] + 2.0 * omt * t * p1[0] + t * t * p2[0]
        y = omt * omt * p0[1] + 2.0 * omt * t * p1[1] + t * t * p2[1]
        pts.append((x, y))
    return pts

def svg_path_to_polygons(path_str, matrix=(0.17, 0, 0, -0.17, 18.0, 168.0), scale_factor=2.0):
    """
    SVG Path (M, L, Q, Z)를 2D 픽셀 좌표 다각형(Polygon) 리스트로 변환
    matrix: [a, b, c, d, tx, ty]
    x_canvas = (x_font * a + y_font * c + tx) * scale_factor
    y_canvas = (x_font * b + y_font * d + ty) * scale_factor
    """
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
            # M 다음에 여러 좌표가 올 경우 L로 취급
            while idx + 1 < len(nums):
                curr_pt = transform_pt(nums[idx], nums[idx+1])
                current_poly.append(curr_pt)
                idx += 2
        elif cmd == 'L':
            while idx + 1 < len(nums):
                curr_pt = transform_pt(nums[idx], nums[idx+1])
                current_poly.append(curr_pt)
                idx += 2
        elif cmd == 'H':
            for val in nums:
                # font 좌표 역환산 대신 원래 좌표 추출을 위해 필요시 처리
                pass
        elif cmd == 'V':
            for val in nums:
                pass
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

def render_path_to_layer(path_str, width=400, height=400, color=(255, 255, 255, 255), matrix=(0.17, 0, 0, -0.17, 18.0, 168.0)):
    """
    투명 RGBA 캔버스에 SVG Path를 렌더링하여 반환
    """
    layer = np.zeros((height, width, 4), dtype=np.uint8)
    if not path_str:
        return layer

    scale_factor = width / 200.0 # 200 viewport 기준
    polys = svg_path_to_polygons(path_str, matrix=matrix, scale_factor=scale_factor)

    # OpenCV fillPoly는 정수 좌표 필요
    cv_polys = [np.array(p, dtype=np.int32).reshape((-1, 1, 2)) for p in polys]
    if cv_polys:
        # 단일 채널 마스크에 먼저 채우기 (Even-Odd 또는 Non-Zero Winding Rule)
        mask = np.zeros((height, width), dtype=np.uint8)
        cv2.fillPoly(mask, cv_polys, 255)

        # RGBA 레이어에 채우기
        b, g, r, a = color
        layer[mask > 0] = [b, g, r, a]

    return layer

if __name__ == '__main__':
    import sys, os
    sys.path.append(os.path.abspath('.'))
    from tools.auto_segmenter import segment_hangul
    res = segment_hangul('값')
    if res:
        print('Segmented 값 successfully!')
        cho_layer = render_path_to_layer(res['choPath'], 400, 400, color=(248, 189, 56, 255)) # Skyblue
        cv2.imwrite('test/cho_layer.png', cho_layer)
        print('Saved test/cho_layer.png, non-zero pixels:', np.count_nonzero(cho_layer[:,:,3]))
