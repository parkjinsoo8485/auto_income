# -*- coding: utf-8 -*-
import os, sys
import cv2
import numpy as np

sys.path.append('.')
from engine.layer_hangul_renderer import LayerHangulRenderer

out_dir = 'scratch/anim_frames_debug'
os.makedirs(out_dir, exist_ok=True)

char_map = [
    ('꽃', 'ggot'),
    ('닭', 'dak'),
    ('값', 'gap'),
    ('한', 'han'),
    ('꿈', 'kkum')
]

for ch, name in char_map:
    renderer = LayerHangulRenderer(ch, width=360, height=360, color_mode='vibrant', bg_mode='dark')
    ch_dir = os.path.join(out_dir, name)
    os.makedirs(ch_dir, exist_ok=True)
    
    print(f"Dumping frames for {ch} ({name}, {len(renderer.stroke_plans)} strokes)...")
    for s_idx, st in enumerate(renderer.stroke_plans):
        for prog in [0.5, 1.0]:
            frame = renderer.render_frame(s_idx, prog)
            fname = f"s{s_idx}_{st['role']}_p{int(prog*100)}.png"
            target_path = os.path.join(ch_dir, fname)
            success, enc = cv2.imencode('.png', frame)
            if success:
                with open(target_path, 'wb') as f:
                    f.write(enc.tobytes())

print("Frames dumped successfully!")
