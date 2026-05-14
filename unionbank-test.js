const axios = require("axios");

const CLIENT_ID = "PASTE_CLIENT_ID_HERE";
const CLIENT_SECRET = "PASTE_CLIENT_SECRET_HERE";

async function testUnionBank() {
  try {
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");

    const basic = Buffer.from(`${CLIENT_ID.trim()}:${CLIENT_SECRET.trim()}`).toString("base64");

    const response = await axios.post(
      "https://api-uat.unionbankph.com/partners/sb/partners/v1/oauth2/token",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${basic}`,
        },
      }
    );

    console.log("CONNECTED TO UNIONBANK");
    console.log(response.data);
  } catch (error) {
    console.log("ERROR");
    console.log(error.response?.data || error.message);
  }
}

testUnionBank();