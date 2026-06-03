const express = require('express');
const router = express.Router();

// used AI to figure out how to import these
const User = require('../models/User');
// added this - need getLevel getMood applyDecay for the pet system
const { getLevel, getMood, applyDecay } = require('../utils/petUtils');

// GET /api/pet - get the pet info when user logged in
router.get('/', async (req, res) => {
  try {
    // use AI, prompt: "how mongoose find by id and only get certain fields"
    const user = await User.findById(req.userId);

    // added - apply decay so fullness is up to date before we send it
    user.pet.fullness = applyDecay(user.pet.fullness, user.pet.lastDecayAt);
    user.pet.lastDecayAt = new Date();
    await user.save();

    // changed - level and mood are calculated now, not stored in db
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
router.post('/feed', async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    // not enough points, stop
    if (user.points < 15) {
      return res.status(400).json({ error: 'Not enough points' });
    }

    // added - apply decay before feeding so we dont overfeed a full pet
    user.pet.fullness = applyDecay(user.pet.fullness, user.pet.lastDecayAt);
    user.pet.lastDecayAt = new Date();

    user.points = user.points - 15;

    // add 30 fullness but cap at 100
    user.pet.fullness = Math.min(100, user.pet.fullness + 30);

    // removed - mood update, its calculated now not stored
    // removed - lastFed, replaced with lastDecayAt

    // use AI, prompt:"how save mongoose document" - without this changes dont actually save
    await user.save();

    // changed - calculate level and mood before sending back
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
router.post('/interact', async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    // added - apply decay first so fullness is correct
    user.pet.fullness = applyDecay(user.pet.fullness, user.pet.lastDecayAt);
    user.pet.lastDecayAt = new Date();
    await user.save();

    // removed - user.pet.mood = 'happy', mood is calculated not stored
    // force happy here, frontend handles timer back to normal
    const petData = {
      fullness: user.pet.fullness,
      exp: user.pet.exp,
      level: getLevel(user.pet.exp),
      mood: 'happy',
    }

    res.json({ pet: petData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;