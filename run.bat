@echo off
REM Quick run script for Sprint Dashboard (Windows)

echo ==========================================
echo   Sprint Dashboard Server
echo ==========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH.
    echo Please install Python 3 from https://www.python.org/downloads/
    echo.
    pause
    exit /b 1
)

echo [INFO] Starting Sprint Dashboard...
echo [INFO] Dashboard will open in your browser at http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo.
echo ==========================================
echo.

REM Run the server
python server.py

pause
