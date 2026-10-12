import urllib.request, ssl, re
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
req = urllib.request.Request('https://epstopik.hrdkorea.or.kr/epstopik/epsHomeIndex.jsp', headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, context=ctx, timeout=10) as response:
    html = response.read().decode('utf-8', errors='ignore')
for line in html.splitlines():
    if any(k in line for k in ['공개', '문제', '학습', '자료', '듣기', 'menu', 'board']):
        print(line.strip()[:150])
