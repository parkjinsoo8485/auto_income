# -*- coding: utf-8 -*-
import cv2, os
from engine.layer_hangul_renderer import LayerHangulRenderer

for char in ['꽃', '값', '닭', '꿈', '광', '한']:
    renderer = LayerHangulRenderer(char, width=360, height=360)
    print(f"=== {char} ({len(renderer.stroke_plans)} strokes) ===")
    for idx, st in enumerate(renderer.stroke_plans):
        print(f"  Stroke {idx}: jamo={st.get('jamo')} role={st.get('role')} bx={st.get('bx'):.1f} desc={st.get('desc')}")
