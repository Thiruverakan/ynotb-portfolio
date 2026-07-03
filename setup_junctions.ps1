$ErrorActionPreference = "Stop"

$cacheRoot = "C:\portfolio_cache"
$cacheNode = Join-Path $cacheRoot ".node"
$cacheBackendModules = Join-Path $cacheRoot "backend_node_modules"
$cacheFrontendModules = Join-Path $cacheRoot "frontend_node_modules"

# Create cache directories if they don't exist
Write-Host "Creating cache directories on C drive..."
if (-not (Test-Path $cacheRoot)) { New-Item -ItemType Directory -Path $cacheRoot | Out-Null }
if (-not (Test-Path $cacheNode)) { New-Item -ItemType Directory -Path $cacheNode | Out-Null }
if (-not (Test-Path $cacheBackendModules)) { New-Item -ItemType Directory -Path $cacheBackendModules | Out-Null }
if (-not (Test-Path $cacheFrontendModules)) { New-Item -ItemType Directory -Path $cacheFrontendModules | Out-Null }

# Ensure backend and frontend directories exist
$backendDir = Join-Path $PSScriptRoot "backend"
$frontendDir = Join-Path $PSScriptRoot "frontend"
if (-not (Test-Path $backendDir)) { New-Item -ItemType Directory -Path $backendDir | Out-Null }
if (-not (Test-Path $frontendDir)) { New-Item -ItemType Directory -Path $frontendDir | Out-Null }

# Create junctions
Write-Host "Creating directory junctions..."

$junctionNode = Join-Path $PSScriptRoot ".node"
if (Test-Path $junctionNode) { Remove-Item -Path $junctionNode -Recurse -Force }
New-Item -ItemType Junction -Path $junctionNode -Value $cacheNode | Out-Null
Write-Host "Junction created: $junctionNode -> $cacheNode"

$junctionBackendModules = Join-Path $backendDir "node_modules"
if (Test-Path $junctionBackendModules) { Remove-Item -Path $junctionBackendModules -Recurse -Force }
New-Item -ItemType Junction -Path $junctionBackendModules -Value $cacheBackendModules | Out-Null
Write-Host "Junction created: $junctionBackendModules -> $cacheBackendModules"

$junctionFrontendModules = Join-Path $frontendDir "node_modules"
if (Test-Path $junctionFrontendModules) { Remove-Item -Path $junctionFrontendModules -Recurse -Force }
New-Item -ItemType Junction -Path $junctionFrontendModules -Value $cacheFrontendModules | Out-Null
Write-Host "Junction created: $junctionFrontendModules -> $cacheFrontendModules"

Write-Host "Junction setup completed successfully!"
