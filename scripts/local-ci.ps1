# JamLink Local CI Pipeline for Windows PowerShell
# This script runs the same checks as GitHub Actions locally

param(
    [switch]$SkipTests,
    [switch]$SkipBuild,
    [switch]$Verbose
)

# Colors for console output
$Colors = @{
    Reset = "`e[0m"
    Bright = "`e[1m"
    Red = "`e[31m"
    Green = "`e[32m"
    Yellow = "`e[33m"
    Blue = "`e[34m"
    Magenta = "`e[35m"
    Cyan = "`e[36m"
}

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "Reset"
    )
    Write-Host "$($Colors[$Color])$Message$($Colors.Reset)"
}

function Invoke-Command {
    param(
        [string]$Command,
        [string]$WorkingDirectory = $PWD,
        [string]$Description = ""
    )
    
    try {
        if ($Description) {
            Write-ColorOutput "`n🔄 $Description" "Cyan"
        } else {
            Write-ColorOutput "`n🔄 $Command" "Cyan"
        }
        
        $result = Invoke-Expression $Command 2>&1
        $success = $LASTEXITCODE -eq 0
        
        if ($success) {
            Write-ColorOutput "✅ Success" "Green"
            if ($Verbose -and $result) {
                Write-Host $result
            }
        } else {
            Write-ColorOutput "❌ Failed" "Red"
            Write-ColorOutput "Error: $result" "Red"
        }
        
        return @{
            Success = $success
            Output = $result
        }
    }
    catch {
        Write-ColorOutput "❌ Failed" "Red"
        Write-ColorOutput "Error: $($_.Exception.Message)" "Red"
        return @{
            Success = $false
            Error = $_.Exception.Message
        }
    }
}

function Test-FileExists {
    param([string]$FilePath)
    return Test-Path $FilePath
}

