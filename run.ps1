# PISTA PowerShell Launch Script
$ErrorActionPreference = "Stop"

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host " PISTA - Real-Time Transaction Fraud Intelligence Platform" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

$RootDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $RootDir

# 1. Verification
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Error "Python not found in PATH. Please install Python 3.10+."
    exit 1
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Error "Node.js / npm not found in PATH. Please install Node.js 18+."
    exit 1
}

# 2. Start Backend
Write-Host "[1/3] Starting FastAPI Backend on port 8000..." -ForegroundColor Yellow
$BackendJob = Start-Job -ScriptBlock {
    param($dir)
    Set-Location "$dir\backend"
    python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
} -ArgumentList $RootDir

# 3. Start Frontend
Write-Host "[2/3] Starting Next.js Frontend on port 3000..." -ForegroundColor Yellow
$FrontendJob = Start-Job -ScriptBlock {
    param($dir)
    Set-Location "$dir\frontend"
    npm run dev
} -ArgumentList $RootDir

# 4. Wait for services to respond
Write-Host "[3/3] Waiting for backend and frontend services..." -ForegroundColor Yellow

$backendReady = $false
for ($i = 0; $i -lt 30; $i++) {
    try {
        $res = Invoke-RestMethod -Uri "http://localhost:8000/health" -Method Get -TimeoutSec 1 -ErrorAction SilentlyContinue
        if ($res.status -eq "ok") {
            $backendReady = $true
            break
        }
    } catch {}
    Start-Sleep -Seconds 1
}

if ($backendReady) {
    Write-Host " Backend is ready at http://localhost:8000" -ForegroundColor Green
} else {
    Write-Host " Backend is initializing..." -ForegroundColor DarkYellow
}

Write-Host ""
Write-Host "================================================================" -ForegroundColor Green
Write-Host " PISTA Stack Active!" -ForegroundColor Green
Write-Host " - Frontend Dashboard : http://localhost:3000" -ForegroundColor White
Write-Host " - Backend API Docs   : http://localhost:8000/docs" -ForegroundColor White
Write-Host " - Backend Health     : http://localhost:8000/health" -ForegroundColor White
Write-Host "================================================================" -ForegroundColor Green
Write-Host ""

# Open browser
Start-Process "http://localhost:3000"

Write-Host "Press Ctrl+C to stop all services..." -ForegroundColor Cyan

try {
    while ($true) {
        # Stream job output if any
        Receive-Job -Job $BackendJob | ForEach-Object { Write-Host "[Backend] $_" -ForegroundColor DarkGray }
        Receive-Job -Job $FrontendJob | ForEach-Object { Write-Host "[Frontend] $_" -ForegroundColor DarkCyan }
        Start-Sleep -Seconds 2
    }
} finally {
    Write-Host "`nStopping background services..." -ForegroundColor Yellow
    Stop-Job -Job $BackendJob, $FrontendJob -ErrorAction SilentlyContinue
    Remove-Job -Job $BackendJob, $FrontendJob -Force -ErrorAction SilentlyContinue
    Write-Host "All PISTA services stopped cleanly." -ForegroundColor Green
}
