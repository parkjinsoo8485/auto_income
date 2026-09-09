import re

def transform(x, y):
    dx = x - 0.5
    dy = y - 0.5
    
    # x shift: bottom moves left, top moves right (like italic)
    new_x = x - (dy * 0.05)
    
    # y shift: right moves up, left moves down (like slanted handwriting)
    new_y = y - (dx * 0.06)
    
    return round(new_x, 3), round(new_y, 3)

def process_file(filepath, is_dart=False):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # We only want to patch the HANGUL_STROKES_DB area to be safe.
    if is_dart:
        # Match Offset(0.12, 0.22)
        pattern = r'Offset\(\s*(0\.\d+)\s*,\s*(0\.\d+)\s*\)'
        
        def repl(match):
            x = float(match.group(1))
            y = float(match.group(2))
            nx, ny = transform(x, y)
            return f"Offset({nx:.3f}, {ny:.3f})"
            
        new_content = re.sub(pattern, repl, content)
    else:
        # Match [0.12, 0.22] - but only inside HANGUL_STROKES_DB
        start_idx = content.find('const HANGUL_STROKES_DB = {')
        end_idx = content.find('// ═══════════════════════════════════════════════════════════════════')
        
        if start_idx == -1 or end_idx == -1:
            print(f"Could not find HANGUL_STROKES_DB in {filepath}")
            return
            
        db_content = content[start_idx:end_idx]
        
        pattern = r'\[\s*(0\.\d+)\s*,\s*(0\.\d+)\s*\]'
        
        def repl(match):
            x = float(match.group(1))
            y = float(match.group(2))
            nx, ny = transform(x, y)
            return f"[{nx:.3f}, {ny:.3f}]"

        new_db_content = re.sub(pattern, repl, db_content)
        new_content = content[:start_idx] + new_db_content + content[end_idx:]

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"Patched {filepath}")

process_file('index.html')
process_file('web_simulator.html')
process_file('templates/flutter_app/lib/models/hangul_stroke_data.dart', is_dart=True)
print("Done.")
