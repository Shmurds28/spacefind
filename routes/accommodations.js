var express = require("express");
var app = express();
var Accommodation = require("../models/accommodation");
var Residence = require("../models/residence");

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
            res.render("accommodations/accommodations", {place: place, accommodations: FoundAcc});
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
    //find the accommodation usind an idgi
   Accommodation.findById(req.params.id).populate("residences").exec(function(err, foundAcc){
       if(err){
           //redirect back to accommodations if there is an error
           console.log(err);
           res.redirect("back");
       }else{
           //go to the show page if accommodation is found successfully
        res.render("accommodations/show", {accommodation: foundAcc} );
       }
   });
   
});

// Delete accommodation route
app.delete("/accommodations/:id", function(req, res){
    Accommodation.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("accommodations/accommodations");
        }
    })
});

module.exports = app;