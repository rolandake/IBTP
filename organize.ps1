# Script d'organisation pour le backend btp-ia-backend

$rootPath = "C:\Users\HP\Desktop\btp-ia-backend"

$folders = @("routes", "middlewares")
foreach ($folder in $folders) {
    $path = Join-Path $rootPath $folder
    if (-Not (Test-Path $path)) {
        Write-Host "Création du dossier $folder"
        New-Item -ItemType Directory -Path $path
    } else {
        Write-Host "Le dossier $folder existe déjà"
    }
}

$filesToMove = @{
    "chat.js" = "routes"
    "auth.js" = "middlewares"
}

foreach ($file in $filesToMove.Keys) {
    $source = Join-Path $rootPath $file
    $destination = Join-Path $rootPath $filesToMove[$file] $file

    if (Test-Path $source) {
        if (-Not (Test-Path $destination)) {
            Write-Host "Déplacement de $file vers $($filesToMove[$file])"
            Move-Item -Path $source -Destination $destination
        } else {
            Write-Host "Le fichier $file est déjà dans $($filesToMove[$file])"
        }
    } else {
        Write-Host "Le fichier $file n'existe pas dans $rootPath"
    }
}

Write-Host "Organisation terminée."
