with open('web_simulator.html', 'r', encoding='utf-8') as f:
    text = f.read()
import re
print("Functions with 'Mode':")
for m in re.finditer(r'function\s+([a-zA-Z0-9_]*Mode[a-zA-Z0-9_]*)\s*\(', text):
    print(" ", m.group(1))

print("\nButtons mentioning 'stroke' or '획순':")
for line in text.splitlines():
    if 'stroke' in line.lower() or '획순' in line:
        if '<button' in line or 'onclick' in line or '<nav' in line or 'class="tab' in line:
            print(" ", line.strip()[:120])
