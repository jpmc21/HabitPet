const express = require('express');
const router = express.Router();

// used AI to figure out how to import these
const User = require('../models/User');
const auth = require('../middleware/auth');

// GET /api/pet - get the pet info when user logged in
router.get('/', auth, async (req, res) => {
  try {
    // use AI, prompt: "how mongoose find by id and only get certain fields"
    const user = await User.findById(req.userId).select('pet points username');
    res.json(user);
  } catch (err) {
    // use AI, prompt: "server error return what" - 500 means something broke on our end
    res.status(500).json({ error: err.message });
  }
});

// POST /api/pet/feed - costs 15 points, adds 30 fullness
router.post('/feed', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    // not enough points, stop
    if (user.points < 15) {
      return res.status(400).json({ error: 'Not enough points' });
    }

    user.points = user.points - 15;

    // add 30 fullness but cap at 100
    user.pet.fullness = Math.min(100, user.pet.fullness + 30);

    // update mood based on fullness
    if (user.pet.fullness > 60) {
      user.pet.mood = 'happy';
    } else if (user.pet.fullness > 30) {
      user.pet.mood = 'neutral';
    } else {
      user.pet.mood = 'sad';
    }

    // use AI, prompt: "how save current time in mongoose" - new Date() just gets right now
    user.pet.lastFed = new Date();

    // use AI, prompt:"how save mongoose document" - without this changes dont actually save
    await user.save();

    res.json({ pet: user.pet, points: user.points });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/pet/interact - user clicks the pet, mood goes happy
// the 1 min timer back to neutral is handled on the frontend
router.post('/interact', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    user.pet.mood = 'happy';
    await user.save();

    res.json({ pet: user.pet });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;