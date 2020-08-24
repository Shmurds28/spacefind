var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var accommodationRoutes = require("./routes/accommodations");
var residenceRoutes = require("./routes/residences");
var studentRoutes = require("./routes/students");


mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/space_find");

mongoose.connection.on('connected', () => {
    console.log("Mongoose is connected");
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.static("Images"));
app.use(bodyParser.urlencoded({extended:false}));
app.use(methodOverride("_method"));


//landing Page Route
app.get("/", function(req, res){
    res.render("landing");
});


//==================================
//  INDEX ROUTES
//==================================


//Login Route - Get Login form
app.get("/login", function(req, res){
    res.render("login");
});

//Apply route
app.get("/apply", function(req, res){
    res.render("apply");
});


// Use routes
app.use(studentRoutes);
app.use(accommodationRoutes);
app.use(residenceRoutes);



app.listen( process.env.PORT || "9090", function(){
    console.log("SpaceFind App has started!!!");
});