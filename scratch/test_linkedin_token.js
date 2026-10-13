const fs = require('fs');

const envContent = fs.readFileSync('.env', 'utf8');
const match = envContent.match(/LINKEDIN_ACCESS_TOKEN=["']?([^"'\r\n]+)["']?/);
const token = match ? match[1].trim() : null;

console.log('Testing LinkedIn token...');
console.log('Token exists:', !!token);
console.log('Token prefix:', token ? token.substring(0, 10) + '...' : 'none');

if (!token) {
  process.exit(1);
}

async function testToken() {
  try {
    console.log('Calling /v2/userinfo...');
    const userinfoRes = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('userinfo HTTP status:', userinfoRes.status);
    const userinfoBody = await userinfoRes.text();
    console.log('userinfo response:', userinfoBody);

    console.log('\nCalling /v2/me...');
    const meRes = await fetch('https://api.linkedin.com/v2/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('v2/me HTTP status:', meRes.status);
    const meBody = await meRes.text();
    console.log('v2/me response:', meBody);
  } catch (err) {
    console.error('Error testing LinkedIn token:', err);
  }
}

testToken();
