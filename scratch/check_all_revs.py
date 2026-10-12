import urllib.request
import urllib.parse
import ssl
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

for rev in ['1', '2', '3']:
    data = urllib.parse.urlencode({
        'lang': 'ko',
        'tmp_revCd': rev,
        'pageIndex': 1
    }).encode('utf-8')
    req = urllib.request.Request(
        'https://epstopik.hrdkorea.or.kr/epstopik/book/pub/publicWorkBookCmList.do',
        data=data,
        headers={'User-Agent': 'Mozilla/5.0'}
    )
    with urllib.request.urlopen(req, context=ctx, timeout=15) as res:
        html = res.read().decode('utf-8', errors='ignore')
    
    print(f"=== REV CD {rev} ===")
    matches = re.findall(r'href=[\'"]([^\'"]+?\.(?:zip|mp3|hwp|pdf))[\'"]', html, re.I)
    for m in set(matches):
        print("  ->", m)
