const mongoose = require("mongoose")

const PetSchema = new mongoose.Schema({
    "created-at": Date,
    hunger: Number,
    name: String,
    level: Number,
})

const Pet = mongoose.model("Pet", PetSchema);

module.exports = {
    schema: PetSchema,
    model: Pet,
};