# Démarrage rapide - DeepSeek-Coder avec Continue

## ✅ Configuration terminée

La clé API DeepSeek a été configurée. Voici les étapes restantes:

## 1. Redémarrer VS Code

**Fermez complètement VS Code et relancez-le** pour que la variable d'environnement soit prise en compte.

## 2. Vérifier l'extension Continue

- Ouvrez VS Code
- Allez dans les extensions (Ctrl+Shift+X)
- Vérifiez que "Continue" est installé
- Si non, installez-le depuis: https://marketplace.visualstudio.com/items?itemName=Continue.continue

## 3. Utiliser DeepSeek-Coder

Après le redémarrage de VS Code:

### Ouvrir le chat Continue:
- **Ctrl+I** (ou Cmd+I sur Mac)

### Sélectionner le modèle:
- Dans le chat Continue, cliquez sur le sélecteur de modèle
- Sélectionnez **"DeepSeek-V4-Flash (Official API)"** (recommandé)

### Commandes disponibles:
- `/test` - Génère des tests pour le code sélectionné
- `/doc` - Génère de la documentation

## 4. Alternative: Ollama (si vous voulez l'utiliser plus tard)

Après l'installation d'Ollama:
```powershell
# Démarrer le serveur Ollama
ollama serve

# Télécharger le modèle DeepSeek-Coder
ollama pull deepseek-coder
```

Puis sélectionnez **"DeepSeek-Coder (Ollama Local)"** dans Continue.

## 5. Vérification

Si tout est bien configuré, vous verrez les modèles disponibles dans Continue:
- DeepSeek-V4-Flash (Official API)
- DeepSeek-V4-Pro (Official API)
- DeepSeek-Coder (Ollama Local)

## Support

Consultez les fichiers:
- `DEEPSEEK_API_SETUP.md` - Guide complet pour l'API
- `DEEPSEEK_SETUP.md` - Guide complet pour les deux options