const mongoose = require("mongoose");

const HabitSchema = new mongoose.Schema({
    "started-at": { type: Date, required: true },
    "finished-at": { type: Date, required: true },
});

const Habit = mongoose.model("Habit", HabitSchema);

module.exports = {
    model: Habit,
    schema: HabitSchema,
};