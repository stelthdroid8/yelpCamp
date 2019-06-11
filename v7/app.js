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

    const   commentRoutes = require("./routes/comments"),
            campgroundRoutes = require("./routes/campgrounds"),
            indexRoutes = require("./routes/index");


mongoose.connect("mongodb://localhost:27017/yelp_camp_v7", { useNewUrlParser: true });


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

app.use(function (req,res, next){
    res.locals.currentUser = req.user;
    next();
});

app.use(indexRoutes);
app.use(commentRoutes);
app.use(campgroundRoutes);

app.listen(8000, process.env.IP, () => {
    console.log("yelpcamp server v7 has started");
});


