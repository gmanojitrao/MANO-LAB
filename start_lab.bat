@echo off
title MANO-LAB — Digital Laboratory
cd /d "%~dp0"

echo =======================================================
echo          MANO-LAB: Small ideas. Real experiments.
echo =======================================================
echo.
echo Launching MANO-LAB Server on http://127.0.0.1:8000...
echo.

start "" "http://127.0.0.1:8000"
py server.py
pause
