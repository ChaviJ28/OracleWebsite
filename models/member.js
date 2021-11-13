const mongoose = require("mongoose");


var memberSchema = mongoose.Schema({
    email: String,
    fName: String,
    lName: String,
    phoneNo: String,
    course: String,
    year: String,
    faculty: String,
    checked: Boolean
}
);

module.exports = mongoose.model("member", memberSchema);

