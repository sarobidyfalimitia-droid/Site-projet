# Configuration DeepSeek-Coder pour Continue

## Installation de l'extension Continue

1. Installez l'extension **Continue** dans VS Code
2. Redémarrez VS Code après l'installation

## Configuration de DeepSeek-Coder

### Option 1: API officielle DeepSeek (Recommandé)

1. **Obtenir une clé API DeepSeek:**
   - Rendez-vous sur https://platform.deepseek.com/
   - Connectez-vous ou créez un compte
   - Allez dans la section "API Keys"
   - Créez une nouvelle clé API
   - Copiez la clé

2. **Configurer la variable d'environnement:**
   ```powershell
   # PowerShell (admin)
   [System.Environment]::SetEnvironmentVariable("DEEPSEEK_API_KEY", "votre-clé-api-deepseek", "User")
   ```
   
   ```cmd
   # CMD
   setx DEEPSEEK_API_KEY "votre-clé-api-deepseek"
   ```

3. **Créer le fichier de configuration:**
   - Copiez `.continue/config.json.example` vers `.continue/config.json`
   - Le fichier est déjà configuré pour utiliser DeepSeek

4. **Redémarrez VS Code** pour que la variable d'environnement soit prise en compte

### Option 2: DeepSeek avec Ollama (Gratuit, local)

1. **Installer Ollama:**
   - Téléchargez depuis https://ollama.com/download
   - Installez et lancez Ollama

2. **Télécharger le modèle DeepSeek-Coder:**
   ```bash
   ollama pull deepseek-coder
   ```

3. **Démarrer le serveur Ollama:**
   ```bash
   ollama serve
   ```

4. **Utiliser le modèle:**
   - Continue détectérá automatiquement le modèle Ollama
   - Sélectionnez "DeepSeek-Coder (Ollama Local)" dans les modèles Continue

## Vérification

1. Ouvrez les paramètres VS Code (Ctrl+,)
2. Recherchez "Continue"
3. Vous devriez voir les modèles DeepSeek disponibles:
   - DeepSeek-Coder (Official API)
   - DeepSeek-Coder-V2 (Official API)
   - DeepSeek-Chat (Official API)
   - DeepSeek-Coder (Ollama Local)

## Utilisation

- **Chat:** Utilisez Ctrl+I pour ouvrir le chat Continue
- **Autocomplete:** Continue suggérera automatiquement du code
- **Commandes personnalisées:**
  - `/test` - Génère des tests pour le code sélectionné
  - `/doc` - Génère de la documentation

## Modèles disponibles

| Modèle | Description | Contexte |
|--------|-------------|----------|
| deepseek-coder | Spécialisé dans la génération de code | 128K tokens |
| deepseek-coder-v2 | Version améliorée pour le code | 128K tokens |
| deepseek-chat | Modèle conversationnel général | 32K tokens |

## Support

Pour plus d'informations:
- Documentation Continue: https://docs.continue.dev
- Documentation DeepSeek: https://api-docs.deepseek.com