import json
import random
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

random.seed(123)
l_pool = [q for q in bank if q.get('type') == 'L']
r_pool = [q for q in bank if q.get('type') == 'R']

sampled_l = random.sample(l_pool, 5)
sampled_r = random.sample(r_pool, 5)

print("=== SAMPLE LISTENING QUESTIONS ===")
for q in sampled_l:
    print(f"ID: {q['id']}, Order: {q.get('order')}, Category: {q.get('category')}")
    print(f"  Instruction: {q.get('instruction')}")
    print(f"  Dialogue: {q.get('dialogue')}")
    print(f"  Options: {q.get('options')}")
    print(f"  Answer: {q.get('answer')}")

print("\n=== SAMPLE READING QUESTIONS ===")
for q in sampled_r:
    print(f"ID: {q['id']}, Order: {q.get('order')}, Category: {q.get('category')}")
    print(f"  Instruction: {q.get('instruction')}")
    print(f"  Passage: {q.get('passage')}")
    print(f"  Visual: {q.get('visual')}")
    print(f"  Options: {q.get('options')}")
    print(f"  Answer: {q.get('answer')}")
