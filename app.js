var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var accommodation = require("./models/accommodation");
var test = require("./seeds");


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
   accommodation.findById(req.params.id, function(err, foundAcc){
       if(err){
           console.log(err);
           res.redirect("/accommodations");
       }else{
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
    res.send("Registered!");
});

app.listen( process.env.PORT || "5000", function(){
    console.log("SpaceFind App has started!!!");
});