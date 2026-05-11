const mongoose = require("mongoose");

const PetSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
    name: { type: String, required: true }, 
    hunger: { type: Number, default: 100, min: 0, max: 100 }, 
    level: { type: Number, default: 1 }, // Replaced 'stage' with your teammate's 'level'
    stage: { type: String, enum: ['egg', 'baby', 'teen', 'adult'], default: 'egg' },
    mood: { type: String, enum: ['happy', 'sad', 'neutral'], default: 'neutral' },
    exp: { type: Number, default: 0 }, // Experience points for leveling up
    lastFed: { type: Date, default: Date.now }, // Track when the pet was last fed


});

const Pet = mongoose.model("Pet", PetSchema);

module.exports = {
    schema: PetSchema,
    model: Pet,
};