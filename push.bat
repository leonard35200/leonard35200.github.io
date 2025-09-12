# Chemin vers Git portable
$gitPath = "D:\PortableApps\git\PortableGit\cmd\git.exe"

# Vérifie que git.exe existe
if (-Not (Test-Path $gitPath)) {
    Write-Host "Git n'a pas été trouvé à l'emplacement :" $gitPath
    exit
}

# Fonction pour exécuter Git avec le chemin complet
function Git {
    param([string[]]$args)
    & $gitPath @args
}

# Déplace-toi dans le dossier du dépôt (optionnel, adapte ce chemin)
Set-Location "D:\code"  

# Exécute les commandes Git
Git add .
Git commit -m "auto commit"
Git push
