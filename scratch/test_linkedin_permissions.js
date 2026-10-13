const fs = require('fs');

const envContent = fs.readFileSync('.env', 'utf8');
const match = envContent.match(/LINKEDIN_ACCESS_TOKEN=["']?([^"'\r\n]+)["']?/);
const token = match ? match[1].trim() : null;
const author = 'urn:li:person:h0eJKlW82v';

async function testPermissions() {
  console.log('Testing LinkedIn asset registerUpload permission...');
  const res = await fetch("https://api.linkedin.com/v2/assets?action=registerUpload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      registerUploadRequest: {
        recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
        owner: author,
        serviceRelationships: [
          {
            relationshipType: "OWNER",
            identifier: "urn:li:userGeneratedContent",
          },
        ],
      },
    }),
  });

  console.log('registerUpload status:', res.status);
  const body = await res.text();
  console.log('registerUpload body:', body.substring(0, 500));
}

testPermissions();
