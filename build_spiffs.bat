@echo off
python "%~dp0build_resources.py"
if errorlevel 1 echo No se pudieron preparar los recursos. Comprueba que Python 3 este instalado.
pause
