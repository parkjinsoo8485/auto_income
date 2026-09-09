from playwright.sync_api import sync_playwright
import os

html_path = 'file:///' + os.path.abspath('test/hangul_stroke_demo.html').replace('\\', '/')

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': 1280, 'height': 800})
    page.goto(html_path)
    page.wait_for_timeout(1000)

    # 1. '한' 전체 보기
    page.click('button:has-text("전체 보기")')
    page.wait_for_timeout(500)
    page.screenshot(path='test/demo_han_all.png')

    # 2. '가'
    page.click('span:has-text("Type 1")')
    page.wait_for_timeout(300)
    page.click('button:has-text("전체 보기")')
    page.wait_for_timeout(300)
    page.screenshot(path='test/demo_ga.png')

    # 3. '닭'
    page.click('span:has-text("겹받침")')
    page.wait_for_timeout(300)
    page.click('button:has-text("전체 보기")')
    page.wait_for_timeout(300)
    page.screenshot(path='test/demo_dak.png')

    # 4. '광'
    page.click('span:has-text("Type 6")')
    page.wait_for_timeout(300)
    page.click('button:has-text("전체 보기")')
    page.wait_for_timeout(300)
    page.screenshot(path='test/demo_gwang.png')

    browser.close()

print("All screenshots generated successfully!")
