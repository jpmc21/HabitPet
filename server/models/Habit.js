const mongoose = require("mongoose");


// [AI usage]prompt: for writing a model for mongoose what are important paramters to include such as deafult etc
// [AI usage] response: returned with 
/*
1. Basic Field Parameterstype: Defines the data type (e.g., String, Number, Boolean, Date, ObjectId, Array).required: Accepts a boolean or function. If true, Mongoose throws a validation error if the field is missing or null.default: Sets a fallback value if none is provided. This can be a static value or a function (e.g., Date.now).2. Validation & Formattingenum: An array of strings. Restricts a string field to a specific set of allowed values.min / max: Validates numeric boundaries (e.g., min: 18).minlength / maxlength: Validates the length of strings.match: Uses regular expressions (regex) to enforce patterns, like validating an email format.lowercase / uppercase / trim: Boolean parameters that clean string values before they save (e.g., { type: String, trim: true }).3. Indexing & Relationshipsunique: Tells Mongoose to create a unique index for the field in MongoDB. Great for emails or usernames, but it's not a standalone validator.sparse: Creates a sparse index. Highly useful for unique fields that might be left empty by many documents.ref: Used when linking data in different collections (creates a foreign-key-like reference using ObjectId).4. Advanced Behaviorsimmutable: If true, Mongoose prevents the field from being updated once the document is created.select: Boolean. If false, the field is excluded from query results by default unless you explicitly ask for it.validate: Allows you to supply a custom validation function for complex logic.5. Schema-Wide OptionsPassed as a second object to new mongoose.Schema({}, options):timestamps: true: Automatically adds and manages createdAt and updatedAt fields.
*/
//[AI usage] reflection: this gave me the building blocks needed to write out the variables our backend needed and gave the structure to create the following schema. 

const HabitSchema = new mongoose.Schema({
    lastModifiedAt: { type: Date, required: true, default: Date.now },
    startedAt: { type: Date, required: true, default: Date.now },
    finishedAt: { type: Date },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true }, // e.g., "Drink Water"
    streak: { type: Number, default: 0 }, // How many days in a row?
    //isCompletedToday: { type: Boolean, default: false },   // unnessisary

    // expireAt: {type: Date, required: false },
    frequency: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'daily' }, // this is for tasks with longer timelines
    lastCompletedAt: { type: Date, default: null },                                         // ie. call mom once a week
    description: { type: String, required: false, trim: true, maxLength: 500 },
    reward: { type: Number, default: 10 },
    exp: { type: Number, default: 0 },
    completions: [{ type: Date }]  //track full history of completions for statpage
});


const Habit = mongoose.model("Habit", HabitSchema);

module.exports = {
    model: Habit,
    schema: HabitSchema,
};