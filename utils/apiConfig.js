// client/utils/apiConfig.js
const getApiUrl = () => {
  // In production, use your deployed server URL
  if (import.meta.env.PROD) {
    return "https://zamoetorazhdane-server.onrender.com"; // Replace with your actual Render URL
  }

  // In development, try to detect current network
  const hostname = window.location.hostname;

  // If accessing via IP address, use the same IP for API
  if (hostname !== "localhost" && hostname !== "127.0.0.1") {
    return `http://${hostname}:5174`;
  }

  // Fallback to localhost for development
  return "http://localhost:5174";
};

export const API_URL = getApiUrl();

// For debugging (only in development)
if (import.meta.env.DEV) {
  console.log("🌐 Using API URL:", API_URL);
}
