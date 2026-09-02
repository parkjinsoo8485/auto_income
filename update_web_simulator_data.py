import json

print("Starting web_simulator.html data update...")

with open('web_simulator.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Load all 6 levels from data/
all_levels_data = {}
for lvl in range(1, 7):
    with open(f'data/topik_level{lvl}.json', 'r', encoding='utf-8') as f:
        d = json.load(f)
        all_levels_data[lvl] = d['words']

# Build JS block for TOPIK_DATA
js_lines = ["const TOPIK_DATA = {};\n"]
for lvl in range(1, 7):
    words_json = json.dumps(all_levels_data[lvl], ensure_ascii=False, indent=2)
    js_lines.append(f"TOPIK_DATA[{lvl}] = {words_json};\n")

new_topik_data_block = "\n".join(js_lines)

# Locate TOPIK_DATA definition start and end in web_simulator.html
start_marker = "const TOPIK_DATA = {};"
end_marker = "// ─── localStorage helpers ───"

start_idx = html.find(start_marker)
end_idx = html.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print(f"Error: Markers not found! start_idx={start_idx}, end_idx={end_idx}")
    exit(1)

updated_html = html[:start_idx] + new_topik_data_block + "\n" + html[end_idx:]

with open('web_simulator.html', 'w', encoding='utf-8') as f:
    f.write(updated_html)

print("Successfully injected 600 enriched words into web_simulator.html!")
