const mongoose = require("mongoose");

const HabitSchema = new mongoose.Schema({
    startedAt: { type: Date, required: true, default: Date.now},
    finishedAt: { type: Date },
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    title: { type: String, required: true }, // e.g., "Drink Water"
    streak: { type: Number, default: 0 }, // How many days in a row?
    //isCompletedToday: { type: Boolean, default: false },   // unnessisary

   // expireAt: {type: Date, required: false },
    frequency: { type: String,  enum: ['daily', 'weekly', 'monthly'],  default: 'daily' }, // this is for tasks with longer timelines
    lastCompletedAt: { type: Date, default: null },                                         // ie. call mom once a week
    description: {type: String, required: false, trim: true, maxLength: 500},
    reward: {type: Number, default: 10},
    exp: {type: Number, default: 0}
});


const Habit = mongoose.model("Habit", HabitSchema);

module.exports = {
    model: Habit,
    schema: HabitSchema,
};