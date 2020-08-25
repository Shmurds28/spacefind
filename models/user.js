var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

UserSchema = new mongoose.Schema({
    username: String,
    isAdmin: Boolean,
    password: String   
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("user", UserSchema);