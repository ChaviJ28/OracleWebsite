const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
    name: String,
    username: String,
    salt: String,
    hash: String,
    dateRegistered: { type: Date, default: Date.now },
    email: String
});


UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("user", UserSchema);