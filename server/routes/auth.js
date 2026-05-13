const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Pet = require("../models/Pets"); 

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "An account with this username already exists." });
    }

    const newUser = new User({
      username,
      password
    });
    
        const savedUser = await newUser.save();

    const newPet = new Pet({
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

module.exports = router;