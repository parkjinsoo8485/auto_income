@echo off
chcp 65001 >nul
echo ----------------------------------------------------
echo [안전 복구] 듀오링고 체크포인트 시점으로 원상복구 중...
echo ----------------------------------------------------
cd /d "%~dp0"
git reset --hard CHECKPOINT_BASELINE
git clean -fd
echo.
echo [성공] 기준 체크포인트(7673ca7) 상태로 완벽히 복원되었습니다!
pause
