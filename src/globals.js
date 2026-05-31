// Mainly for testing local data, since env vars can't be used in the frontend
import { PORT } from './port';
const API_URL = process.env.API_URI || `http://localhost:${PORT}`;

export { API_URL };