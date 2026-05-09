const mongoose = require("mongoose");

const Habit = require("./Habit")
const Pet = require("./Pets")

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    Habits: [Habit.Schema],
    Pets: [Pet.Schema],
})

const User = mongoose.model("User", UserSchema);

module.exports = User;