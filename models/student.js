var mongoose = require("mongoose");

StudentsSchema = new mongoose.Schema({
    name: String,
    surname: String, 
    gender: String,
    phone: String,
    email: String,
    studentNumber: String,
    dob: Date,
    qualification: String,
    yearOfStudy: String
});

module.exports = mongoose.model("student", StudentsSchema);