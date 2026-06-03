const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

  username: { type: String, required: true, unique: true },

  password: { type: String, required: true },

  points: { type: Number, default: 0 },
  pet: {
    fullness: { type: Number, default: 100 },
    exp: { type: Number, default: 0 },
    // no need to store mood/level anymore, we calculate them
    // changed lastFed to lastDecayAt - tracks when we last updated fullness
    lastDecayAt: { type: Date, default: Date.now }
  },


  lastModifiedAt: { type: Date, required: true, default: Date.now },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;