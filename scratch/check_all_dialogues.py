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

empty_dia = []
for i, q in enumerate(l_bank):
    dia = q.get('dialogue') or q.get('instruction') or ''
    if not dia.strip():
        empty_dia.append(q['id'])

print(f"Empty dialogues count: {len(empty_dia)}")
if empty_dia:
    print("Sample empty IDs:", empty_dia[:10])

# Check first 20 dialogues
print("\n--- First 20 dialogues ---")
for q in l_bank[:20]:
    print(f"Q#{q['id']} [order={q.get('order')}]: {repr(q.get('dialogue'))}")
