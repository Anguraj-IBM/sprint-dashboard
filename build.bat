@echo off
REM Build script for Sprint Dashboard standalone executable (Windows)

echo ==========================================
echo   Sprint Dashboard - Build Script
echo ==========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH.
    echo Please install Python 3 from https://www.python.org/downloads/
    echo Make sure to check "Add Python to PATH" during installation.
    pause
    exit /b 1
)

echo [OK] Python found
echo.

REM Install PyInstaller
echo [INFO] Installing PyInstaller...
pip install pyinstaller
if errorlevel 1 (
    echo [ERROR] Failed to install PyInstaller
    pause
    exit /b 1
)

echo.
echo [INFO] Building executable...
echo.

REM Build the executable
pyinstaller --onefile ^
    --name "SprintDashboard" ^
    --add-data "index.html;." ^
    --add-data "dashboard.js;." ^
    --add-data "styles.css;." ^
    --add-data "data;data" ^
    --icon=NONE ^
    --clean ^
    server.py

if errorlevel 1 (
    echo.
    echo [ERROR] Build failed!
    pause
    exit /b 1
)

echo.
echo ==========================================
echo   Build Complete!
echo ==========================================
echo.
echo [SUCCESS] Executable location: dist\SprintDashboard.exe
echo.
echo To run:
echo   dist\SprintDashboard.exe
echo.
echo To distribute:
echo   Share the 'dist\SprintDashboard.exe' file
echo.
pause

@REM Made with Bob
