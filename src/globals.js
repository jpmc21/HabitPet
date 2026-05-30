// Mainly for testing local data, since env vars can't be used in the frontend
const API_URL = process.env.API_URI || "http://localhost:5001";

export { API_URL };