var mongoose                =      require("mongoose");
var    passport                =      require("passport");
var   localStrategy           =      require("passport-local");
var   passportLocalMongoose   =      require("passport-local-mongoose");
var User = require("../models/user");
var Student = require("../models/student");


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect("/login");
    }
};

function isStudent(req, res){
    Student.find({studentNumber: req.session.username}, function(err, found){
        if(err){
            return false;
        }else{
          
                return false;
            
        }
    });
};

module.exports = {
    isLoggedIn: isLoggedIn,
    isStudent: isStudent
};
