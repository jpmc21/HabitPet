const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

  username: { type: String, required: true, unique: true },

  password: { type: String, required: true },

  points: { type: Number, default: 0 },

  pet: {
    fullness: { type: Number, default: 100 },
    mood:     { type: String, default: 'neutral' },
    level:    { type: Number, default: 0 },
    exp:      { type: Number, default: 0 },
    // used AI, prompt: "how to store current time as default in mongoose"
    lastFed:  { type: Date, default: Date.now }
  },

});

const User = mongoose.model("User", UserSchema);

module.exports = User;