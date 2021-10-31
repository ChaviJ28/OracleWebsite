const mongoose = require("mongoose");


var blogSchema = mongoose.Schema({
    title: String,
    date: Date,
    description: String,
    imageUrl: String,
    author: String,
    catch:String
}
);

module.exports = mongoose.model("blog", blogSchema);