# Main execution
function Start-CIPipeline {
    Write-ColorOutput "`n$($Colors.Bright)$($Colors.Magenta)🚀 JamLink Local CI Pipeline$($Colors.Reset)"
    Write-ColorOutput "$($Colors.Blue)================================$($Colors.Reset)"
    
    $startTime = Get-Date
    $allPassed = $true
    $results = @{
        Dependencies = $false
        Linting = $false
        TypeCheck = $false
        Tests = $false
        Build = $false
    }
    
    # Check if we're in the right directory
    if (-not (Test-FileExists "package.json")) {
        Write-ColorOutput "❌ Error: package.json not found. Please run this script from the project root." "Red"
        exit 1
    }
    
    # 1. Install dependencies
    Write-ColorOutput "`n$($Colors.Bright)$($Colors.Yellow)📦 Installing Dependencies$($Colors.Reset)"
    
    $rootDeps = Invoke-Command "npm ci" "." "Installing root dependencies"
    $results.Dependencies = $rootDeps.Success
    if (-not $rootDeps.Success) { $allPassed = $false }
    
    $serverDeps = Invoke-Command "npm ci" "./server" "Installing server dependencies"
    if (-not $serverDeps.Success) { $allPassed = $false }
    
    $clientDeps = Invoke-Command "npm ci" "./client" "Installing client dependencies"
    if (-not $clientDeps.Success) { $allPassed = $false }
    
    # 2. Linting
    Write-ColorOutput "`n$($Colors.Bright)$($Colors.Yellow)🔍 Running Linting$($Colors.Reset)"
    
    $serverLint = Invoke-Command "npm run lint" "./server" "Server linting"
    $results.Linting = $serverLint.Success
    if (-not $serverLint.Success) { $allPassed = $false }
    
    $clientLint = Invoke-Command "npm run lint" "./client" "Client linting"
    if (-not $clientLint.Success) { $allPassed = $false }
    
    # 3. TypeScript type checking
    Write-ColorOutput "`n$($Colors.Bright)$($Colors.Yellow)🔧 TypeScript Type Checking$($Colors.Reset)"
    
    $serverTypeCheck = Invoke-Command "npx tsc --noEmit" "./server" "Server type checking"
    $results.TypeCheck = $serverTypeCheck.Success
    if (-not $serverTypeCheck.Success) { $allPassed = $false }
    
    $clientTypeCheck = Invoke-Command "npx tsc --noEmit" "./client" "Client type checking"
    if (-not $clientTypeCheck.Success) { $allPassed = $false }
    
    # 4. Tests (if not skipped)
    if (-not $SkipTests) {
        Write-ColorOutput "`n$($Colors.Bright)$($Colors.Yellow)🧪 Running Tests$($Colors.Reset)"
        
        $serverTests = Invoke-Command "npm test" "./server" "Server tests"
        $results.Tests = $serverTests.Success
        if (-not $serverTests.Success) { $allPassed = $false }
        
        $clientTests = Invoke-Command "npm test" "./client" "Client tests"
        if (-not $clientTests.Success) { $allPassed = $false }
    } else {
        Write-ColorOutput "`n$($Colors.Yellow)⏭️ Skipping tests (--SkipTests flag)$($Colors.Reset)"
        $results.Tests = $true
    }
    
    # 5. Build (if not skipped)
    if (-not $SkipBuild) {
        Write-ColorOutput "`n$($Colors.Bright)$($Colors.Yellow)🏗️ Building Project$($Colors.Reset)"
        
        $serverBuild = Invoke-Command "npm run build" "./server" "Server build"
        $results.Build = $serverBuild.Success
        if (-not $serverBuild.Success) { $allPassed = $false }
        
        $clientBuild = Invoke-Command "npm run build" "./client" "Client build"
        if (-not $clientBuild.Success) { $allPassed = $false }
    } else {
        Write-ColorOutput "`n$($Colors.Yellow)⏭️ Skipping build (--SkipBuild flag)$($Colors.Reset)"
        $results.Build = $true
    }
    
    # Summary
    $endTime = Get-Date
    $duration = [math]::Round(($endTime - $startTime).TotalSeconds, 2)
    
    Write-ColorOutput "`n$($Colors.Bright)$($Colors.Blue)📊 CI Pipeline Summary$($Colors.Reset)"
    Write-ColorOutput "$($Colors.Blue)================================$($Colors.Reset)"
    
    Write-ColorOutput "📦 Dependencies: $(if ($results.Dependencies) { '✅ Passed' } else { '❌ Failed' })" $(if ($results.Dependencies) { 'Green' } else { 'Red' })
    Write-ColorOutput "🔍 Linting: $(if ($results.Linting) { '✅ Passed' } else { '❌ Failed' })" $(if ($results.Linting) { 'Green' } else { 'Red' })
    Write-ColorOutput "🔧 Type Check: $(if ($results.TypeCheck) { '✅ Passed' } else { '❌ Failed' })" $(if ($results.TypeCheck) { 'Green' } else { 'Red' })
    Write-ColorOutput "🧪 Tests: $(if ($results.Tests) { '✅ Passed' } else { '❌ Failed' })" $(if ($results.Tests) { 'Green' } else { 'Red' })
    Write-ColorOutput "🏗️ Build: $(if ($results.Build) { '✅ Passed' } else { '❌ Failed' })" $(if ($results.Build) { 'Green' } else { 'Red' })
    
    Write-ColorOutput "`n⏱️ Duration: ${duration}s"
    
    if ($allPassed) {
        Write-ColorOutput "`n$($Colors.Bright)$($Colors.Green)🎉 All checks passed! Your code is ready for deployment.$($Colors.Reset)"
        exit 0
    } else {
        Write-ColorOutput "`n$($Colors.Bright)$($Colors.Red)💥 Some checks failed. Please fix the issues above.$($Colors.Reset)"
        exit 1
    }
}

# Handle Ctrl+C gracefully
$null = Register-EngineEvent PowerShell.Exiting -Action {
    Write-ColorOutput "`n$($Colors.Yellow)⚠️ CI pipeline interrupted by user$($Colors.Reset)"
}

# Run the CI pipeline
Start-CIPipeline
