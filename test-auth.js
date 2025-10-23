// Simple test script for authentication using fetch
import fetch from 'node-fetch';

const testLogin = async () => {
  try {
    console.log('Testing login API...');

    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'testuser',
        password: 'testpass'
      })
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);

    if (data.success) {
      console.log('✅ Login successful!');
      console.log('Token:', data.token ? 'Present' : 'Missing');
      console.log('Refresh Token:', data.refreshToken ? 'Present' : 'Missing');
    } else {
      console.log('❌ Login failed:', data.error);
    }

  } catch (error) {
    console.error('❌ Connection error:', error.message);
  }
};

testLogin();