@echo off
cd /d "%~dp0"
echo Open http://127.0.0.1:5192/ after the server starts.
py -3.11 desktop.py run
if errorlevel 1 echo Start failed. Run Setup-RAG.cmd first and check for occupied ports.
pause
