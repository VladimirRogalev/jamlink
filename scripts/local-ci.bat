@echo off
REM JamLink Local CI Pipeline for Windows Command Prompt
REM This script runs the same checks as GitHub Actions locally

echo.
echo 🚀 JamLink Local CI Pipeline
echo ================================
echo.

setlocal enabledelayedexpansion
set "allPassed=true"
set "startTime=%time%"

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from the project root.
    exit /b 1
)

REM 1. Install dependencies
echo.
echo 📦 Installing Dependencies
echo ---------------------------

echo 🔄 Installing root dependencies...
call npm ci
if errorlevel 1 (
    echo ❌ Failed to install root dependencies
    set "allPassed=false"
) else (
    echo ✅ Root dependencies installed
)

echo 🔄 Installing server dependencies...
cd server
call npm ci
if errorlevel 1 (
    echo ❌ Failed to install server dependencies
    set "allPassed=false"
) else (
    echo ✅ Server dependencies installed
)
cd ..

echo 🔄 Installing client dependencies...
cd client
call npm ci
if errorlevel 1 (
    echo ❌ Failed to install client dependencies
    set "allPassed=false"
) else (
    echo ✅ Client dependencies installed
)
cd ..

REM 2. Linting
echo.
echo 🔍 Running Linting
echo ------------------

echo 🔄 Server linting...
cd server
call npm run lint
if errorlevel 1 (
    echo ❌ Server linting failed
    set "allPassed=false"
) else (
    echo ✅ Server linting passed
)
cd ..

echo 🔄 Client linting...
cd client
call npm run lint
if errorlevel 1 (
    echo ❌ Client linting failed
    set "allPassed=false"
) else (
    echo ✅ Client linting passed
)
cd ..

REM 3. TypeScript type checking
echo.
echo 🔧 TypeScript Type Checking
echo ---------------------------

echo 🔄 Server type checking...
cd server
call npx tsc --noEmit
if errorlevel 1 (
    echo ❌ Server type checking failed
    set "allPassed=false"
) else (
    echo ✅ Server type checking passed
)
cd ..

echo 🔄 Client type checking...
cd client
call npx tsc --noEmit
if errorlevel 1 (
    echo ❌ Client type checking failed
    set "allPassed=false"
) else (
    echo ✅ Client type checking passed
)
cd ..

REM 4. Tests
echo.
echo 🧪 Running Tests
echo -----------------

echo 🔄 Server tests...
cd server
call npm test
if errorlevel 1 (
    echo ❌ Server tests failed
    set "allPassed=false"
) else (
    echo ✅ Server tests passed
)
cd ..

echo 🔄 Client tests...
cd client
call npm test
if errorlevel 1 (
    echo ❌ Client tests failed
    set "allPassed=false"
) else (
    echo ✅ Client tests passed
)
cd ..

REM 5. Build
echo.
echo 🏗️ Building Project
echo -------------------

echo 🔄 Server build...
cd server
call npm run build
if errorlevel 1 (
    echo ❌ Server build failed
    set "allPassed=false"
) else (
    echo ✅ Server build passed
)
cd ..

echo 🔄 Client build...
cd client
call npm run build
if errorlevel 1 (
    echo ❌ Client build failed
    set "allPassed=false"
) else (
    echo ✅ Client build passed
)
cd ..

REM Summary
echo.
echo 📊 CI Pipeline Summary
echo ================================

if "%allPassed%"=="true" (
    echo 🎉 All checks passed! Your code is ready for deployment.
    exit /b 0
) else (
    echo 💥 Some checks failed. Please fix the issues above.
    exit /b 1
)
