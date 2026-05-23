require("dotenv").config();

const requiredEnvVars = ["MONGO_URI", "JWT_SECRET", "PORT"]

for (const varName of requiredEnvVars) {
  if (!process.env[varName]) {
    console.error(`Error: Missing required environment variable ${varName}`);
    process.exit(1);
  }
}

console.log("All required environment variables are set.");