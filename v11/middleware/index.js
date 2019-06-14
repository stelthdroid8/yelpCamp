//refactoring middle ware
const   campground = require("../models/campground"),
        comment = require("../models/comment");
let middlewareObject = {};

middlewareObject.checkCampgroundOwnership= function(req,res,next){
    if(req.isAuthenticated()){
        campground.findById(req.params.id, (err, foundCampground) =>{
            if(err){
                res.redirect("back");
            }
            else{
                if(foundCampground.author.id.equals(req.user._id)){
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

middlewareObject.checkCommentOwnership = 
    function (req,res,next){
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

middlewareObject.isLoggedIn =
    function (req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        res.redirect("/login");
    }


module.exports= middlewareObject