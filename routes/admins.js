var express = require("express");
var app = express();
var Admin = require("../models/admin");
var AdminUser = require("../models/adminUser");
var passport  =   require("passport");


//============================================
//  Admin routes
//============================================

//Register- Get register form
app.get("/admin/register", function(req, res){
    res.render("admins/register");
});

app.post("/admin/register", function(req, res){
    var name = req.body.name;
    var address = req.body.address;
    var phone = req.body.phone;
    var email = req.body.email;
    var password = req.body.password;
    var newAdmin = {name: name, address: address, phone: phone, email: email};
    Admin.create(newAdmin, function(err, admin){
        if(err){
            console.log(err);
            res.redirect("back");
        }
    });
    AdminUser.register(new AdminUser({username: email, isAdmin: true}), password, function(err, newAdminUser){
        if(err){
            console.log(err);
            res.redirect("/admin/register");
        }else{
            // res.send("hello");
            passport.authenticate("adminLocal")(req, res, function(){
                res.redirect("/");
            });
        }
    });
});

//Login - Get Login Form
app.get("/admin/login", function(req, res){
    res.render("admins/login");
});


app.post("/admin/login", passport.authenticate("adminLocal",{
    successRedirect: "/accommodations",
    failureRedirect: "/admin/login",

}), function(req, res){
    
});

module.exports = app;