@echo off
title STAR Tours - Full Stack Launcher
cd /d "%~dp0"

echo ==========================================
echo   STAR Tours and Travels - Launcher
echo ==========================================
echo.

rem ---------- 1. Start MongoDB (if not running) ----------
tasklist /FI "IMAGENAME eq mongod.exe" 2>nul | find /I "mongod.exe" >nul
if %errorlevel%==0 (
  echo [MongoDB]  Already running on port 27017
) else (
  echo [MongoDB]  Starting...
  start "MongoDB Server" "%~dp0mongo70\mongodb-win32-x86_64-windows-7.0.14\bin\mongod.exe" --dbpath "%~dp0mongodb-data" --port 27017 --bind_ip 127.0.0.1
)

rem ---------- 2. Start Flask API (if not running) ----------
netstat -ano | findstr ":5000" | findstr "LISTENING" >nul
if %errorlevel%==0 (
  echo [Flask API] Already running on port 5000
) else (
  echo [Flask API] Starting...
  start "Flask API" cmd /k "cd /d %~dp0server_python && python app.py"
)

rem ---------- 3. Wait for API ----------
echo.
echo [Waiting for API to come up...]
timeout /t 4 /nobreak >nul

rem ---------- 4. Open homepage ----------
start "" "%~dp0index.html"

echo.
echo All services started. Keep the Flask API window open.
echo Close this window anytime.
timeout /t 4 /nobreak >nul
