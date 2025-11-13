const axios = require('axios');

async function testAuth() {
  console.log('\n========================================');
  console.log('   RADIO ISTIC - AUTH TEST');
  console.log('========================================\n');

  const API_URL = 'http://localhost:5000/api';

  // Test 1: Check if backend is running
  console.log('1️⃣  Testing backend connection...');
  try {
    const healthCheck = await axios.get(`${API_URL}/health`, { timeout: 2000 }).catch(() => null);
    if (healthCheck) {
      console.log('   ✅ Backend is running on port 5000\n');
    } else {
      throw new Error('Backend not responding');
    }
  } catch (error) {
    console.log('   ❌ Backend is NOT running!');
    console.log('   ⚠️  Please start backend: cd backend-api && node server.js\n');
    process.exit(1);
  }

  // Test 2: Register a test user
  console.log('2️⃣  Testing registration...');
  const testUser = {
    firstName: 'Test',
    lastName: 'User',
    email: `test${Date.now()}@test.com`,
    password: 'test123',
    field: 'GLSI',
    year: 3,
    phone: '12345678'
  };

  try {
    const registerResponse = await axios.post(`${API_URL}/auth/register`, testUser);
    
    if (registerResponse.data.success && registerResponse.data.token) {
      console.log('   ✅ Registration successful!');
      console.log(`   📧 Email: ${testUser.email}`);
      console.log(`   🔑 Token: ${registerResponse.data.token.substring(0, 20)}...`);
      console.log(`   👤 User ID: ${registerResponse.data.user._id}\n`);

      const token = registerResponse.data.token;

      // Test 3: Verify token with /me endpoint
      console.log('3️⃣  Testing token validation...');
      const meResponse = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (meResponse.data.success && meResponse.data.user) {
        console.log('   ✅ Token validation successful!');
        console.log(`   👤 User: ${meResponse.data.user.firstName} ${meResponse.data.user.lastName}`);
        console.log(`   📧 Email: ${meResponse.data.user.email}\n`);
      }

      // Test 4: Test login with same credentials
      console.log('4️⃣  Testing login...');
      const loginResponse = await axios.post(`${API_URL}/auth/login`, {
        email: testUser.email,
        password: testUser.password
      });

      if (loginResponse.data.success && loginResponse.data.token) {
        console.log('   ✅ Login successful!');
        console.log(`   🔑 New Token: ${loginResponse.data.token.substring(0, 20)}...\n`);
      }

      console.log('========================================');
      console.log('   ✅ ALL TESTS PASSED! AUTH WORKS!');
      console.log('========================================\n');
      console.log('Your authentication system is working correctly! 🎉\n');

    } else {
      throw new Error('Registration failed');
    }
  } catch (error) {
    console.log('   ❌ Test failed!');
    console.log(`   Error: ${error.response?.data?.message || error.message}\n`);
    
    if (error.response) {
      console.log('   Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

// Run tests
testAuth();
