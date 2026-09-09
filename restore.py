import json
import os

transcript_path = r'C:\Users\user\.gemini\antigravity-ide\brain\d11efbfe-1492-44b6-9860-0692e4bf95e5\.system_generated\logs\transcript_full.jsonl'

with open(transcript_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Line 101 is index 100
line_101 = json.loads(lines[100])
content_101 = line_101['tool_calls'][0]['args']['ReplacementContent']

# Line 213 is index 212
line_213 = json.loads(lines[212])
content_213 = line_213['tool_calls'][0]['args']['ReplacementContent']

with open('C:\\Myproject\\auto_income\\extracted_101.js', 'w', encoding='utf-8') as f:
    f.write(content_101)

with open('C:\\Myproject\\auto_income\\extracted_213.js', 'w', encoding='utf-8') as f:
    f.write(content_213)

print("Extracted to extracted_101.js and extracted_213.js")
