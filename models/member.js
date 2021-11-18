const mongoose = require("mongoose");


var memberSchema = mongoose.Schema({
    email: String,
    studentId: String,
    fName: String,
    lName: String,
    phoneNo: String,
    course: String,
    level: String,
    year: String,
    faculty: String,
    checked: Boolean
}
);

module.exports = mongoose.model("member", memberSchema);

