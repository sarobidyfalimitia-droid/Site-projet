# Configuration de l'extension Continue

## Problème résolu
La clé API Anthropic a été retirée du fichier `frontend/.env.local` car elle n'avait rien à faire là.
Le fichier `.gitignore` a été mis à jour pour protéger les fichiers d'environnement sensibles.

## Configuration requise pour Continue

Pour que l'extension Continue fonctionne avec les modèles Claude, vous devez définir la variable d'environnement `ANTHROPIC_API_KEY`.

### Sur Windows (PowerShell)

1. **Définir la variable d'environnement de manière permanente:**
   ```powershell
   # Ouvrir PowerShell en tant qu'administrateur
   [System.Environment]::SetEnvironmentVariable("ANTHROPIC_API_KEY", "votre-clé-api-anthropic", "User")
   ```

2. **Ou définir la variable temporairement (pour la session actuelle):**
   ```powershell
   $env:ANTHROPIC_API_KEY="votre-clé-api-anthropic"
   ```

3. **Vérifier que la variable est bien définie:**
   ```powershell
   echo $env:ANTHROPIC_API_KEY
   ```

### Sur Windows (CMD)

```cmd
setx ANTHROPIC_API_KEY "votre-clé-api-anthropic"
```

### Où obtenir la clé API Anthropic?

1. Rendez-vous sur https://console.anthropic.com/
2. Connectez-vous ou créez un compte
3. Allez dans la section "API Keys"
4. Créez une nouvelle clé API
5. Copieez la clé et définissez-la comme variable d'environnement

### Redémarrer VS Code

Après avoir défini la variable d'environnement, redémarrez VS Code pour que l'extension Continue puisse l'utiliser.

## Fichiers protégés par .gitignore

- `backend/.env` - Contient les secrets du backend (JWT, DB, SMTP)
- `frontend/.env.local` - Variables d'environnement du frontend

## Vérification

Pour vérifier que tout est correctement configuré:
1. Ouvrez les paramètres de VS Code (Ctrl+,)
2. Recherchez "Continue"
3. Vérifiez que le modèle Claude 3.5 Sonnet est disponible