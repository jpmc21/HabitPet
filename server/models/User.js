const mongoose = require("mongoose");

const Habit = require("./Habit")
const Pet = require("./Pets")

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true},

    password: {type: String, required: true},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    
    points:{type: Number, default: 0, min: 0},

    //Habits: [Habit.Schema],
    //Pets: [Pet.Schema],

})

const User = mongoose.model("User", UserSchema);

module.exports = User;