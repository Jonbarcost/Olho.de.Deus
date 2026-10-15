@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
 echo Instale o Node.js LTS e abra este arquivo novamente.
 pause
 exit /b 1
)
call npm ci
if errorlevel 1 goto falha
call npm run build
if errorlevel 1 goto falha
start "" http://localhost:3000
call npm start
pause
exit /b
:falha
echo Nao foi possivel preparar o programa. Copie a mensagem acima.
pause
exit /b 1
