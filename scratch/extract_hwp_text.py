import os
import zlib
import re

dl = os.path.expanduser('~/Downloads')
for f in os.listdir(dl):
    if f.endswith('.hwp') and os.path.getsize(os.path.join(dl, f)) == 16384:
        full = os.path.join(dl, f)
        with open(full, 'rb') as fp:
            data = fp.read()
        
        # Search for zlib streams
        for i in range(len(data) - 10):
            if data[i:i+2] in [b'\x78\x9c', b'\x78\x01', b'\x78\xda']:
                try:
                    decomp = zlib.decompress(data[i:])
                    urls = re.findall(rb'https?://[^\x00\r\n\t <>"]+', decomp)
                    if urls:
                        print("Found in", f)
                        for u in urls:
                            print("  ", u.decode('utf-8', errors='ignore'))
                    # Also print any text
                    text = decomp.decode('utf-16le', errors='ignore')
                    hangul = [w for w in text.split() if any('\uac00' <= ch <= '\ud7a3' for ch in w)]
                    if hangul:
                        print("  Hangul in doc:", " ".join(hangul[:20]))
                except Exception:
                    pass
