@echo off
cd /d "%~dp0"
py -3.11 desktop.py setup
if errorlevel 1 echo Setup failed. Read the message above and DESKTOP.md.
pause
