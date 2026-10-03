@echo off
title UrbanFlow AI V5 - SIH 2026
cd /d "%~dp0"
if not exist ".venv\Scripts\python.exe" (
  echo Creating Python environment...
  python -m venv .venv
)
call ".venv\Scripts\activate.bat"
echo Installing/checking dependencies...
python -m pip install -r backend\requirements.txt
echo.
echo Starting UrbanFlow AI...
echo Open http://127.0.0.1:8000 in Chrome.
echo Keep this window open while using the prototype.
python -m uvicorn backend.main:app --reload
pause
