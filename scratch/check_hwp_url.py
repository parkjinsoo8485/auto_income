import os
import re

dl = os.path.expanduser('~/Downloads')
for f in os.listdir(dl):
    if f.endswith('.hwp') and os.path.getsize(os.path.join(dl, f)) == 16384:
        full = os.path.join(dl, f)
        with open(full, 'rb') as fp:
            d = fp.read()
        matches = re.findall(b'https?://[^\\x00\\r\\n\\t <>"]+', d)
        if matches:
            print(f)
            for m in matches:
                print("  ->", m.decode('latin1', errors='ignore'))
