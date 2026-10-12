import sys
import re

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

with open('topik_questions.html', 'r', encoding='utf-8') as f:
    c = f.read()

idx = c.find('function setupQuestionAudio')
print("=== setupQuestionAudio ===")
print(c[idx:idx+2500])

idx2 = c.find('function renderQuestion(')
if idx2 != -1:
    print("\n=== renderQuestion ===")
    print(c[idx2:idx2+1500])
