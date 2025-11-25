@echo off
REM Docker build and run script for Sprint Analytics Dashboard (Windows)

echo ==========================================
echo   Sprint Analytics Dashboard - Docker
echo ==========================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not installed.
    echo Please install Docker Desktop from: https://docs.docker.com/desktop/windows/
    pause
    exit /b 1
)

echo [OK] Docker found

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not running.
    echo Please start Docker Desktop first.
    pause
    exit /b 1
)

echo [OK] Docker is running
echo.

REM Build the Docker image
echo [INFO] Building Docker image...
docker build -t sprint-analytics-dashboard .

if errorlevel 1 (
    echo.
    echo [ERROR] Docker build failed!
    pause
    exit /b 1
)

echo.
echo [SUCCESS] Docker image built successfully!
echo.
echo [INFO] Starting container...
echo.

REM Stop existing container if running
docker stop sprint-analytics-dashboard >nul 2>&1
docker rm sprint-analytics-dashboard >nul 2>&1

REM Run the container
docker run -d ^
    --name sprint-analytics-dashboard ^
    -p 8000:8000 ^
    --restart unless-stopped ^
    sprint-analytics-dashboard

echo ==========================================
echo   Dashboard is now running!
echo ==========================================
echo.
echo Access the dashboard at: http://localhost:8000
echo.
echo Container commands:
echo   Stop:    docker stop sprint-analytics-dashboard
echo   Start:   docker start sprint-analytics-dashboard
echo   Logs:    docker logs sprint-analytics-dashboard
echo   Remove:  docker rm -f sprint-analytics-dashboard
echo.
echo Container status:
docker ps --filter name=sprint-analytics-dashboard
echo.
pause

@REM Made with Bob
