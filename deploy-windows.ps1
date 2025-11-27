# deploy-windows.ps1
# Script to deploy KSEF API on Windows Server
# Usage: powershell -ExecutionPolicy Bypass -File deploy-windows.ps1
# Must run as Administrator

param(
  [string]$AppName = "ksef-api",
  [string]$RepoPath = "D:\repo\ksef-pdf-generator_new",
  [string]$NodePath = "C:\Program Files\nodejs\node.exe",
  [string]$NssmPath = "C:\tools\nssm\nssm.exe",
  [int]$Port = 3001,
  [switch]$SkipNpmInstall = $false,
  [switch]$SkipBuild = $false,
  [switch]$OnlyInstallService = $false
)

# Verify administrator
$isAdmin = ([Security.Principal.WindowsIdentity]::GetCurrent().Groups -match "S-1-5-32-544") -ne $null
if (-not $isAdmin) {
  Write-Error "This script must be run as Administrator!"
  exit 1
}

Write-Host "========================================" -ForegroundColor Green
Write-Host "KSEF API Windows Server Deploy Script" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Configuration:" -ForegroundColor Yellow
Write-Host "  App Name: $AppName"
Write-Host "  Repo Path: $RepoPath"
Write-Host "  Node.exe: $NodePath"
Write-Host "  NSSM.exe: $NssmPath"
Write-Host "  Port: $Port"
Write-Host ""

# Step 1: Verify prerequisites
Write-Host "Step 1: Verifying prerequisites..." -ForegroundColor Cyan
if (-not (Test-Path $NodePath)) {
  Write-Error "Node.js not found at $NodePath. Please install Node.js LTS 18+"
  exit 1
}

if (-not (Test-Path $NssmPath)) {
  Write-Host "NSSM not found at $NssmPath" -ForegroundColor Yellow
  Write-Host "Downloading NSSM..." -ForegroundColor Cyan
  $nssm_dir = Split-Path $NssmPath
  New-Item -ItemType Directory -Force -Path $nssm_dir | Out-Null
  
  # Download NSSM (adjust version if needed)
  $nssm_url = "https://nssm.cc/download/nssm-2.24-104-g0c4b92f.zip"
  $zip_path = "$env:TEMP\nssm.zip"
  Write-Host "Downloading from $nssm_url..." -ForegroundColor Gray
  Invoke-WebRequest -Uri $nssm_url -OutFile $zip_path -ErrorAction Stop
  Expand-Archive -Path $zip_path -DestinationPath $nssm_dir -Force
  Remove-Item $zip_path
  
  # Find nssm.exe in extracted folder
  $nssm_exe = Get-ChildItem -Path $nssm_dir -Recurse -Name "nssm.exe" -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($nssm_exe) {
    Copy-Item (Join-Path $nssm_dir $nssm_exe) $NssmPath
    Write-Host "NSSM installed successfully" -ForegroundColor Green
  } else {
    Write-Error "Failed to extract NSSM"
    exit 1
  }
}

# Step 2: Navigate to repo
Write-Host "Step 2: Navigating to repository..." -ForegroundColor Cyan
if (-not (Test-Path $RepoPath)) {
  Write-Error "Repository not found at $RepoPath"
  exit 1
}
Set-Location $RepoPath
Write-Host "Repository path: $(Get-Location)" -ForegroundColor Green

# Step 3: npm install (if not skipped)
if (-not $SkipNpmInstall) {
  Write-Host "Step 3: Installing npm dependencies..." -ForegroundColor Cyan
  & npm install
  if ($LASTEXITCODE -ne 0) {
    Write-Error "npm install failed"
    exit 1
  }
  Write-Host "npm install completed" -ForegroundColor Green
} else {
  Write-Host "Step 3: Skipping npm install" -ForegroundColor Yellow
}

# Step 4: Build (if not skipped)
if (-not $SkipBuild) {
  Write-Host "Step 4: Building project (vite + esbuild)..." -ForegroundColor Cyan
  & npm run build
  if ($LASTEXITCODE -ne 0) {
    Write-Error "npm run build failed"
    exit 1
  }
  Write-Host "Build completed" -ForegroundColor Green
} else {
  Write-Host "Step 4: Skipping build" -ForegroundColor Yellow
}

