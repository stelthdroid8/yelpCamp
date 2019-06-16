const   express = require("express"),
        passport = require("passport"),
        User = require("../models/user"),
        middleware = require("../middleware/index"),
        router = express.Router();

//root route

router.get('/', (req,res) => {
    res.render("landing");
});


//=======================
//  Auth Routes
//=======================

//Register form route
router.get("/register", (req,res) =>{
    res.render("register");
});

//Signup logic route
router.post("/register", (req,res) =>{
    let newUser = new User({username: req.body.username});

    User.register(newUser,req.body.password, (err, user) => {
        if(err){
            req.flash("error", err.message)
            // return res.render('register');
            res.redirect("back");
        }
        else{
            passport.authenticate("local")(req,res, () => {
                req.flash("success", "Welcome to YelpCamp " + user.username);
                res.redirect('/campgrounds');
            })
        }
    });
});

//show login form

router.get("/login", (req,res) => {
    res.render("login");
});

//handles login logic
router.post('/login', passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), (req,res) =>{
});

//logout route
router.get('/logout', middleware.isLoggedIn, (req,res) => {
    req.logOut();
    req.flash("success", "Logged you out!")
    res.redirect('/campgrounds');
});



module.exports = router;