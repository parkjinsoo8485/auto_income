# -*- coding: utf-8 -*-
import os, sys, cv2
sys.path.append(os.path.abspath('.'))
from engine.layer_hangul_renderer import LayerHangulRenderer

targets = [
    ('값', 'gap'),
    ('곰', 'gom'),
    ('닭', 'dak'),
    ('한', 'han')
]

for char, name in targets:
    print(f"=== Processing '{char}' ({name}) ===")
    renderer = LayerHangulRenderer(char, width=400, height=400)

    # 1. 자소 분리 레이어 저장 (투명 배경 BGRA)
    cv2.imwrite(f'test/layer_{name}_cho.png', renderer.layer_cho)
    cv2.imwrite(f'test/layer_{name}_jung.png', renderer.layer_jung)
    cv2.imwrite(f'test/layer_{name}_jong.png', renderer.layer_jong)

    # 2. 중간 진행 프레임 (초성 완료, 중성 진행 중 -> 종성 노출 0% 확인)
    mid_frame = renderer.render_frame(current_stroke_idx=1, stroke_progress=0.7)
    cv2.imwrite(f'test/frame_{name}_mid.png', mid_frame)

    # 3. 최종 완료 프레임
    final_frame = renderer.render_frame(current_stroke_idx=len(renderer.stroke_plans)-1, stroke_progress=1.0)
    cv2.imwrite(f'test/frame_{name}_final.png', final_frame)

    # 4. GIF 애니메이션 저장
    renderer.render_animation_gif(f'test/anim_{name}_bitwise.gif', fps=20)
    print(f"Done '{char}' -> anim_{name}_bitwise.gif")
