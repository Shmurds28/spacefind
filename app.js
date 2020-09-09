var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var flash       =require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var accommodationRoutes = require("./routes/accommodations");
var residenceRoutes = require("./routes/residences");
var studentRoutes = require("./routes/students");
var adminRoutes = require("./routes/admins");
var User = require("./models/user");
var adminUser = require("./models/adminUser");
var authenticateMiddleware = require("./middleware/authentication");


mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/space_find");

mongoose.connection.on('connected', () => {
    console.log("Mongoose is connected");
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.static("Images"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(flash());

//Authentication Configuration
app.use(require("express-session")({
    secret: "Secrete message",
    resave: false, 
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


//User config
passport.use("userLocal", new LocalStrategy({usernameField: 'studentNumber',},User.authenticate()));

passport.serializeUser(function(user, done) { 
    done(null, user);
  });
  
passport.deserializeUser(function(user, done) {
    if(user!=null)
        done(null,user);
});

//admin config
passport.use("adminLocal", new LocalStrategy({ usernameField: 'email' }, adminUser.authenticate()));
passport.serializeUser(function(adminuser, done) { 
    done(null, adminuser);
  });
  
passport.deserializeUser(function(adminuser, done) {
    if(adminuser!=null)
        done(null,adminuser);
});



//Current User
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
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


//LOGOUT
app.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "logged you out");
    res.redirect("/");
});

//Apply route
app.get("/apply", authenticateMiddleware.isLoggedIn , function(req, res){
    res.render("apply");
});


// Use routes
app.use(studentRoutes);
app.use(adminRoutes);
app.use(accommodationRoutes);
app.use(residenceRoutes);



app.listen( process.env.PORT || "9080", function(){
    console.log("SpaceFind App has started!!!");
});