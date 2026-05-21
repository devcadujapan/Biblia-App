# Script Bíblia ACF - Abre apenas uma página

# Esconder a janela do PowerShell
Add-Type -Name Window -Namespace Console -MemberDefinition '
[DllImport("user32.dll")]
public static extern bool ShowWindow(int hWnd, int nCmdShow);
'
[Console.Window]::ShowWindow((Get-Process -Id $pid).MainWindowHandle, 0)

# Entrar na pasta do projeto
Set-Location F:\WEB\Biblia-App

# Verificar se o servidor já está rodando
$servidorRodando = Get-Process -Name node -ErrorAction SilentlyContinue

if (-not $servidorRodando) {
    # Iniciar servidor oculto
    Start-Process cmd -ArgumentList "/c npm run web" -WindowStyle Hidden
    Start-Sleep -Seconds 8
}

# Abrir navegador APENAS UMA VEZ
Start-Process "http://localhost:8081"

# Manter script rodando até o navegador fechar
Write-Host "📖 Bíblia ACF - Servidor rodando" -ForegroundColor Green
Write-Host "Feche o navegador e pressione ENTER para encerrar" -ForegroundColor Yellow

# Aguardar usuário pressionar ENTER
$null = Read-Host

# Encerrar servidor
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Name expo -ErrorAction SilentlyContinue | Stop-Process -Force

exit