const   express = require("express"),
        campground = require("../models/campground"),
        comment = require("../models/comment"),
        mongoose= require("mongoose"),
        middleware = require("../middleware/"),
        router = express.Router();


mongoose.set('useFindAndModify', false);
//index route (shows all cmapgrounds)
router.get('/', (req,res) => {
    //get all campgrounds from db then render
    campground.find({}, (err,allCampgrounds) => {
        if (err){
            console.log("ERROR");
            console.log(err);        }
    
        else {
            res.render("campgrounds/index", {campgrounds:allCampgrounds});
        }
    })
});

//new route, shows form to create campground
router.get('/new', middleware.isLoggedIn, (req,res) => {
    //shows form to send data to post route
    res.render("campgrounds/new");
});

//create route (adds new campground to db)
router.post('/', middleware.isLoggedIn, (req,res) => {
    //retrieve form data and add into array
    //redirect to the original /campgrounds route
    let name = req.body.name;
    let price = req.body.price;
    let image = req.body.image;
    let desc = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    let newCampground = {name, price, image,description: desc, author};
    // create new campground based off input and save to db
        
    campground.create(
        newCampground,
        (err,newCampground) => {
            if (err){
                console.log("ERROR HAS OCCURRED");
                console.log(err);
            }
            else{
                //debugging info and redirecting to campgrounds list
                // console.log("newly created campground!");
                // console.log(newCampground);
                res.redirect('/campgrounds');
            }
        });
});



//show route, shows more info about specific campground
router.get('/:id', (req,res) => {    
    //find campground with id and render the page with that id
    campground.findById(req.params.id).populate("comments").exec((err,foundCampground) => {
        if (err){
            console.log("error");
            console.log(err);
        }
        else{
            // console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});
        }
    }); 
});


//  Edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req,res) =>{
    campground.findById(req.params.id, (err, foundCampground) =>{
        res.render("campgrounds/edit", {campground:foundCampground});
    });
});


//  UPDATE campground rotue

router.put("/:id", middleware.checkCampgroundOwnership, (req,res) =>{
    //find and update campground by id then redirect
    campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) =>{
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//Destory campground route
router.delete("/:id", middleware.checkCampgroundOwnership, (req,res, next)=>{
    campground.findById(req.params.id, (err, foundCampground)=>{
        if(err){
          return next(err);
        }
        else{
        foundCampground.remove();
        req.flash('success', "Campground deleted!");
        res.redirect("/campgrounds");
        }
    });
});


module.exports = router;