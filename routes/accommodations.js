var express = require("express");
var app = express();
var mongoose = require("mongoose");
var Accommodation = require("../models/accommodation");
var Residence = require("../models/residence");
var path = require("path");
const uploadController = require("../controllers/upload");
const upload = require("../middleware/upload");
const Grid = require("gridfs-stream");
var authenticationMiddleware = require("../middleware/authentication");
var Admin = require("../models/admin");
var AdminUser = require("../models/adminUser");
var passport = require("passport");

var fs = require('fs');  
require('dotenv/config'); 


//================================
//  ACCOMMODATION ROUTES
//================================


//accommodations route
app.get("/accommodations", function(req, res){
    
   if( !(req.user) || !(req.user.isAdmin) ){
    Accommodation.find({}, function(err, FoundAcc){
        if(err){
            console.log(err);
            res.render("back");
        }else{
            res.render("accommodations/accommodations", {accommodations: FoundAcc});
        }
    });
   }else{
        var adminAcommodations = [];
        Accommodation.find({}, function(err, Found){
            if(err){
                console.log(err)
            }else{
                Found.forEach(function(accommodation){
                    for(var i = 0; i < accommodation.administrator.length; i++){
                        if(accommodation.administrator[i].id.equals(req.user._id)){
                            adminAcommodations.push(accommodation);
                           
                            break;
                        }
                    }
                });
                
                res.render("accommodations/accommodations", {accommodations: adminAcommodations});
            }
        });
   }
   
});

//Get accommodation registration form route
app.get("/accommodations/new", authenticationMiddleware.isLoggedInAsAdmin , function(req, res){
    res.render("accommodations/new");
});

//post accommodation to the database route
app.post("/accommodations/new", authenticationMiddleware.isLoggedInAsAdmin, uploadController.uploadFile ,function(req, res){
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
   
    var administrator = {
        id: req.user._id,
        username: req.user.username
    };

    var newAccammodation = {name: name, address: address, phone: phone, email: email, description: description, image: image};
    // res.render("test", {new: newAccammodation});
    
    Accommodation.create(newAccammodation, function(err, newlyCreated){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            newlyCreated.administrator.push(administrator);
            newlyCreated.save();
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

//Add new administrator for accommodation - get form
// app.get("/accommodations/:id/newAdmin", function(req, res){
//     Accommodation.findById(req.params.id).populate("residences").exec(function(err, foundAcc){
//         if(err){
//             //redirect back to accommodations if there is an error
//             console.log(err);
//             res.redirect("back");
//         }else{
//             //go to the show page if accommodation is found successfully
//          res.render("accommodations/newAdmin", {accommodation: foundAcc} );
//         }
//     });
// });

// //Post new administrator to the accommodation
// app.post("/accommodations/:id/newAdmin", function(req, res){
//     var name = req.body.name;
//     var address = req.body.address;
//     var phone = req.body.phone;
//     var email = req.body.email;
//     var password = req.body.password;
//     var newAdmin = {name: name, address: address, phone: phone, email: email};
//     var accommodationId = req.params.id;
//     Admin.create(newAdmin, function(err, admin){
//         if(err){
//             console.log(err);
//             res.redirect("back");
//         }
//     });
//     AdminUser.register(new AdminUser({username: email, isAdmin: true}), password, function(err, newAdminUser){
//         if(err){
//             console.log(err);
//             res.redirect("/admin/register");
//         }else{
//             // res.send("hello");
//             passport.authenticate("adminLocal")(req, res, function(){
//                 Accommodation.findById({accommodationId}, function(err, found){
//                     if(err){
//                         console.log(err);
//                     }else{
//                         var newUser = {
//                             id: newAdminUser._id,
//                             username: newAdminUser.username
//                         };
//                         found.administrator.push(newUser);
//                         found.save();
//                     }
//                 });
//                 res.redirect("/accommodations/"+ accommodationId);
//             });
//         }
//     });
// });

//Edit - Get edit form
app.get("/accommodations/:id/edit", function(req, res){
    Accommodation.findById(req.params.id, function(err, accommodation){
        if(err){
            console.log(err);
        }else{
            res.render("accommodations/edit", {accommodation: accommodation});
        }
    });
});

//Edit - Post updated details
app.put("/accommodations/:id/edit", authenticationMiddleware.isLoggedInAsAdmin, uploadController.uploadFile , function(req, res){
    var accommodation = {
         name : req.body.name,
         address : req.body.address,
         phone : req.body.phone,
         email : req.body.email,
         description : req.body.description,
         image : { 
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)), 
            contentType: 'image/png'
        },       
        administrator : {
            id: req.user._id,
            username: req.user.username
        }
    }
    Accommodation.findByIdAndUpdate(req.params.id, accommodation, function(err){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            res.redirect("/accommodations/" + req.params.id);
        }
    })
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