var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var accommodation = require("./models/accommodation");
var student = require("./models/student");
var test = require("./seeds");
var residence = require("./models/residence");


mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/space_find");

mongoose.connection.on('connected', () => {
    console.log("Mongoose is connected");
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.static("Images"));
app.use(bodyParser.urlencoded({extended:true}));
//test();


//landing Page Route
app.get("/", function(req, res){
    res.render("landing");
});

//accommodations route
app.get("/accommodations", function(req, res){
    var place = req.body.place;
   
    accommodation.find({}, function(err, FoundAcc){
        if(err){
            console.log(err)
        }else{
            res.render("accommodations", {place: place, accommodations: FoundAcc});
        }
    });
});


//Show Accommodation details route
app.get("/accommodations/:id", function(req, res){
    //find the accommodation usind an id
   accommodation.findById(req.params.id, function(err, foundAcc){
       if(err){
           //redirect back to accommodations if there is an error
           console.log(err);
           res.redirect("back");
       }else{
           //go to the show page if accommodation is found successfully
        res.render("show", {accommodation: foundAcc} );
       }
   })
   
});


//Login Route - Get Login form
app.get("/login", function(req, res){
    res.render("login");
});

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

//====================================
//  RESIDENCES ROUTES
//====================================

//new residendence route
app.get("/accommodations/:id/residences/new", function(req, res){
    accommodation.findById(req.params.id, function(err, accommodation){
        if(err){
            res.redirect("back");
        }else{
            res.render("residences/new", {accommodation: accommodation} );
        }
    });
});

//post the new residence route
app.post("/accommodations/:id/residences/new", function(req, res){
    accommodation.findById(req.params.id, function(err, accommodation){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            residence.create(req.body.residence, function(err, residence){
                if(err){
                    console.log(err);
                    res.redirect("/accommodations/" + accommodation._id);
                }else{
                    residence.save();
                    accommodation.residences.push(residence);
                    accommodation.save();
                    res.redirect("/accommodations/" + accommodation._id);
                }
            });
        }
    });
});

app.listen( process.env.PORT || "9000", function(){
    console.log("SpaceFind App has started!!!");
});