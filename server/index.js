const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json()); // Allows us to read JSON data from the frontend

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Successfully connected to MongoDB Atlas!"))
  .catch((err) => console.error("Database connection failed:", err));

// Route Traffic Directors
// (This tells the server: "If a request starts with /api/auth, go look inside the auth.js file!")
app.use("/api/auth", require("./routes/auth"));
app.use("/api/habits", require("./routes/habits"));
//app.use("/api/pets", require("./routes/pet")); 
//app.use("/api/leaderboard", require("./routes/leaderboard"));

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});