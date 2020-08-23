var express = require("express");
var app = express();
var mongoose = require("mongoose");
var Accommodation = require("../models/accommodation");
var Residence = require("../models/residence");
var path = require("path");
const homeController = require("../controllers/home");
const uploadController = require("../controllers/upload");
const upload = require("../middleware/upload");
const Grid = require("gridfs-stream");
const cloudinary = require('cloudinary');

const conn = mongoose.createConnection("mongodb://localhost/space_find");

var fs = require('fs');  
require('dotenv/config'); 

//Init gfs
let gfs;

conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("photos");
});

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
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
            res.render("accommodations/accommodations", {place: place, accommodations: FoundAcc});
        }
    });
});

//Get accommodation registration form route
app.get("/accommodations/new", function(req, res){
    res.render("accommodations/new");
});

//post accommodation to the database route
app.post("/accommodations/new", uploadController.uploadFile  ,function(req, res){
    // console.log(req.file);
    var name = req.body.name;
    var image = req.body.image;
    var address = req.body.address;
    var phone = req.body.phone;
    var email = req.body.email;
    var description = req.body.description;
    var image = { 
        data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)), 
        contentType: 'image/png'
    }
   
    console.log(req.file.filename);

    var newAccammodation = {name: name, address: address, phone: phone, email: email, description: description, image: image};
    // res.render("test", {new: newAccammodation});
  
    Accommodation.create(newAccammodation, function(err, newlyCreated){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            res.render("test", {new: newlyCreated});
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
            res.redirect("/accommodations");
        }
    })
});

module.exports = app;