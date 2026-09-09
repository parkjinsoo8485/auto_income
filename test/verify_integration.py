import sys
from playwright.sync_api import sync_playwright
import os

def test_file(filename, shot_prefix):
    path = 'file:///' + os.path.abspath(filename).replace('\\', '/')
    print(f"Testing {filename} ({path})...")

    with sync_playwright() as p:
        browser = p.chromium.launch()
        # 모바일 화면을 담는 뷰포트
        page = browser.new_page(viewport={'width': 500, 'height': 950})
        errors = []
        page.on('console', lambda msg: errors.append(f"[{msg.type}] {msg.text}") if msg.type == 'error' else None)
        page.on('pageerror', lambda err: errors.append(str(err)))

        page.goto(path)
        page.wait_for_timeout(1000)

        # 1. 온보딩 건너뛰기
        print("  Skipping onboarding...")
        page.evaluate("skipOnboarding()")
        page.wait_for_timeout(500)

        # 2. 학습 탭 전환 & 획순 모드 전환
        print("  Switching to learn tab and stroke mode...")
        page.evaluate("switchTab('learn')")
        page.wait_for_timeout(300)
        page.evaluate("switchMode('stroke')")
        page.wait_for_timeout(1500)

        # 3. 획순 첫 화면 캡처
        page.screenshot(path=f'test/{shot_prefix}_initial.png')

        # 4. 다음 글자 탭 (setStrokeChar(1))
        print("  Testing setStrokeChar(1)...")
        page.evaluate("setStrokeChar(1)")
        page.wait_for_timeout(1000)
        page.screenshot(path=f'test/{shot_prefix}_char2.png')

        # 5. 다음 단어 이동 (nextStroke())
        print("  Testing nextStroke()...")
        page.evaluate("nextStroke()")
        page.wait_for_timeout(1000)
        page.screenshot(path=f'test/{shot_prefix}_next_word.png')

        # 6. 이전 획 단계 탐색 (stepStrokePrev())
        print("  Testing stepStrokePrev()...")
        page.evaluate("stepStrokePrev()")
        page.wait_for_timeout(500)
        page.screenshot(path=f'test/{shot_prefix}_step.png')

        browser.close()

    print(f"  Errors for {filename}: {len(errors)}")
    if errors:
        for e in errors:
            print(f"    {e}")
    print(f"  Screenshots saved for {filename}!\n")

if __name__ == '__main__':
    test_file('web_simulator.html', 'sim_stroke')
    test_file('index.html', 'index_stroke')
