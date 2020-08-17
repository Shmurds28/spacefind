var mongoose = require("mongoose");

StudentsSchema = new mongoose.Schema({
    email: String,
    password: String
});

module.exports = mongoose.model("student", StudentsSchema);