const express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    seedDB = require("./seeds"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    flash = require("connect-flash"),
    app = express();

const   commentRoutes = require("./routes/comments"),
        campgroundRoutes = require("./routes/campgrounds"),
        indexRoutes = require("./routes/index");


mongoose.connect("mongodb://localhost:27017/yelp_camp_v11", { useNewUrlParser: true });


app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());


// seedDB(); //seeding db

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
//end passport config


//configs currentUser for session
app.use(function (req,res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//requires routes
app.use(indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds", campgroundRoutes);


app.listen(8000, process.env.IP, () => {
    console.log("yelpcamp server v12 has started");
});


