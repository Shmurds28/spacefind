var mongoose = require("mongoose");

AccommodationsSchema = new mongoose.Schema({
    name: String, 
    address: String,
    phone: String,
    email: String,
    description: String,
    image: { 
            data: Buffer, 
            contentType: String 
        },
    residences: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "residence"
        }
    ]
});

module.exports = mongoose.model("accommodation", AccommodationsSchema);