const mongoose = require("mongoose");


var bannerSchema = mongoose.Schema({
    url: String,
    link: String,
    active: Boolean,
    dateCreated: { type: Date, default: Date.now }
}
);

module.exports = mongoose.model("banner", bannerSchema);


