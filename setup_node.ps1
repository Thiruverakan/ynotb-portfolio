$ErrorActionPreference = "Stop"

$nodeDir = Join-Path $PSScriptRoot ".node"
if (Test-Path (Join-Path $nodeDir "node.exe")) {
    Write-Host "Node.js already installed in $nodeDir"
    exit 0
}

# Clean contents of junction, but do not delete the junction itself
Write-Host "Cleaning local Node junction directory..."
if (Test-Path $nodeDir) {
    Get-ChildItem -Path $nodeDir -Force | ForEach-Object {
        Remove-Item -Path $_.FullName -Recurse -Force
    }
}

$cacheRoot = "C:\portfolio_cache"
$tempExtractDir = Join-Path $cacheRoot ".node_temp"
if (Test-Path $tempExtractDir) {
    Remove-Item -Path $tempExtractDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempExtractDir | Out-Null

$zipUrl = "https://nodejs.org/dist/v20.15.0/node-v20.15.0-win-x64.zip"
$zipPath = Join-Path $cacheRoot "node.zip"

Write-Host "Downloading Node.js to C: drive cache..."
Invoke-WebRequest -Uri $zipUrl -OutFile $zipPath

Write-Host "Extracting Node.js using tar..."
& tar.exe -xf $zipPath -C $tempExtractDir

Write-Host "Moving files to target directory..."
$extractedFolder = Join-Path $tempExtractDir "node-v20.15.0-win-x64"
Get-ChildItem -Path $extractedFolder | ForEach-Object {
    Move-Item -Path $_.FullName -Destination $nodeDir -Force
}

Write-Host "Cleaning up temporary files..."
if (Test-Path $zipPath) {
    Remove-Item -Path $zipPath -Force
}
if (Test-Path $tempExtractDir) {
    Remove-Item -Path $tempExtractDir -Recurse -Force
}

Write-Host "Node.js setup completed successfully!"
Write-Host "Node path: $(Join-Path $nodeDir 'node.exe')"
Write-Host "Npm path: $(Join-Path $nodeDir 'npm.cmd')"
