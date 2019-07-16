//refactoring middle ware
const   campground = require("../models/campground"),
        comment = require("../models/comment");
let middlewareObject = {};

middlewareObject.checkCampgroundOwnership= function(req,res,next){
    if(req.isAuthenticated()){
        campground.findById(req.params.id, (err, foundCampground) =>{
            if(err){
                req.flash("error", "Campground not found!");
                res.redirect("back");
            }
            else{
                if (!foundCampground) {
                    req.flash("error", "Item not found.");
                    return res.redirect("/campgrounds");
                }
                    if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin){
                        next();
                    }
                    else{
                        req.flash("error", "You don't have permission to do that!");
                        res.redirect("back");
                    }
                
            }
        });
    }
    else{
        req.flash("error", "You must be logged in to do that!");
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
                    if (!foundComment) {
                        req.flash("error", "Item not found.");
                        return res.redirect("/campgrounds");
                    }
                        if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                            next();
                        }
                        else{
                            req.flash("error", "You dont have permission to do that!");
                            res.redirect("back");
                        }
                    
        
                }
            });
        }
        else{
            req.flash("error", "You must be logged in to do that!");
            res.redirect("back");
        }
    }

middlewareObject.isLoggedIn =
    function (req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error', "You must be logged in to do that!");
        res.redirect("/login");
    }


module.exports= middlewareObject