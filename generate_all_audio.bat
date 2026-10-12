@echo off
chcp 65001 > nul
echo ========================================================
echo   한국산업인력공단(HRD-Korea) EPS-TOPIK 공식 MP3 무인 생성기
echo ========================================================
echo.

if exist ".venv\Scripts\python.exe" (
    ".venv\Scripts\python.exe" scratch\generate_cbt_official_audio.py %*
) else (
    python scratch\generate_cbt_official_audio.py %*
)

echo.
pause
