const mongoose = require("mongoose"),
      comment = require("./comment");

//Setting up campground Schema
let campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    author: {
       id:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
       },
       username: String
    },
    comments: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "comment"
        }
     ]
});

campgroundSchema.pre('remove', async function(next){
   try{
      await comment.deleteMany({
         "_id": {
             $in: this.comments
            }
         });
   } catch(err){
      next(err);
   }
   
});

module.exports = mongoose.model("campground", campgroundSchema);
