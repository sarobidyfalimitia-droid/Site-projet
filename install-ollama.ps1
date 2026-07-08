# Script d'installation d'Ollama et DeepSeek-Coder pour Windows
# Exécuter ce script en PowerShell en tant qu'administrateur

Write-Host "=== Installation d'Ollama et DeepSeek-Coder ===" -ForegroundColor Green

# Vérifier si winget est disponible
if (Get-Command winget -ErrorAction SilentlyContinue) {
    Write-Host "Installation d'Ollama via winget..." -ForegroundColor Yellow
    winget install -e --id Ollama.Ollama
} else {
    Write-Host "winget non disponible. Veuillez installer Ollama manuellement depuis https://ollama.com/download" -ForegroundColor Red
    Write-Host "Après installation, relancez ce script." -ForegroundColor Yellow
    exit 1
}

# Attendre l'installation
Start-Sleep -Seconds 5

# Vérifier l'installation
if (Get-Command ollama -ErrorAction SilentlyContinue) {
    Write-Host "Ollama installé avec succès!" -ForegroundColor Green
    
    # Télécharger le modèle DeepSeek-Coder
    Write-Host "Téléchargement du modèle DeepSeek-Coder (cela peut prendre plusieurs minutes)..." -ForegroundColor Yellow
    ollama pull deepseek-coder
    
    Write-Host "DeepSeek-Coder téléchargé avec succès!" -ForegroundColor Green
    Write-Host "Vous pouvez maintenant démarrer le serveur avec: ollama serve" -ForegroundColor Cyan
} else {
    Write-Host "Erreur: Ollama n'a pas pu être installé." -ForegroundColor Red
}