# Step 5: Check/remove existing service
Write-Host "Step 5: Checking existing service..." -ForegroundColor Cyan
$service = Get-Service -Name $AppName -ErrorAction SilentlyContinue
if ($service) {
  Write-Host "Service '$AppName' already exists. Stopping..." -ForegroundColor Yellow
  Stop-Service -Name $AppName -Force -ErrorAction SilentlyContinue
  Start-Sleep -Seconds 2
  Write-Host "Removing existing service..." -ForegroundColor Yellow
  & $NssmPath remove $AppName confirm
  Start-Sleep -Seconds 2
}

if ($OnlyInstallService) {
  Write-Host "Step 6: Installing service only..." -ForegroundColor Cyan
} else {
  Write-Host "Step 6: Installing service '$AppName'..." -ForegroundColor Cyan
}

# Step 6: Install service with NSSM
$serverCjs = Join-Path $RepoPath "dist\api\server.cjs"
if (-not (Test-Path $serverCjs)) {
  Write-Error "Server bundle not found at $serverCjs. Please run npm run build first."
  exit 1
}

Write-Host "Server bundle: $serverCjs" -ForegroundColor Gray

& $NssmPath install $AppName $NodePath $serverCjs
if ($LASTEXITCODE -ne 0) {
  Write-Error "NSSM install failed"
  exit 1
}

# Configure service
Write-Host "Configuring service..." -ForegroundColor Cyan
& $NssmPath set $AppName AppDirectory $RepoPath
& $NssmPath set $AppName AppEnvironmentExtra "NODE_ENV=production;PORT=$Port"
& $NssmPath set $AppName AppStdout (Join-Path $RepoPath "logs\stdout.log")
& $NssmPath set $AppName AppStderr (Join-Path $RepoPath "logs\stderr.log")
& $NssmPath set $AppName AppRotateFiles 1
& $NssmPath set $AppName AppRotateSeconds 86400

# Create logs directory
$logsDir = Join-Path $RepoPath "logs"
New-Item -ItemType Directory -Force -Path $logsDir | Out-Null

Write-Host "Service configured" -ForegroundColor Green

# Step 7: Start service
Write-Host "Step 7: Starting service..." -ForegroundColor Cyan
& $NssmPath start $AppName
Start-Sleep -Seconds 3

$service = Get-Service -Name $AppName -ErrorAction SilentlyContinue
if ($service -and $service.Status -eq "Running") {
  Write-Host "Service started successfully!" -ForegroundColor Green
  Write-Host "Service status: $($service.Status)" -ForegroundColor Green
} else {
  Write-Host "Warning: Service may not have started. Checking logs..." -ForegroundColor Yellow
  $stderr = Join-Path $RepoPath "logs\stderr.log"
  if (Test-Path $stderr) {
    Write-Host "Error log content:" -ForegroundColor Yellow
    Get-Content $stderr -Tail 20
  }
}

# Step 8: Firewall rule
Write-Host "Step 8: Adding firewall rule..." -ForegroundColor Cyan
$rule = Get-NetFirewallRule -DisplayName "KSEF API" -ErrorAction SilentlyContinue
if (-not $rule) {
  New-NetFirewallRule -DisplayName "KSEF API" -Direction Inbound -LocalPort $Port -Protocol TCP -Action Allow | Out-Null
  Write-Host "Firewall rule added for port $Port" -ForegroundColor Green
} else {
  Write-Host "Firewall rule already exists" -ForegroundColor Green
}

# Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Service Name: $AppName" -ForegroundColor Yellow
Write-Host "Port: $Port" -ForegroundColor Yellow
Write-Host "Logs: $(Join-Path $RepoPath 'logs')" -ForegroundColor Yellow
Write-Host ""
Write-Host "Useful commands:" -ForegroundColor Cyan
Write-Host "  Check status: Get-Service $AppName"
Write-Host "  Stop service: & '$NssmPath' stop $AppName"
Write-Host "  Start service: & '$NssmPath' start $AppName"
Write-Host "  View logs: Get-Content $(Join-Path $RepoPath 'logs\stderr.log') -Tail 50"
Write-Host "  Test endpoint: curl.exe -X POST http://localhost:$Port/generate-invoice -F `"file=@assets\invoice.xml`" -F `"additionalData={\`"nrKSeF\`":\`"TEST123\`"}`" -o out.pdf"
Write-Host ""
