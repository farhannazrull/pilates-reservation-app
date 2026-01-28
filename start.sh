#!/bin/bash

# Function to kill processes on exit
cleanup() {
  echo "Stopping servers..."
  kill $BACKEND_PID
  kill $FRONTEND_PID
  exit
}

trap cleanup SIGINT

# Start Backend
echo "Starting Backend on port 8080..."
cd backend
go run main.go &
BACKEND_PID=$!
cd ..

# Start Frontend
echo "Starting Frontend on port 3000..."
cd frontend
npm run dev -- -H 0.0.0.0 &
FRONTEND_PID=$!
cd ..

wait
