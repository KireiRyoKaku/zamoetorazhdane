// test-key.js - Run this to debug your key
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const testKey = () => {
  const base64Key = process.env.PRIVATE_KEY_BASE64;

  if (!base64Key) {
    console.error("❌ PRIVATE_KEY_BASE64 not found in .env");
    return;
  }

  try {
    // Decode base64
    const privateKey = Buffer.from(base64Key, "base64").toString("utf-8");

    console.log("🔍 Key Analysis:");
    console.log("Length:", privateKey.length);
    console.log("First 50 chars:", privateKey.substring(0, 50));
    console.log("Last 50 chars:", privateKey.substring(privateKey.length - 50));
    console.log(
      "Contains BEGIN:",
      privateKey.includes("-----BEGIN PRIVATE KEY-----"),
    );
    console.log(
      "Contains END:",
      privateKey.includes("-----END PRIVATE KEY-----"),
    );

    // Test with crypto
    const keyObject = crypto.createPrivateKey(privateKey);
    console.log("✅ Key is valid!");
    console.log("Type:", keyObject.asymmetricKeyType);
    console.log("Size:", keyObject.asymmetricKeySize);
  } catch (error) {
    console.error("❌ Key test failed:", error.message);

    // Try different formats
    console.log("\n🔧 Trying different key formats...");

    try {
      const privateKey = Buffer.from(base64Key, "base64").toString("utf-8");

      // Try PKCS#8 format
      const keyObject = crypto.createPrivateKey({
        key: privateKey,
        format: "pem",
        type: "pkcs8",
      });
      console.log("✅ Works with PKCS#8 format");
    } catch (pkcs8Error) {
      console.log("❌ PKCS#8 failed:", pkcs8Error.message);

      try {
        // Try PKCS#1 format
        const keyObject = crypto.createPrivateKey({
          key: privateKey,
          format: "pem",
          type: "pkcs1",
        });
        console.log("✅ Works with PKCS#1 format");
      } catch (pkcs1Error) {
        console.log("❌ PKCS#1 failed:", pkcs1Error.message);
      }
    }
  }
};

testKey();
