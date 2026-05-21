@echo off
title Fechar Servidor da Bíblia
echo ======================================
echo    FECHANDO SERVIDOR DA BÍBLIA ACF
echo ======================================
echo.

taskkill /f /im node.exe 2>nul
taskkill /f /im expo.exe 2>nul

echo.
echo ✅ Servidor encerrado com sucesso!
echo.
echo Pressione qualquer tecla para fechar...
pause > nul
exit