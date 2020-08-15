var express = require("express");
var app = express();
var student = require("../models/student");


//Register Route - Get register form
app.get("/register", function(req, res){
    res.render("register");
});

//Register route
app.post("/register", function(req, res){
   var name = req.body.name;
    var surname = req.body.surname; 
    var gender = req.body.gender;
    var phone = req.body.phone;
    var email = req.body.email;
    var studentNumber = req.body.studentNumber;
    var dob = req.body.dob;
    var qualification = req.body.qualification;
    var yearOfStudy = req.body.yearOfStudy;
    var newStudent = {name: name, surname: surname, gender: gender, phone: phone, email: email, studentNumber: studentNumber, dob: dob, qualification: qualification, yearOfStudy: yearOfStudy}
    //add new student to database
    student.create(newStudent, function(err, newlyCreated){
        if(err){
            //redirect back to the register page if an error is found
            res.redirect("back");
        }else{
            //redirect to the accommodations page
            res.redirect("/accommodations");
        }
    });
});

module.exports = app;
