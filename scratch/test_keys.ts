import "dotenv/config";

async function main() {
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  const nvidiaKey = process.env.NVIDIA_NIM_API_KEY;
  const linkedinToken = process.env.LINKEDIN_ACCESS_TOKEN;
  const devtoKey = process.env.DEVTO_API_KEY;

  console.log("Starting Key Validations...");
  console.log("OpenRouter Key Exists:", !!openrouterKey);
  console.log("NVIDIA NIM Key Exists:", !!nvidiaKey);
  console.log("LinkedIn Access Token Exists:", !!linkedinToken);
  console.log("Dev.to Key Exists:", !!devtoKey);

  if (openrouterKey) {
    try {
      const or = await fetch("https://openrouter.ai/api/v1/models", {
        headers: { Authorization: `Bearer ${openrouterKey}` }
      });
      console.log("OpenRouter API Status:", or.status);
    } catch (e: any) {
      console.log("OpenRouter Fetch Error:", e.message);
    }
  }

  if (nvidiaKey) {
    try {
      const nv = await fetch("https://integrate.api.nvidia.com/v1/models", {
        headers: { Authorization: `Bearer ${nvidiaKey}` }
      });
      console.log("NVIDIA NIM API Status:", nv.status);
    } catch (e: any) {
      console.log("NVIDIA NIM Fetch Error:", e.message);
    }
  }

  if (linkedinToken) {
    try {
      const liUi = await fetch("https://api.linkedin.com/userinfo", {
        headers: { Authorization: `Bearer ${linkedinToken}` }
      });
      console.log("LinkedIn UserInfo Status:", liUi.status, await liUi.text());
    } catch (e: any) {
      console.log("LinkedIn UserInfo Error:", e.message);
    }

    try {
      const liMe = await fetch("https://api.linkedin.com/v2/me", {
        headers: { Authorization: `Bearer ${linkedinToken}` }
      });
      console.log("LinkedIn v2/me Status:", liMe.status, await liMe.text());
    } catch (e: any) {
      console.log("LinkedIn v2/me Error:", e.message);
    }
  }

  if (devtoKey) {
    try {
      const dev = await fetch("https://dev.to/api/articles/me", {
        headers: { "api-key": devtoKey }
      });
      const text = await dev.text();
      console.log("Dev.to Status:", dev.status, text.startsWith("[") ? "OK" : "FAIL: " + text.substring(0, 100));
    } catch (e: any) {
      console.log("Dev.to Fetch Error:", e.message);
    }
  }
}

main().catch(console.error);
