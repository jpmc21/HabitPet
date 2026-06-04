const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Habit = require("../models/Habit").model;

// this one gets the info for the top bar
router.get("/profile", async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    // find best streak from habits
    const habits = await Habit.find({ userId: req.userId });

    let bestStreak = 0;
    for (let i = 0; i < habits.length; i++) {
      if (habits[i].streak > bestStreak) {
        bestStreak = habits[i].streak;
      }
    }

    res.json({
      success: true,
      username: user.username,
      points: user.points,
      petLevel: user.pet.level,
      bestStreak: bestStreak,
      petName: user.pet.name
    });

  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
});

// this is to update pet name from infobar
router.patch("/pet/name", async (req, res) => {
  try {
    const { name } = req.body
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: "Name cannot be empty" })
    }

    const user = await User.findById(req.userId)
    if (!user) return res.status(404).json({ message: "User not found" })

    user.pet.name = name.trim()
    await user.save()

    res.json({ success: true, petName: user.pet.name })
  } catch (err) {
    res.status(500).json({ message: "server error" })
  }
})

module.exports = router;