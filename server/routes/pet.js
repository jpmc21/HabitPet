const express = require('express');
const router = express.Router();

// used AI to figure out how to import these
const User = require('../models/User');
const auth = require('../middleware/auth');

// added petUtils - getLevel and getMood so we dont have to store them in db
// used AI, prompt: "how to require a local file in node"
const { getLevel, getMood, applyDecay } = require('../utils/petUtils');

// GET /api/pet - get the pet info when user logged in
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    // added decay here - apply fullness drop before sending data back
    user.pet.fullness = applyDecay(user.pet.fullness, user.pet.lastDecayAt);
    user.pet.lastDecayAt = new Date();
    await user.save();

    // level and mood are now calculated not stored
    const petData = {
      fullness: user.pet.fullness,
      exp: user.pet.exp,
      level: getLevel(user.pet.exp),
      mood: getMood(user.pet.fullness),
    }

    res.json({ pet: petData, points: user.points, username: user.username });
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

    // added decay before feeding so fullness is accurate
    user.pet.fullness = applyDecay(user.pet.fullness, user.pet.lastDecayAt);
    user.pet.lastDecayAt = new Date();

    user.points = user.points - 15;

    // add 30 fullness but cap at 100
    user.pet.fullness = Math.min(100, user.pet.fullness + 30);

    // removed mood update here - mood is now calculated from fullness in petUtils
    // removed lastFed - replaced with lastDecayAt

    // use AI, prompt:"how save mongoose document" - without this changes dont actually save
    await user.save();

    // calculate level and mood before sending back
    const petData = {
      fullness: user.pet.fullness,
      exp: user.pet.exp,
      level: getLevel(user.pet.exp),
      mood: getMood(user.pet.fullness),
    }

    res.json({ pet: petData, points: user.points });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/pet/interact - user clicks the pet, mood goes happy
// the 1 min timer back to neutral is handled on the frontend
router.post('/interact', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    // apply decay first
    user.pet.fullness = applyDecay(user.pet.fullness, user.pet.lastDecayAt);
    user.pet.lastDecayAt = new Date();
    await user.save();

    // removed user.pet.mood = 'happy' - mood is calculated now
    // frontend handles the 1 min timer to go back to normal mood
    const petData = {
      fullness: user.pet.fullness,
      exp: user.pet.exp,
      level: getLevel(user.pet.exp),
      mood: 'happy',  // force happy on interact, frontend resets after 1 min
    }

    res.json({ pet: petData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;