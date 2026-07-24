# Script pour corriger les types TypeScript dans tous les fichiers routes

$routes = @(
    "src/routes/contract.routes.ts",
    "src/routes/dashboard.routes.ts",
    "src/routes/invoice.routes.ts",
    "src/routes/message.routes.ts",
    "src/routes/project.routes.ts",
    "src/routes/quote.routes.ts",
    "src/routes/team.routes.ts",
    "src/routes/testimonial.routes.ts",
    "src/routes/upload.routes.ts"
)

foreach ($route in $routes) {
    $filePath = Join-Path $PWD $route
    
    if (Test-Path $filePath) {
        Write-Host "Fixing $route..."
        
        # Lire le contenu
        $content = Get-Content $filePath -Raw
        
        # Ajouter l'import de Request et Response si pas présent
        if ($content -notmatch "import.*Request.*Response.*from 'express'") {
            $content = $content -replace "import \{ Router \} from 'express'", "import { Router, Request, Response } from 'express'"
            Write-Host "  - Added Request, Response import"
        }
        
        # Remplacer les paramètres (req, res) non typés par (req: Request, res: Response)
        # Mais seulement dans les callbacks de routes, pas dans les middlewares
        $content = $content -replace '\(_req,\s*_file,\s*cb\)', '(_req: any, _file: any, cb: any)'
        $content = $content -replace '\(_req,\s*file,\s*cb\)', '(_req: any, file: any, cb: any)'
        $content = $content -replace '\(req,\s*res\)', '(req: Request, res: Response)'
        
        # Écrire le contenu
        Set-Content $filePath $content -NoNewline
        
        Write-Host "  - Fixed parameter types"
    }
}

Write-Host "`nDone! All routes fixed."