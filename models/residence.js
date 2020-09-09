var mongoose = require("mongoose");

ResidencesSchema = new mongoose.Schema({
    name: String,
    address: String,
    NoOfStudents: Number,
    price: String,
    images: [
        { 
            data: Buffer, 
            contentType: String 
        }
    ],
    type: String,
    status: Boolean,
    description: String
});

module.exports = mongoose.model("residence", ResidencesSchema);