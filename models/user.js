var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    userType: String
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("user", UserSchema);