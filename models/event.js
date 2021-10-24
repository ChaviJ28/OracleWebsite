const mongoose = require("mongoose");


var eventSchema = mongoose.Schema({
    title: String,
    date: Date,
    description: String,
    imageUrl: String,
    timeFrom: String,
    timeTo: String,
    big: Boolean,
    location: String,
    linkgoogle: String,
}
);

module.exports = mongoose.model("event", eventSchema);