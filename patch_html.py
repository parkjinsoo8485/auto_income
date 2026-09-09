import re

def patch_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()
        
    with open('extracted_101.js', 'r', encoding='utf-8') as f:
        patch_101 = f.read()
        
    with open('extracted_213.js', 'r', encoding='utf-8') as f:
        patch_213 = f.read()

    # Find the old stroke mode block to replace
    # Starts with // ─── Stroke Order or // ═══════════════════════════════════════════════════════
    # Ends with function prevStroke(){ ... }
    
    start_str = "// ─── Stroke Order"
    end_str = "renderStrokeMode(); }"
    
    start_idx = html.find(start_str)
    end_idx = html.find(end_str, start_idx) + len(end_str)
    
    if start_idx == -1 or end_idx < start_idx:
        print(f"Could not find old stroke block in {filepath}")
        return
        
    # Apply patch 101
    html = html[:start_idx] + patch_101 + html[end_idx:]
    
    # Now apply patch 213 inside the new html
    # Patch 213 replaced decomposeHangulSyllable
    # The target in 213 was:
    target_start = "// Decompose Hangul syllable with authentic Korean typography layout proportions"
    target_end = "part.strokes.forEach((st, stIdx) => {"
    
    t_start_idx = html.find(target_start)
    t_end_idx = html.find(target_end, t_start_idx) + len(target_end)
    
    if t_start_idx == -1 or t_end_idx < t_start_idx:
        print(f"Could not find target for patch 213 in {filepath}")
        return
        
    html = html[:t_start_idx] + patch_213 + html[t_end_idx:]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)
        
    print(f"Successfully patched {filepath}")

patch_file('index.html')
patch_file('web_simulator.html')
