@echo off
setlocal enabledelayedexpansion
title PISTA - Transaction Intelligence Launcher

echo ================================================================
echo  PISTA - Real-Time Transaction Fraud Intelligence Platform
echo ================================================================
echo.

cd /d "%~dp0"

:: 1. Check Python
where python >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Python not found in PATH. Please install Python 3.10+ and add it to PATH.
    pause
    exit /b 1
)

:: 2. Check Node
where npm >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js / npm not found in PATH. Please install Node.js 18+ and add it to PATH.
    pause
    exit /b 1
)

:: 3. Launch Backend (FastAPI on Port 8000)
echo [1/3] Starting PISTA Backend Engine (FastAPI + LightGBM)...
start "PISTA Backend (Port 8000)" cmd /k "cd /d %~dp0backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000"

:: 4. Launch Frontend (Next.js on Port 3000)
echo [2/3] Starting PISTA Spatial UI (Next.js 16)...
start "PISTA Frontend (Port 3000)" cmd /k "cd /d %~dp0frontend && npm run dev"

:: 5. Wait for services to initialize
echo [3/3] Waiting for services to initialize...
timeout /t 5 /nobreak >nul

echo.
echo ================================================================
echo  PISTA Services are Running!
echo ================================================================
echo  - Frontend Dashboard : http://localhost:3000
echo  - Backend API Docs   : http://localhost:8000/docs
echo  - Backend Health     : http://localhost:8000/health
echo ================================================================
echo.
echo Opening dashboard in default browser...
start http://localhost:3000

echo.
echo (The backend and frontend terminal windows will keep running in their respective windows).
pause
