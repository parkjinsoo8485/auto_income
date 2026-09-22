# -*- coding: utf-8 -*-
"""
test/batch_layer_render.py
대표 복합 한글 음절 일괄 비트 연산 렌더링 스크립트
'값', '꽃', '닭', '꿈', '광', '한' 등을 렌더링하여
레이어별 투명 PNG, 중간 프레임, 최종 프레임, 고화질 GIF 애니메이션을 일괄 생성
"""

import os, sys, time
sys.path.append(os.path.abspath('.'))
from engine.layer_hangul_renderer import LayerHangulRenderer

TARGET_CHARS = [
    ('값', 'gap', '겹받침(ㅂㅅ) + 세로모음(ㅏ)'),
    ('꽃', 'ggot', '쌍초성(ㄲ) + 가로모음(ㅗ) + 복합받침(ㅊ)'),
    ('닭', 'dak', '단초성(ㄷ) + 겹받침(ㄹㄱ)'),
    ('꿈', 'kkum', '쌍초성(ㄲ) + 외곽선 결합형(ㅜ+ㅁ)'),
    ('광', 'gwang', '복합모음(ㅘ) + 이응받침(ㅇ)'),
    ('한', 'han', '대표 한글(ㅎ+ㅏ+ㄴ)')
]

def run_batch():
    out_dir = 'test'
    os.makedirs(out_dir, exist_ok=True)
    
    print("=" * 60)
    print("🚀 한글 자소 분리 & OpenCV 비트 연산 정밀 합성 엔진 배치 렌더링")
    print("=" * 60)

    start_total = time.time()
    results = []

    for char, name, desc in TARGET_CHARS:
        t0 = time.time()
        print(f"\n▶ 렌더링 진행: '{char}' ({name}) - {desc}")
        renderer = LayerHangulRenderer(char, width=360, height=360, color_mode='vibrant', bg_mode='dark')

        # 1. 레이어별 투명 PNG 저장
        layer_files = renderer.export_layers(out_dir, prefix=f"layer_{name}")
        
        # 2. GIF 애니메이션 생성
        gif_path = os.path.join(out_dir, f"anim_{name}_bitwise.gif")
        renderer.render_animation_gif(gif_path, fps=20, steps_per_stroke=7)

        # 3. 중간 및 최종 프레임 저장
        import cv2
        mid_idx = len(renderer.stroke_plans) // 2
        mid_frame = renderer.render_frame(current_stroke_idx=mid_idx, stroke_progress=0.5)
        final_frame = renderer.render_frame(current_stroke_idx=len(renderer.stroke_plans)-1, stroke_progress=1.0)
        cv2.imwrite(os.path.join(out_dir, f"frame_{name}_mid.png"), mid_frame)
        cv2.imwrite(os.path.join(out_dir, f"frame_{name}_final.png"), final_frame)

        elapsed = time.time() - t0
        print(f"  ✓ 완료 ({elapsed:.2f}초) -> {gif_path}")
        results.append({
            'char': char,
            'name': name,
            'desc': desc,
            'elapsed': elapsed,
            'strokes': len(renderer.stroke_plans),
            'gif': gif_path
        })

    total_time = time.time() - start_total
    print("\n" + "=" * 60)
    print(f"✨ 전체 배치 렌더링 완료 (총 소요시간: {total_time:.2f}초, {len(TARGET_CHARS)}개 음절)")
    print("=" * 60)

if __name__ == '__main__':
    run_batch()
