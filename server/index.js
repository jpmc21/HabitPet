const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Middleware
app.use(require("cors")()); // Allow cross-origin requests from the frontend
app.use(require("./middleware/auth"));
app.use(express.json()); // Allows us to read JSON data from the frontend

/*[GenAI Use] Prompt: "I am setting up my Express server. How do I connect to my MongoDB database using 
Mongoose and a URI stored in my .env file?"
[GenAI Use] LLM Response Start
To connect to MongoDB using Mongoose with a connection string from your `.env` file, you can use the 
`mongoose.connect()` method. 
Make sure you have required your dotenv config at the top of your file. Here is the syntax:

mongoose.connect(process.env.MONGO_URI)
[GenAI Use] LLM Response End

[GenAI Use] Reflection: I already knew how to set up the Express app, middleware, etc, 
but I didn't know the correct syntax for the Mongoose environment variable. I took the 
code and added it, then added my own .then() and .catch() to make sure the the 
connection succeeded or failed.
*/

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Successfully connected to MongoDB Atlas!"))
  .catch((err) => console.error("Database connection failed:", err));

// Route Traffic Directors
// (This tells the server: "If a request starts with /api/auth, go look inside the auth.js file!")
app.use("/api/auth", require("./routes/auth"));
app.use("/api/habits", require("./routes/habits"));
app.use("/api/user", require("./routes/user"));

if (process.env.NODE_ENV === "test") {
  app.use("/api/testing", require("./routes/testing"));
}
app.use("/api/pets", require("./routes/pet"));
//app.use("/api/leaderboard", require("./routes/leaderboard"));


if (process.env.NODE_ENV !== "production") {
  // Start the Server
  // harcoded in ./package.json
  const PORT = 2000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app; // Export the app for Vercel serverless deployment