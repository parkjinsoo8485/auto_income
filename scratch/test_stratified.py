import json, re, random

with open('epstopik_1917_bank.js', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'const EPSTOPIK_1917_BANK = (\[.*\]);', text, re.DOTALL)
bank = json.loads(m.group(1))

all_l = [q for q in bank if q.get('type') == 'L']
all_r = [q for q in bank if q.get('type') == 'R']

def extract_diversified(pool, target_count=20):
    cats = {}
    for q in pool:
        c = q.get('category', '기타')
        cats.setdefault(c, []).append(q)
    
    cat_keys = list(cats.keys())
    random.shuffle(cat_keys)
    
    selected = []
    for c in cat_keys[:target_count]:
        q = random.choice(cats[c])
        selected.append(q)
    
    if len(selected) < target_count:
        remain_pool = [q for q in pool if q not in selected]
        random.shuffle(remain_pool)
        selected.extend(remain_pool[:target_count - len(selected)])
    
    return selected

sampled_l = extract_diversified(all_l, 20)
sampled_r = extract_diversified(all_r, 20)

print(f"Sampled L count: {len(sampled_l)}, Unique L cats: {len(set(q['category'] for q in sampled_l))}")
print(f"Sampled R count: {len(sampled_r)}, Unique R cats: {len(set(q['category'] for q in sampled_r))}")
print("\nSampled L categories:")
for idx, q in enumerate(sampled_l):
    print(f"  [{idx+1:02d}] {q['category']} (ID: {q['id']}, Order: {q['order']}) - {q['dialogue'][:35]}...")

print("\nSampled R categories:")
for idx, q in enumerate(sampled_r):
    print(f"  [{idx+21:02d}] {q['category']} (ID: {q['id']}, Order: {q['order']}) - {q['passage'][:35]}...")
