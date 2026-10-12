import json, re

with open('epstopik_1917_bank.js', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'const EPSTOPIK_1917_BANK = (\[.*\]);', text, re.DOTALL)
if m:
    data = json.loads(m.group(1))
    print(f'Total items: {len(data)}')
    l_list = [q for q in data if q.get('type') == 'L']
    r_list = [q for q in data if q.get('type') == 'R']
    print(f'L items: {len(l_list)}, R items: {len(r_list)}')
    
    l_cats = {}
    for q in l_list:
        c = q.get('category', 'None')
        l_cats[c] = l_cats.get(c, 0) + 1
    r_cats = {}
    for q in r_list:
        c = q.get('category', 'None')
        r_cats[c] = r_cats.get(c, 0) + 1
    print('\nL categories:', json.dumps(l_cats, ensure_ascii=False, indent=2))
    print('\nR categories:', json.dumps(r_cats, ensure_ascii=False, indent=2))

    l_dia = [q.get('dialogue', '') for q in l_list]
    print(f'\nUnique L dialogues: {len(set(l_dia))} / {len(l_list)}')
    r_pas = [q.get('passage', '') for q in r_list]
    print(f'Unique R passages: {len(set(r_pas))} / {len(r_list)}')

    # check options
    print('\nChecking first 10 L questions:')
    for q in l_list[:10]:
        print(f"ID: {q['id']}, Category: {q.get('category')}, Dialogue: {q.get('dialogue')}")

    print('\nChecking first 10 R questions:')
    for q in r_list[:10]:
        print(f"ID: {q['id']}, Category: {q.get('category')}, Passage: {q.get('passage')}")
