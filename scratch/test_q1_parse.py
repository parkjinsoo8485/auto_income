import sys
import json
import os
import re

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

sys.path.insert(0, os.path.abspath("scratch"))
import generate_cbt_official_audio as gen

with open('epstopik_1917_bank.js', 'r', encoding='utf-8') as f:
    text = f.read()

s = text.find('[')
e = text.rfind(']') + 1
bank = json.loads(text[s:e])

q1 = bank[0]
print("Question 1:", q1['id'], q1['instruction'])
print("Dialogue:", repr(q1['dialogue']))
turns = gen.parse_dialogue_turns(q1['dialogue'])
print("Parsed turns:", turns)
