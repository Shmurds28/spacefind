var express = require("express");
var app = express();
var student = require("../models/student");
var user = require("../models/user");
var passport  =   require("passport");

//Register Route - Get register form
app.get("/student/register", function(req, res){
    res.render("students/register");
});

//Register route
app.post("/student/register", function(req, res){
   var name = req.body.name;
    var surname = req.body.surname; 
    var gender = req.body.gender;
    var phone = req.body.phone;
    var email = req.body.email;
    var studentNumber = req.body.studentNumber;
    var dob = req.body.dob;
    var qualification = req.body.qualification;
    var yearOfStudy = req.body.yearOfStudy;
    var password = req.body.password;
    var newStudent = {name: name, surname: surname, gender: gender, phone: phone, email: email, studentNumber: studentNumber, dob: dob, qualification: qualification, yearOfStudy: yearOfStudy}
    //add new student to database
    student.create(newStudent, function(err, newlyCreated){
        if(err){
            //redirect back to the register page if an error is found
            res.redirect("back");
        }
    });
     user.register(new user({username: newStudent.studentNumber, isAdmin: false}), password, function(err, createdUser){
                if(err){
                    console.log(err);
                    redirect("back");
                }else{
                    //createdUser.UserType = "student";
                    passport.authenticate("userLocal")(req, res, function(){
                        //redirect to the accommodations page
                    res.redirect("/accommodations");
                    });
                   
                }
            });          
});

//Login Route - Get Login form
app.get("/student/login", function(req, res){
    res.render("students/login");
});

//LOGIN
app.post("/student/login", passport.authenticate("userLocal", {
    successRedirect: "/accommodations",
    failureRedirect: "/student/login"
}) , function(req, res){

});

module.exports = app;
