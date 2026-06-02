require("dotenv").config();

const requiredEnvVars = ["MONGO_URI", "JWT_SECRET", "SERVER_PORT"]

if (process.env.PORT && process.env.PORT === process.env.SERVER_PORT) {
  console.error(`Error: PORT environment variable (${process.env.PORT}) should not match SERVER_PORT (${process.env.SERVER_PORT}).`);
  process.exit(1);
}

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