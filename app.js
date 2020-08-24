var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var accommodationRoutes = require("./routes/accommodations");
var residenceRoutes = require("./routes/residences");
var studentRoutes = require("./routes/students");
var User = require("./models/user");
var authenticateMiddleware = require("./middleware/authentication");
const { isStudent } = require("./middleware/authentication");


mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/space_find");

mongoose.connection.on('connected', () => {
    console.log("Mongoose is connected");
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.static("Images"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

//Authentication Configuration
app.use(require("express-session")({
    secret: "Secrete message",
    resave: false, 
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.isStudent = authenticateMiddleware.isStudent;

    next();
});

//landing Page Route
app.get("/", function(req, res){
    res.render("landing");
});

app.get("/test", function(req, res){
    if(authenticateMiddleware.isStudent){
        res.send("student");
    }else{
        res.send("not a student");
    }
});


//==================================
//  INDEX ROUTES
//==================================


//Login Route - Get Login form
app.get("/login", function(req, res){
    res.render("login");
});

//LOGIN
app.post("/login", passport.authenticate("local", {
    successRedirect: "/accommodations",
    failureRedirect: "/login"
}) , function(req, res){
    
});

//LOGIN
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

//Apply route
app.get("/apply", authenticateMiddleware.isLoggedIn , function(req, res){
    res.render("apply");
});


// Use routes
app.use(studentRoutes);
app.use(accommodationRoutes);
app.use(residenceRoutes);





app.listen( process.env.PORT || "9090", function(){
    console.log("SpaceFind App has started!!!");
});