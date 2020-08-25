var mongoose = require("mongoose");

AdminSchema = new mongoose.Schema({
    name: String,
    address: String,
    phone: String,
    email: String
});


module.exports = mongoose.model("admin", AdminSchema);