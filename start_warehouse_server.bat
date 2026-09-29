@echo off
chcp 65001 > nul
echo ========================================================
echo   한글 자소 웨어하우스 에디터 서버 실행기
echo ========================================================
echo.
cd /d "%~dp0"
python test/warehouse_server.py 8000
pause
