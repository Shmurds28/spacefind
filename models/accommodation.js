var mongoose = require("mongoose");

AccommodationsSchema = new mongoose.Schema({
    name: String,
    image: String, 
    address: String,
    phone: String,
    email: String,
    description: String,
    residences: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "residence"
        }
    ]
});

module.exports = mongoose.model("accommodation", AccommodationsSchema);