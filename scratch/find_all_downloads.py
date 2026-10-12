import urllib.request, ssl, re, urllib.parse

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

req = urllib.request.Request(
    'https://epstopik.hrdkorea.or.kr/epstopik/book/pub/publicWorkBookList.do?lang=ko',
    headers={'User-Agent': 'Mozilla/5.0'}
)
with urllib.request.urlopen(req, context=ctx, timeout=15) as res:
    html = res.read().decode('utf-8', errors='ignore')

# Find all zip or mp3
matches = re.findall(r'href=[\'"]([^\'"]+?\.(?:zip|mp3))[\'"]', html, re.IGNORECASE)
print(f"Total archive links: {len(matches)}")
for m in set(matches):
    print(" -", m)

# Also check for javascript download calls like fn_download or similar
js_calls = re.findall(r'onclick=[\'"]([^\'"]*?(?:down|file)[^\'"]*?)[\'"]', html, re.IGNORECASE)
for c in set(js_calls):
    print(" JS Call:", c)
