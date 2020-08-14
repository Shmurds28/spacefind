var mongoose = require("mongoose");

ResidencesSchema = new mongoose.Schema({
    name: String,
    address: String,
    NoOfStudents: Number,
    price: String,
    images: String,
    type: String
});

module.exports = mongoose.model("residence", ResidencesSchema);