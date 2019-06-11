const   express = require("express"),
        campground = require("../models/campground"),
        router = express.Router();

    
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

//create route (adds new campground to db)
router.post('/', isLoggedIn, (req,res) => {
    //retrieve form data and add into array
    //redirect to the original /campgrounds route
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.description;
    let newCampground = {name, image,description: desc};
    // create new campground based off input and save to db
        
    campground.create(
        newCampground,
        (err,campground) => {
            if (err){
                console.log("ERROR HAS OCCURRED");
                console.log(err);
            }
            else{
                //debugging info and redirecting to campgrounds list
                console.log("newly created campground!");
                console.log(campground);
                res.redirect('/campgrounds');
            }
        });
});

//new route, shows form to create campground
router.get('/new', isLoggedIn, (req,res) => {
    //shows form to send data to post route
    res.render("campgrounds/new");
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
            console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});
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