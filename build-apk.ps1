# Build Android APK for Palm Link
# Run from project root: .\build-apk.ps1

$ErrorActionPreference = "Stop"

Write-Host "Building Palm Link APK..." -ForegroundColor Cyan

# Ensure local.properties exists with Android SDK path
$localProps = "android\local.properties"
$sdkPath = "$env:LOCALAPPDATA\Android\Sdk"
if (-not (Test-Path $sdkPath)) {
    $sdkPath = "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk"
}
if (-not (Test-Path $sdkPath)) {
    Write-Host "ERROR: Android SDK not found. Install Android Studio or set ANDROID_HOME." -ForegroundColor Red
    exit 1
}

$sdkDir = $sdkPath -replace '\\', '/'
if (-not (Test-Path $localProps)) {
    Set-Content -Path $localProps -Value "sdk.dir=$sdkDir"
    Write-Host "Created local.properties with SDK path" -ForegroundColor Green
}

# Build (skip lint to avoid file lock issues)
Push-Location android
try {
    .\gradlew assembleRelease -x lintVitalAnalyzeRelease --no-daemon
    if ($LASTEXITCODE -eq 0) {
        $apkPath = "app\build\outputs\apk\release\app-release.apk"
        if (Test-Path $apkPath) {
            $fullPath = (Resolve-Path $apkPath).Path
            Write-Host ""
            Write-Host "BUILD SUCCESSFUL!" -ForegroundColor Green
            Write-Host "APK location: $fullPath" -ForegroundColor Green
            Write-Host ""
            # Copy to project root for easy access
            Copy-Item $apkPath -Destination "..\linkpalm-release.apk" -Force
            Write-Host "Also copied to: $(Get-Location)\..\linkpalm-release.apk" -ForegroundColor Green
        }
    } else {
        exit $LASTEXITCODE
    }
} finally {
    Pop-Location
}
