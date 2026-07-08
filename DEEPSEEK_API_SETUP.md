# Configuration DeepSeek API (Gratuite)

## Obtenir une clé API DeepSeek gratuite

1. **Rendez-vous sur le site DeepSeek:**
   - Ouvrez https://platform.deepseek.com/
   - Cliquez sur "Sign Up" pour créer un compte (ou "Sign In" si vous avez déjà un compte)

2. **Créer une clé API:**
   - Après connexion, allez dans la section "API Keys"
   - Cliquez sur "Create API Key"
   - Donnez un nom à votre clé (ex: "VSCode-Continue")
   - Copiez la clé générée (elle ne sera affichée qu'une seule fois)

3. **Configurer la variable d'environnement:**
   ```powershell
   # PowerShell (en tant qu'utilisateur)
   [System.Environment]::SetEnvironmentVariable("DEEPSEEK_API_KEY", "votre-clé-api-ici", "User")
   ```
   
   ```cmd
   # CMD
   setx DEEPSEEK_API_KEY "votre-clé-api-ici"
   ```

4. **Redémarrer VS Code** pour que la variable d'environnement soit prise en compte

## Configuration Continue

Le fichier `.continue/config.json` est déjà configuré pour utiliser DeepSeek avec la variable `DEEPSEEK_API_KEY`.

## Vérification

Après redémarrage de VS Code:
1. Ouvrez les paramètres (Ctrl+,)
2. Recherchez "Continue"
3. Vous devriez voir les modèles DeepSeek disponibles:
   - DeepSeek-Coder (Official API)
   - DeepSeek-Coder-V2 (Official API)
   - DeepSeek-Chat (Official API)

## Utilisation

- **Chat:** Ctrl+I pour ouvrir le chat Continue
- **Autocomplete:** L'extension suggérera automatiquement du code
- **Commandes:**
  - `/test` - Génère des tests
  - `/doc` - Génère de la documentation

## Tarifs DeepSeek

DeepSeek offre un crédit gratuit de **$10** pour les nouveaux utilisateurs, ce qui permet plusieurs milliers de requêtes.
- deepseek-coder: ~$0.002 par 1K tokens (très économique)
- deepseek-chat: ~$0.002 par 1K tokens

## Alternative: Arrêter l'installation Ollama

Si vous voulez arrêter l'installation d'Ollama en cours:
1. Ouvrez le Gestionnaire des tâches
2. Trouvez "OllamaSetup.exe" ou "winget"
3. Terminez le processus

Vous pouvez installer Ollama plus tard si vous le souhaitez.