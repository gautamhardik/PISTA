#!/usr/bin/env bash
set -e

# Change to repository root
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "================================================================"
echo " PISTA - Real-Time Transaction Fraud Intelligence Platform"
echo "================================================================"
echo ""

# 1. Verification
command -v python3 >/dev/null 2>&1 || command -v python >/dev/null 2>&1 || { echo >&2 "[ERROR] Python is not installed. Aborting."; exit 1; }
command -v npm >/dev/null 2>&1 || { echo >&2 "[ERROR] Node.js / npm is not installed. Aborting."; exit 1; }

PYTHON_CMD="python"
if command -v python3 >/dev/null 2>&1; then
    PYTHON_CMD="python3"
fi

# Function to clean up child processes on exit
cleanup() {
    echo ""
    echo "Shutting down PISTA services..."
    kill $(jobs -p) 2>/dev/null || true
    echo "All services stopped."
}
trap cleanup EXIT INT TERM

# 2. Start Backend
echo "[1/3] Starting FastAPI Backend on port 8000..."
(cd "$DIR/backend" && $PYTHON_CMD -m uvicorn app.main:app --host 0.0.0.0 --port 8000) &
BACKEND_PID=$!

# 3. Start Frontend
echo "[2/3] Starting Next.js Frontend on port 3000..."
(cd "$DIR/frontend" && npm run dev) &
FRONTEND_PID=$!

# 4. Wait for services
echo "[3/3] Waiting for backend service..."
for i in {1..30}; do
    if curl -s http://localhost:8000/health >/dev/null 2>&1; then
        echo " Backend is ready!"
        break
    fi
    sleep 1
done

echo ""
echo "================================================================"
echo " PISTA Stack Active!"
echo " - Frontend Dashboard : http://localhost:3000"
echo " - Backend API Docs   : http://localhost:8000/docs"
echo " - Backend Health     : http://localhost:8000/health"
echo "================================================================"
echo ""
echo "Press Ctrl+C to stop all services..."

# Open browser if possible
if command -v xdg-open >/dev/null 2>&1; then
    xdg-open http://localhost:3000
elif command -v open >/dev/null 2>&1; then
    open http://localhost:3000
fi

# Wait for background jobs
wait
