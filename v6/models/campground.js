const mongoose = require("mongoose");

//Setting up campground Schema
let campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "comment"
        }
     ]
});

module.exports = mongoose.model("campground", campgroundSchema);
