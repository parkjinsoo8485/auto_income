import json
import sys

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

with open('epstopik_1917_bank.js', 'r', encoding='utf-8') as f:
    text = f.read()

s = text.find('[')
e = text.rfind(']') + 1
bank = json.loads(text[s:e])

l_items = [q for q in bank if q.get('type') == 'L']
print(f"Total L questions: {len(l_items)}")
for q in l_items[:10]:
    print(f"ID={q['id']}, order={q.get('order')}, instruction={q.get('instruction')}")
    print(f"  dialogue: {repr(q.get('dialogue'))}")
    print(f"  options: {q.get('options')}")
