@echo off
title OmniScribe AI Audio Transcription Studio
cd /d "%~dp0"

echo =======================================================
echo     OmniScribe AI - Audio Transcription Studio
echo =======================================================
echo.
echo Initializing server on http://127.0.0.1:8000...
echo.

start "" "http://127.0.0.1:8000"
py server.py
pause
