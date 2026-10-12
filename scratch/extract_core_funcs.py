import re
import sys

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

with open('topik_questions.html', 'r', encoding='utf-8') as f:
    html = f.read()

funcs = [
    'setupQuestionAudio',
    'toggleAudioPlayback',
    'playWithWebSpeechFallback',
    'renderCurrentQuestion',
    'generateRandomExam',
    'loadExamRound'
]

for fn in funcs:
    print(f"\n==================== {fn} ====================")
    m = re.search(r'function\s+' + fn + r'\s*\([^)]*\)\s*\{', html)
    if m:
        start = m.start()
        # Find matching brace
        brace_cnt = 0
        end = start
        for i in range(m.end() - 1, len(html)):
            if html[i] == '{':
                brace_cnt += 1
            elif html[i] == '}':
                brace_cnt -= 1
                if brace_cnt == 0:
                    end = i + 1
                    break
        print(html[start:end])
    else:
        print(f"NOT FOUND: {fn}")
