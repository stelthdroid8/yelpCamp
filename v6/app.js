const express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    campground = require("./models/campground"),
    comment = require("./models/comment"),
    seedDB = require("./seeds"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    app = express();

mongoose.connect("mongodb://localhost:27017/yelp_camp_v6", { useNewUrlParser: true });


app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

seedDB();

//passport config
app.use(require("express-session")({
    secret: "Classic WoW will revive the dying WoW meta",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

app.listen(8000, process.env.IP, () => {
    console.log("yelpcamp server v6 has started");
});

app.use(function (req,res, next){
    res.locals.currentUser = req.user;
    next();
});

app.get('/', (req,res) => {
    res.render("landing");
});


// let campgrounds = [
//     {name: "Salmon Creek", image: "https://farm1.staticflickr.com/130/321487195_ff34bde2f5.jpg"},
//     {name: "Granite Hill", image: "https://farm9.staticflickr.com/8167/7121865553_e1c6a31f07.jpg"},
//     {name: "Mountain Goat Rest", image: "https://farm3.staticflickr.com/2116/2164766085_0229ac3f08.jpg"},
//     {name: "Salmon Creek", image: "https://farm1.staticflickr.com/130/321487195_ff34bde2f5.jpg"},
//     {name: "Granite Hill", image: "https://farm9.staticflickr.com/8167/7121865553_e1c6a31f07.jpg"},
//     {name: "Mountain Goat Rest", image: "https://farm3.staticflickr.com/2116/2164766085_0229ac3f08.jpg"}
// ];

app.get('/campgrounds', (req,res) => {
    //get all campgrounds from db then render
    campground.find({}, (err,allCampgrounds) => {
        if (err){
            console.log("ERROR");
            console.log(err);        }
    
        else {
            
            res.render("campgrounds/index", {campgrounds:allCampgrounds, currentUser: req.user});
        }
    })
});

app.get('/campgrounds/new', isLoggedIn, (req,res) => {
    //shows form to send data to post route
    res.render("campgrounds/new");
});

app.post('/campgrounds', isLoggedIn, (req,res) => {
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

app.get('/campgrounds/:id', (req,res) => {    
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

// ========================
// Comments Routes
// ========================

app.get('/campgrounds/:id/comments/new', isLoggedIn, (req,res) => {
    campground.findById(req.params.id, (err,campground) => {
        if (err){
            console.log(err);
        }
        else{
            res.render("./comments/new", {campground});
        }
    });
});

app.post('/campgrounds/:id/comments', isLoggedIn, (req,res) => {
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

//=======================
//  Auth Routes
//=======================
app.get("/register", (req,res) =>{
    res.render("register");
});

//Signup logic
app.post("/register", (req,res) =>{
    let newUser = new User({username: req.body.username});

    User.register(newUser,req.body.password, (err, user) => {
        if(err){
            console.log(err);
            return res.render('register');
        }
        else{
            passport.authenticate("loacl")(req,res, () => {
                res.redirect('/campgrounds');
            })
        }
    });
});

//show login form

app.get("/login", (req,res) => {
    res.render("login");
});

app.post('/login', passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), (req,res) =>{
});

app.get('/logout', isLoggedIn, (req,res) => {
    req.logOut();
    res.redirect('/campgrounds');
});

//is logged in validation (middleware)
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}