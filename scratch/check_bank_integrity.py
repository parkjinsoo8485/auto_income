import json
import sys

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

with open('epstopik_1917_bank.js', 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('[')
end = text.rfind(']') + 1
bank = json.loads(text[start:end])

print(f"Total questions in bank: {len(bank)}")
bad_items = []
l_count = 0
r_count = 0
for i, q in enumerate(bank):
    errs = []
    if q.get('type') == 'L': l_count += 1
    elif q.get('type') == 'R': r_count += 1
    else: errs.append(f"invalid type: {q.get('type')}")

    opts = q.get('options')
    if not isinstance(opts, list) or len(opts) != 4:
        errs.append(f"options count: {len(opts) if isinstance(opts, list) else 'not a list'}")

    ans = q.get('answer')
    if not isinstance(ans, int) or ans < 1 or ans > 4:
        errs.append(f"invalid answer: {ans}")

    if not q.get('instruction'):
        errs.append("no instruction")

    if errs:
        bad_items.append((i, q.get('id'), q.get('title'), errs))

print(f"L count: {l_count}, R count: {r_count}")
print(f"Bad items: {len(bad_items)}")
if bad_items:
    for item in bad_items[:10]:
        print(" ", item)
