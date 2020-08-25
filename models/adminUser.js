var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

AdminUserSchema = new mongoose.Schema({
    email: String,
    isAdmin: Boolean,
    password: String
});

AdminUserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("adminUser", AdminUserSchema);