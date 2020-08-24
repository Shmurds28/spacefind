var express = require("express");
var app = express();
var mongoose = require("mongoose");
var Accommodation = require("../models/accommodation");
var Residence = require("../models/residence");
var path = require("path");
const uploadController = require("../controllers/upload");
const upload = require("../middleware/upload");
const Grid = require("gridfs-stream");


var fs = require('fs');  
require('dotenv/config'); 


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

//CREATE new residence route
app.post("/accommodations/:id/residences/new", uploadController.uploadFiles , function(req, res){
   
    //  console.log(req.files);
    
    var images = [];
    var uploads = req.files;
    uploads.forEach(function(image){
        images.push( { 
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + image.filename)), 
            contentType: 'image/png'
        });
    });
   
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
                    residence.images = images;
                    residence.save();
                    accommodation.residences.push(residence);
                    accommodation.save();
                    res.redirect("/accommodations/" + accommodation._id);
                }
            });
        }
    });
});

//SHOW - View residence

app.get("/accommodations/:id/residences/:resId", function(req, res){
    Residence.findById(req.params.resId, function(err, residence){
        if(err){
            console.log(err);
            res.render("back");
        }else{
            // console.log(mongoose.Schema.Types.ObjectId(req.params.resId));
            res.render("residences/view", {residence: residence, accommodation_id: req.params.id});
        }
    });
});

//Delete residence route
app.delete("/accommodations/:id/residences/:resId", function(req, res){
    Residence.findByIdAndRemove(req.params.resId, function(err){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            res.redirect("/accommodations/" + req.params.id);
        }
    });
});

module.exports = app;