$ErrorActionPreference = "Stop"

$nodeDir = Join-Path $PSScriptRoot ".node"
# Prepend local Node.js path to the environment PATH so post-install scripts (e.g. esbuild) can run node
$env:PATH = "$nodeDir;" + $env:PATH

$npmPath = Join-Path $nodeDir "npm.cmd"
$cacheRoot = "C:\portfolio_cache"
$cacheBackend = Join-Path $cacheRoot "backend"
$cacheFrontend = Join-Path $cacheRoot "frontend"

Write-Host "Creating cache installation folders..."
if (-not (Test-Path $cacheBackend)) { New-Item -ItemType Directory -Path $cacheBackend | Out-Null }
if (-not (Test-Path $cacheFrontend)) { New-Item -ItemType Directory -Path $cacheFrontend | Out-Null }

Write-Host "Copying package files..."
Copy-Item -Path (Join-Path $PSScriptRoot "backend\package.json") -Destination (Join-Path $cacheBackend "package.json") -Force
Copy-Item -Path (Join-Path $PSScriptRoot "frontend\package.json") -Destination (Join-Path $cacheFrontend "package.json") -Force

Write-Host "Installing backend packages in cache..."
Set-Location $cacheBackend
& $npmPath install

Write-Host "Installing frontend packages in cache..."
Set-Location $cacheFrontend
& $npmPath install

Write-Host "Restoring directory junctions..."
Set-Location $PSScriptRoot

# Backend node_modules junction
$junctionBackend = Join-Path $PSScriptRoot "backend\node_modules"
if (Test-Path $junctionBackend) {
    Remove-Item -Path $junctionBackend -Recurse -Force
}
New-Item -ItemType Junction -Path $junctionBackend -Value (Join-Path $cacheBackend "node_modules") | Out-Null
Write-Host "Backend junction restored."

# Frontend node_modules junction
$junctionFrontend = Join-Path $PSScriptRoot "frontend\node_modules"
if (Test-Path $junctionFrontend) {
    Remove-Item -Path $junctionFrontend -Recurse -Force
}
New-Item -ItemType Junction -Path $junctionFrontend -Value (Join-Path $cacheFrontend "node_modules") | Out-Null
Write-Host "Frontend junction restored."

Write-Host "All installations completed successfully!"

