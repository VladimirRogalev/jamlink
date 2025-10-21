#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, cwd = process.cwd(), description = '') {
  try {
    log(`\n${colors.cyan}🔄 ${description || command}${colors.reset}`);
    const result = execSync(command, { 
      cwd, 
      stdio: 'pipe',
      maxBuffer: 1024 * 1024 * 10,
      encoding: 'utf8'
    });
    log(`${colors.green}✅ Success${colors.reset}`);
    return { success: true, output: result };
  } catch (error) {
    log(`${colors.red}❌ Failed${colors.reset}`);
    log(`${colors.red}Error: ${error.message}${colors.reset}`);
    return { success: false, error: error.message, output: error.stdout || error.stderr };
  }
}

function checkFileExists(filePath) {
  return fs.existsSync(filePath);
}

function main() {
  log(`${colors.bright}${colors.magenta}🚀 JamLink Local CI Pipeline${colors.reset}`);
  log(`${colors.blue}================================${colors.reset}`);
  
  const startTime = Date.now();
  let allPassed = true;
  const results = {
    dependencies: false,
    linting: false,
    typeCheck: false,
    tests: false,
    build: false
  };

  // Check if we're in the right directory
  if (!checkFileExists('package.json')) {
    log(`${colors.red}❌ Error: package.json not found. Please run this script from the project root.${colors.reset}`);
    process.exit(1);
  }

  // 1. Install dependencies
  log(`\n${colors.bright}${colors.yellow}📦 Installing Dependencies${colors.reset}`);
  
  const rootDeps = runCommand('npm ci', '.', 'Installing root dependencies');
  results.dependencies = rootDeps.success;
  if (!rootDeps.success) allPassed = false;

  const serverDeps = runCommand('npm ci', './server', 'Installing server dependencies');
  if (!serverDeps.success) allPassed = false;

  const clientDeps = runCommand('npm ci', './client', 'Installing client dependencies');
  if (!clientDeps.success) allPassed = false;

  // 2. Linting
  log(`\n${colors.bright}${colors.yellow}🔍 Running Linting${colors.reset}`);
  
  const serverLint = runCommand('npm run lint', './server', 'Server linting');
  results.linting = serverLint.success;
  if (!serverLint.success) allPassed = false;

  const clientLint = runCommand('npm run lint', './client', 'Client linting');
  if (!clientLint.success) allPassed = false;

  // 3. TypeScript type checking
  log(`\n${colors.bright}${colors.yellow}🔧 TypeScript Type Checking${colors.reset}`);
  
  const serverTypeCheck = runCommand('npx tsc --noEmit', './server', 'Server type checking');
  results.typeCheck = serverTypeCheck.success;
  if (!serverTypeCheck.success) allPassed = false;

  const clientTypeCheck = runCommand('npx tsc --noEmit', './client', 'Client type checking');
  if (!clientTypeCheck.success) allPassed = false;

  // 4. Tests
  log(`\n${colors.bright}${colors.yellow}🧪 Running Tests${colors.reset}`);
  
  const serverTests = runCommand('npm test', './server', 'Server tests');
  results.tests = serverTests.success;
  if (!serverTests.success) allPassed = false;

  const clientTests = runCommand('npm test', './client', 'Client tests');
  if (!clientTests.success) allPassed = false;

  // 5. Build
  log(`\n${colors.bright}${colors.yellow}🏗️ Building Project${colors.reset}`);
  
  const serverBuild = runCommand('npm run build', './server', 'Server build');
  results.build = serverBuild.success;
  if (!serverBuild.success) allPassed = false;

  const clientBuild = runCommand('npm run build', './client', 'Client build');
  if (!clientBuild.success) allPassed = false;

  // Summary
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  log(`\n${colors.bright}${colors.blue}📊 CI Pipeline Summary${colors.reset}`);
  log(`${colors.blue}================================${colors.reset}`);
  
  log(`📦 Dependencies: ${results.dependencies ? colors.green + '✅ Passed' : colors.red + '❌ Failed'}${colors.reset}`);
  log(`🔍 Linting: ${results.linting ? colors.green + '✅ Passed' : colors.red + '❌ Failed'}${colors.reset}`);
  log(`🔧 Type Check: ${results.typeCheck ? colors.green + '✅ Passed' : colors.red + '❌ Failed'}${colors.reset}`);
  log(`🧪 Tests: ${results.tests ? colors.green + '✅ Passed' : colors.red + '❌ Failed'}${colors.reset}`);
  log(`🏗️ Build: ${results.build ? colors.green + '✅ Passed' : colors.red + '❌ Failed'}${colors.reset}`);
  
  log(`\n⏱️ Duration: ${duration}s`);
  
  if (allPassed) {
    log(`\n${colors.bright}${colors.green}🎉 All checks passed! Your code is ready for deployment.${colors.reset}`);
    process.exit(0);
  } else {
    log(`\n${colors.bright}${colors.red}💥 Some checks failed. Please fix the issues above.${colors.reset}`);
    process.exit(1);
  }
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  log(`\n${colors.yellow}⚠️ CI pipeline interrupted by user${colors.reset}`);
  process.exit(130);
});

// Run the CI pipeline
main();
