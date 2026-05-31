const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Pet = require("../models/Pets");
const jwt = require("jsonwebtoken")
const bc = require("bcryptjs");

const BCRYPT_SALT_ROUNDS = 10;

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "An account with this username already exists." });
    }

    const newUser = new User({
      username,
      password: await bc.hash(password, BCRYPT_SALT_ROUNDS),
    });

    const savedUser = await newUser.save();

    const newPet = new Pet.model({
      userId: savedUser._id,
      name: `${username}'s Egg`, // Default name they can change later
    });

    await newPet.save();

    res.status(201).json({
      message: "User registered and Egg spawned successfully!",
      userId: savedUser._id
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during registration." });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const existingUser = await User.findOne({ username });
  if (!existingUser) return res.status(401).json({ message: "Invalid credentials" });

  const passwordMatch = await bc.compare(password, existingUser.password);
  if (!passwordMatch) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { userId: existingUser._id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.status(200).json({ token });
});
// added this to help with checking if the token is valid in out app.js
router.get('/verify', async (req, res) => {
  try {
    // If the token passes the middleware, it's valid!
    res.status(200).json({ success: true, message: "Token is valid!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;