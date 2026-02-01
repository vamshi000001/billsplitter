# check_project.ps1

$problemFile = "$PSScriptRoot\problems.txt"
$frontendDir = "$PSScriptRoot\frontend"
$backendDir = "$PSScriptRoot\backend"

# --- Reset Problem File ---
"Project Health Check Report - $(Get-Date)" | Out-File -FilePath $problemFile -Encoding utf8
"==========================================" | Out-File -FilePath $problemFile -Append

function Log-Message {
    param (
        [string]$Message
    )
    Write-Host $Message
    $Message | Out-File -FilePath $problemFile -Append
}

function Log-Section {
    param (
        [string]$Title
    )
    "" | Out-File -FilePath $problemFile -Append
    "------------------------------------------" | Out-File -FilePath $problemFile -Append
    "Checking: $Title" | Out-File -FilePath $problemFile -Append
    "------------------------------------------" | Out-File -FilePath $problemFile -Append
    Write-Host "`nChecking: $Title..." -ForegroundColor Cyan
}

# --- Frontend Checks ---
Log-Section "Frontend (Lint & Build)"
if (Test-Path $frontendDir) {
    Push-Location $frontendDir
    try {
        # Lint
        Log-Message "Running: npm run lint"
        $lintOutput = npm run lint 2>&1
        if ($LASTEXITCODE -eq 0) {
            Log-Message "✅ Frontend Lint: PASSED"
        } else {
            Log-Message "❌ Frontend Lint: FAILED"
            $lintOutput | Out-File -FilePath $problemFile -Append
        }

        # Build
        Log-Message "Running: npm run build"
        $buildOutput = npm run build 2>&1
        if ($LASTEXITCODE -eq 0) {
            Log-Message "✅ Frontend Build: PASSED"
        } else {
            Log-Message "❌ Frontend Build: FAILED"
            $buildOutput | Out-File -FilePath $problemFile -Append
        }
    } catch {
        Log-Message "❌ An error occurred during frontend checks: $_"
    } finally {
        Pop-Location
    }
} else {
    Log-Message "❌ Frontend directory not found!"
}

# --- Backend Checks ---
Log-Section "Backend (Syntax Check)"
if (Test-Path $backendDir) {
    Push-Location $backendDir
    try {
        # Check src directory for syntax errors
        $jsFiles = Get-ChildItem -Path "src" -Recurse -Filter "*.js"
        $backendErrors = 0

        foreach ($file in $jsFiles) {
            $relPath = $file.FullName.Replace($backendDir, "")
            $checkOutput = node --check $file.FullName 2>&1
            if ($LASTEXITCODE -ne 0) {
                Log-Message "❌ Syntax Error in $relPath"
                $checkOutput | Out-File -FilePath $problemFile -Append
                $backendErrors++
            }
        }

        if ($backendErrors -eq 0) {
            Log-Message "✅ Backend Syntax: PASSED ($($jsFiles.Count) files checked)"
        } else {
            Log-Message "❌ Backend Syntax: FAILED ($backendErrors errors found)"
        }

    } catch {
        Log-Message "❌ An error occurred during backend checks: $_"
    } finally {
        Pop-Location
    }
} else {
    Log-Message "❌ Backend directory not found!"
}

Log-Message "`n------------------------------------------"
Log-Message "Check Completed. See $problemFile for details."
