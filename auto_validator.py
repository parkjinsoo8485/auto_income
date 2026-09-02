#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AUTO-VALIDATOR: System Auto-Validation Script
- web_simulator.html 기능 검증
- 6개 TOPIK config JSON 유효성 검사
- 빌드 출력물 완정성 검사
- 수익화 모듈 점수 산출
"""
import json, os, re, sys
import io

# Force UTF-8 output on Windows
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

PASS = "\033[92m[PASS]\033[0m"
FAIL = "\033[91m[FAIL]\033[0m"
INFO = "\033[94m[INFO]\033[0m"

results = []
score = 0
total = 0

def check(name, condition, detail=""):
    global score, total
    total += 1
    if condition:
        score += 1
        print(f"  {PASS} {name}")
        results.append(("PASS", name))
    else:
        print(f"  {FAIL} {name} — {detail}")
        results.append(("FAIL", name, detail))

print("\n" + "="*60)
print("  AUTO-VALIDATOR: Korean Master TOPIK System Check")
print("="*60)

# ── 1. TOPIK DATA FILES ─────────────────────────────────────
print("\n[1] TOPIK Vocabulary Data Files")
for lvl in range(1, 7):
    path = f"data/topik_level{lvl}.json"
    exists = os.path.exists(path)
    check(f"Level {lvl} data file exists", exists, f"Missing: {path}")
    if exists:
        with open(path, encoding="utf-8") as f:
            d = json.load(f)
        check(f"Level {lvl} has words array", "words" in d)
        check(f"Level {lvl} has ≥25 words", len(d.get("words", [])) >= 25,
              f"Only {len(d.get('words',[]))} words")
        for w in d.get("words", []):
            for field in ["id","term","meaning","pronunciation","example"]:
                if field not in w:
                    check(f"Level {lvl} word has '{field}'", False, f"Missing field in {w.get('id','?')}")
                    break
            else:
                continue
            break
        else:
            check(f"Level {lvl} all words have required fields", True)

# ── 2. CONFIG FILES ──────────────────────────────────────────
print("\n[2] App Config Files")
for lvl in range(1, 7):
    path = f"configs/topik_level{lvl}.json"
    exists = os.path.exists(path)
    check(f"Level {lvl} config file exists", exists)
    if exists:
        with open(path, encoding="utf-8") as f:
            c = json.load(f)
        required_sections = ["app_info","ui_theme","modules","monetization","store_metadata","content_data"]
        all_sections = all(s in c for s in required_sections)
        check(f"Level {lvl} config has all required sections", all_sections,
              f"Missing: {[s for s in required_sections if s not in c]}")
        check(f"Level {lvl} monetization configured", 
              "admob_banner_id" in c.get("monetization",{}))
        check(f"Level {lvl} content_data populated",
              len(c.get("content_data",[])) >= 25)

# ── 3. BUILD OUTPUTS ─────────────────────────────────────────
print("\n[3] Build Output Files")
for lvl in range(1, 7):
    dirs = [d for d in os.listdir("build_output") if f"topik_korean_l{lvl}" in d.lower()]
    check(f"Level {lvl} build directory exists", len(dirs) > 0,
          f"No dir matching topik_korean_l{lvl}")
    if dirs:
        build_dir = os.path.join("build_output", dirs[0])
        files = os.listdir(build_dir)
        check(f"Level {lvl} has AAB bundle", any(".aab" in f for f in files))
        check(f"Level {lvl} has JKS signing key", any(".jks" in f for f in files))
        check(f"Level {lvl} has release ZIP", any("_complete_release.zip" in f for f in files))
        check(f"Level {lvl} has store metadata", any("store_listing" in f for f in files))

# ── 4. WEB SIMULATOR ─────────────────────────────────────────
print("\n[4] Web Simulator (HTML) Validation")
with open("web_simulator.html", encoding="utf-8") as f:
    html = f.read()

check("Onboarding step 1 exists", "ob-step-1" in html)
check("Onboarding step 2 (name) exists", "ob-step-2" in html)
check("Onboarding step 3 (level) exists", "ob-step-3" in html)
check("Onboarding step 4 (goal) exists", "ob-step-4" in html)
check("All 6 TOPIK level slots in onboarding", "ob-lv6" in html)
check("Flashcard view present", "view-flashcard" in html)
check("Quiz view present", "view-quiz" in html)
check("Vocab list view present", "view-vocab" in html)
check("Progress/stats view present", "view-progress" in html)
check("Bottom navigation bar present", "bottom-nav" in html)
check("AdMob banner present", "admob-banner" in html or "admob" in html.lower())
check("Interstitial ad overlay present", "interstitial-ad" in html)
check("Rewarded ad function present", "showRewardedAd" in html)
check("Ad cooldown timer present", "adCooldown" in html)
check("TOPIK level 1 vocabulary embedded", "가족" in html)
check("TOPIK level 6 vocabulary embedded", "본질" in html)
check("Web Speech TTS function present", "speakKorean" in html)
check("localStorage persistence present", "localStorage" in html)
check("Streak tracking present", "streak" in html)
check("Achievement system present", "achievements" in html.lower())
check("Level progress bars present", "levelProgress" in html)
check("Daily goal tracking present", "dailyGoal" in html)
check("Quiz score tracking present", "quizScore" in html)
check("Flashcard flip animation present", "flipFlashcard" in html)
check("Word of the Day feature present", "wotd" in html)

# ── 5. MONETIZATION SCORE ────────────────────────────────────
print("\n[5] Monetization Completeness Score")
mon_features = {
    "Banner Ad (always visible)": "admob-banner" in html,
    "Interstitial Ad (with countdown)": "interstitial-ad" in html and "countdown" in html.lower(),
    "Rewarded Ad (hint system)": "showRewardedAd" in html,
    "Ad Cooldown Enforcement": "adCooldown" in html,
    "Ad triggered on quiz complete": "finishQuiz" in html and "tryShowAd" in html,
    "Ad triggered on card flip": "nextCard" in html and "tryShowAd" in html,
    "Test mode ID present": "ca-app-pub-3940256099942544" in html,
}
for feat, present in mon_features.items():
    check(feat, present)

# ── FINAL REPORT ─────────────────────────────────────────────
print("\n" + "="*60)
pct = round((score / total) * 100) if total > 0 else 0
status = "✅ PASS" if pct >= 85 else "⚠️ NEEDS FIXES" if pct >= 70 else "❌ FAIL"
print(f"  FINAL SCORE: {score}/{total} ({pct}%) -- {status}")
fails = [r for r in results if r[0] == "FAIL"]
if fails:
    print(f"\n  Failed checks ({len(fails)}):")
    for r in fails:
        print(f"    ✗ {r[1]}")
print("="*60 + "\n")

sys.exit(0 if pct >= 85 else 1)
