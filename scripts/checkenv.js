require("dotenv").config();

const requiredEnvVars = ["MONGO_URI", "JWT_SECRET", "PORT"]

for (const varName of requiredEnvVars) {
  if (!process.env[varName]) {
    if (varName === "JWT_SECRET") {
      console.log('use the following to generate JWT_SECRET:\nnode -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"');
    }
    console.error(`Error: Missing required environment variable ${varName}`);
    process.exit(1);
  }
}

console.log("All required environment variables are set.");