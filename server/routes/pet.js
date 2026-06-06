const express = require('express');
const router = express.Router();

const User = require('../models/User');
// added this - need getLevel getMood applyDecay for the pet system
const { getLevel, getMood, applyDecay } = require('../utils/petUtils');

// GET /api/pet - get the pet info when user logged in
router.get('/', async (req, res) => {
  try {
    // [GenAI Use] Prompt: "In a Node/Express app with Mongoose, how do I find a document by its id?"
    // [GenAI Use] LLM Response Start
    const user = await User.findById(req.userId);
    // [GenAI Use] LLM Response End
    // [GenAI Use] Reflection: findById is shorthand for findOne({_id: id}). don't filter fields here because we need the whole user object to update and save later

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
    // 500 means something broke on our end
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

    // keep fullness at max 100
    user.pet.fullness = Math.min(100, user.pet.fullness + 30);

    // removed - mood update, its calculated now not stored
    // removed - lastFed, replaced with lastDecayAt

    // [GenAI Use] Prompt: "After modifying a Mongoose document in Express, how do I persist the changes to MongoDB?"
    // [GenAI Use] LLM Response Start
    await user.save();
    // [GenAI Use] LLM Response End
    // [GenAI Use] Reflection: without .save() changes only exist in memory and don't actually go to the db. await makes sure save finishes before we send the response back

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