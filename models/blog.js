const mongoose = require("mongoose");

var eventSchema = mongoose.Schema({
    title: String,
    date: { $type: Date, default: Date.now },
    description: String,
    imageUrl: String,
    timeFro: String,
    timeTo: String,
    location: String,
    email: String,
    collaborators: [
        {
            name: { $type: String },
            image: { $type: String },
            description: { $type: String }
        }
    ],
    registrationForm: {
        id: {
            $type: mongoose.Schema.Types.ObjectId,
            ref: "form"
        }
    }
    // registrationURL: String
},
    { typeKey: '$type' }
);

module.exports = mongoose.model("event", eventSchema);