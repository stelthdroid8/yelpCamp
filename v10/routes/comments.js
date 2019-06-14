const   express = require("express"),
        campground = require("../models/campground"),
        comment = require("../models/comment"),
        router = express.Router({mergeParams: true});
// ========================
// Comments Routes
// ========================
//comments NEw
router.get('/new', isLoggedIn, (req,res) => {
    campground.findById(req.params.id, (err,campground) => {
        if (err){
            console.log(err);
        }
        else{
            res.render("./comments/new", {campground});
        }
    });
});

//Comments create
router.post('/', isLoggedIn, (req,res) => {
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
                    //add username & id to comment then save
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
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

//edit route
router.get("/:comment_id/edit", checkCommentOwnership, isLoggedIn, (req,res) =>{
    comment.findById(req.params.comment_id, (err, foundComment) =>{  
        if (err){
            res.redirect("back");
        }
        else{
            res.render("comments/edit", {campgroundID: req.params.id, comment:foundComment});
        }
    });
  
});
//update

router.put("/:comment_id", checkCommentOwnership, (req,res)=>{
    comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) =>{
        if(err){
            res.redirect("back");
        }
        else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//destroy comment
router.delete("/:comment_id", checkCommentOwnership, (req,res) =>{
    comment.findByIdAndRemove(req.params.comment_id, (err)=>{
        if(err){
            res.redirect("back");
        }
        else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});


function checkCommentOwnership(req,res,next){
    if(req.isAuthenticated()){
        comment.findById(req.params.comment_id, (err, foundComment) =>{
            if(err){
                res.redirect("back");
            }
            else{
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    res.redirect("back");
                }
                
    
            }
        });
    }
    else{
        res.redirect("back");
    }
}

//is logged in validation (middleware)
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


module.exports = router;