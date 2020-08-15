var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var Accommodation = require("./models/accommodation");
var student = require("./models/student");
var test = require("./seeds");
var Residence = require("./models/residence");
var methodOverride = require("method-override");


mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/space_find");

mongoose.connection.on('connected', () => {
    console.log("Mongoose is connected");
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.static("Images"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
//test();


//landing Page Route
app.get("/", function(req, res){
    res.render("landing");
});

//================================
//  ACCOMMODATION ROUTES
//================================




//accommodations route
app.get("/accommodations", function(req, res){
    var place = req.body.place;
   
    Accommodation.find({}, function(err, FoundAcc){
        if(err){
            console.log(err)
        }else{
            res.render("accommodations", {place: place, accommodations: FoundAcc});
        }
    });
});

//Get accommodation registration form route
app.get("/accommodations/new", function(req, res){
    res.render("accommodations/new");
});

//post accommodation to the database route
app.post("/accommodations/new", function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var address = req.body.address;
    var phone = req.body.phone;
    var email = req.body.email;
    var description = req.body.description;

    var newAccmmodation = {name: name, image: image, address: address, phone: phone, email: email, description: description};
    Accommodation.create(newAccmmodation, function(err, newlyCreated){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            res.redirect("/accommodations");
        }
    });
});


//Show Accommodation details route
app.get("/accommodations/:id", function(req, res){
    //find the accommodation usind an id
   Accommodation.findById(req.params.id).populate("residences").exec(function(err, foundAcc){
       if(err){
           //redirect back to accommodations if there is an error
           console.log(err);
           res.redirect("back");
       }else{
           //go to the show page if accommodation is found successfully
        res.render("show", {accommodation: foundAcc} );
       }
   });
   
});

// Delete accommodation route
app.delete("/accommodations/:id", function(req, res){
    Accommodation.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/accommodations");
        }
    })
});




//==================================
//  INDEX ROUTES
//==================================


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
    Accommodation.findById(req.params.id, function(err, accommodation){
        if(err){
            res.redirect("back");
        }else{
            res.render("residences/new", {accommodation: accommodation} );
        }
    });
});

//post the new residence route
app.post("/accommodations/:id/residences/new", function(req, res){
    Accommodation.findById(req.params.id, function(err, accommodation){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            Residence.create(req.body.residence, function(err, residence){
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

//Delete residence route
app.delete("/accommodations/:id/residences/:res_id", function(req, res){
    Residence.findByIdAndRemove(req.params.res_id, function(err){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            res.redirect("accommodations/" + req.params.id);
        }
    });
});

app.listen( process.env.PORT || "9000", function(){
    console.log("SpaceFind App has started!!!");
});