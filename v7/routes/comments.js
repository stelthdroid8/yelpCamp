const   express = require("express"),
        campground = require("../models/campground"),
        comment = require("../models/comment"),
        router = express.Router();
// ========================
// Comments Routes
// ========================

router.get('/campgrounds/:id/comments/new', isLoggedIn, (req,res) => {
    campground.findById(req.params.id, (err,campground) => {
        if (err){
            console.log(err);
        }
        else{
            res.render("./comments/new", {campground});
        }
    });
});

router.post('/campgrounds/:id/comments', isLoggedIn, (req,res) => {
    //lookup campground using id
    campground.findById(req.params.id, (err,campground) =>{
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }
        else{
            //create new comment
            comment.create(req.body.comment, (err, comment) => {
                if(err){
                    console.log(err);
                }
                else{
                    //connect comment to the campground
                    campground.comments.push(comment);
                    campground.save();
                    //redirect to the campgrounds show page
                    res.redirect('/campgrounds/' + campground._id);
                }
            });        
        }
    });    
});

//is logged in validation (middleware)
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


module.exports = router;