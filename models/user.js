var mongoose = require("mongoose");

UsersSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    password: String,
});

module.exports = mongoose.model("user", UsersSchema);