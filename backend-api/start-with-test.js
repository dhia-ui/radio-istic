#!/usr/bin/env node

const { spawn } = require('child_process');
const axios = require('axios');
const path = require('path');

let backendProcess = null;

function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m',    // Cyan
    success: '\x1b[32m', // Green
    error: '\x1b[31m',   // Red
    warning: '\x1b[33m', // Yellow
    reset: '\x1b[0m'
  };
  
  const symbols = {
    info: 'ℹ',
    success: '✓',
    error: '✗',
    warning: '⚠'
  };

  console.log(`${colors[type]}${symbols[type]} ${message}${colors.reset}`);
}

function startBackend() {
  return new Promise((resolve, reject) => {
    log('Starting backend server...', 'info');
    
    const serverPath = path.join(__dirname, 'server.js');
    backendProcess = spawn('node', [serverPath], {
      cwd: __dirname,
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'development' }
    });

    backendProcess.on('error', (error) => {
      log(`Failed to start backend: ${error.message}`, 'error');
      reject(error);
    });

    // Wait for server to be ready
    setTimeout(() => resolve(), 3000);
  });
}

async function waitForBackend(maxAttempts = 10) {
  log('Waiting for backend to be ready...', 'info');
  
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await axios.get('http://localhost:5000/api/health', { timeout: 1000 });
      if (response.data.status === 'OK') {
        log('Backend is ready!', 'success');
        return true;
      }
    } catch (error) {
      if (i < maxAttempts - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
  
  throw new Error('Backend failed to start');
}

async function testAuthentication() {
  log('\n=== Testing Authentication System ===\n', 'info');
  
  const API_URL = 'http://localhost:5000/api';
  const testEmail = `test_${Date.now()}@radioistic.com`;
  const testPassword = 'test123456';
  
  try {
    // Test 1: Registration
    log('Test 1: User Registration', 'info');
    const registerData = {
      firstName: 'Test',
      lastName: 'User',
      email: testEmail,
      password: testPassword,
      field: 'GLSI',
      year: 3,
      phone: '12345678'
    };
    
    const registerResponse = await axios.post(`${API_URL}/auth/register`, registerData);
    
    if (registerResponse.data.success && registerResponse.data.token) {
      log(`Registration successful! Token: ${registerResponse.data.token.substring(0, 30)}...`, 'success');
      
      const token = registerResponse.data.token;
      
      // Test 2: Token Validation
      log('Test 2: Token Validation', 'info');
      const meResponse = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (meResponse.data.success) {
        log(`Token valid! User: ${meResponse.data.user.firstName} ${meResponse.data.user.lastName}`, 'success');
        
        // Test 3: Login
        log('Test 3: User Login', 'info');
        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
          email: testEmail,
          password: testPassword
        });
        
        if (loginResponse.data.success && loginResponse.data.token) {
          log(`Login successful! New token generated.`, 'success');
          
          log('\n✓ ALL AUTHENTICATION TESTS PASSED! ✓', 'success');
          log('\nYour auth system is working correctly! 🎉', 'success');
          log('\nYou can now:', 'info');
          log('  1. Open http://localhost:3000/signup', 'info');
          log('  2. Register with your real information', 'info');
          log('  3. Your data will be saved automatically', 'info');
          log('  4. Refresh the page - you stay logged in!', 'info');
          
          return true;
        }
      }
    }
  } catch (error) {
    log(`Authentication test failed!`, 'error');
    if (error.response) {
      log(`Error: ${error.response.data.message || error.message}`, 'error');
      log(`Details: ${JSON.stringify(error.response.data, null, 2)}`, 'error');
    } else {
      log(`Error: ${error.message}`, 'error');
    }
    return false;
  }
}

async function main() {
  console.log('\n╔═══════════════════════════════════════════╗');
  console.log('║  Radio ISTIC - Auth System Startup       ║');
  console.log('╚═══════════════════════════════════════════╝\n');
  
  try {
    // Start backend
    await startBackend();
    
    // Wait for backend to be ready
    await waitForBackend();
    
    // Test authentication
    const authWorks = await testAuthentication();
    
    if (authWorks) {
      log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'success');
      log('Backend is running and authentication works!', 'success');
      log('Press Ctrl+C to stop the server', 'info');
      log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'success');
      
      // Keep process alive
      process.on('SIGINT', () => {
        log('\nShutting down backend...', 'warning');
        if (backendProcess) {
          backendProcess.kill();
        }
        process.exit(0);
      });
    } else {
      log('\nAuthentication tests failed. Check the errors above.', 'error');
      if (backendProcess) {
        backendProcess.kill();
      }
      process.exit(1);
    }
    
  } catch (error) {
    log(`Failed to start: ${error.message}`, 'error');
    if (backendProcess) {
      backendProcess.kill();
    }
    process.exit(1);
  }
}

main();
