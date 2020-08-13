var mongoose = require("mongoose");

AccommodationsSchema = new mongoose.Schema({
    name: String,
    image: String, 
    address: String,
    phone: String,
    email: String,
    description: String
});

module.exports = mongoose.model("accommodation", AccommodationsSchema);