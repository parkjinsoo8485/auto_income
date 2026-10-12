import json
import sys

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

with open('epstopik_1917_bank.js', 'r', encoding='utf-8') as f:
    text = f.read()

s = text.find('[')
e = text.rfind(']') + 1
bank = json.loads(text[s:e])

l_bank = [q for q in bank if q.get('type') == 'L']
print(f"Total L questions: {len(l_bank)}")

for i in [40, 41, 42, 50, 100]:
    q = l_bank[i-1]
    print(f"--- Q#{q['id']} (order={q.get('order')}) ---")
    print("instruction:", q.get('instruction'))
    print("dialogue:", repr(q.get('dialogue')))
    print("options:", q.get('options'))
