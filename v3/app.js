const app = require("express")(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    campground = require("./models/campground"),
    comment = require("./models/comment"),
    seedDB = require("./seeds");



// const bodyParser = require("body-parser");
// const mongoose = require("mongoose");
// const campground = require("./models/campground");

mongoose.connect("mongodb://localhost:27017/yelp_campv3", { useNewUrlParser: true });


app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

seedDB();

app.listen(8000, process.env.IP, () => {
    console.log("yelpcamp server v3 has started");
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
            
            res.render("index", {campgrounds:allCampgrounds});
        }
    })
});

app.get('/campgrounds/new', (req,res) => {
    //shows form to send data to post route
    res.render("new");
});

app.post('/campgrounds', (req,res) => {
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
            res.render("show", {campground: foundCampground});
        }
    }); 
});