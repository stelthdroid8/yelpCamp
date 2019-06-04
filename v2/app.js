const express = require("express");
app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });

//Setting up campground Schema
let campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

let campground = mongoose.model("campground", campgroundSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.listen(8000, process.env.IP, () => {
    console.log("yelpcamp server v2 has started");
});

app.get('/', (req,res) => {
    res.render("landing");
});

// campground.create(
//     {
//         name: "Granite Hill",
//         image: "https://farm9.staticflickr.com/8167/7121865553_e1c6a31f07.jpg",
//         description: "This is a huge granite hill, no bathrooms. No water. Just granite."
//     },
//     (err,campground) => {
//         if (err){
//             console.log("ERROR HAS OCCURRED");
//             console.log(err);
//         }
//         else{
//             //debugging info and redirecting to campgrounds list
//             console.log("newly created campground!");
//             console.log(campground);
//             // res.redirect('/campgrounds');
//         }
//     });



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
            console.log("retrieved campground from DB");
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
    let newCampground = {name, image,description};
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
    //find campground with id and .render the page with that id
    campground.findById(req.params.id, (err,foundCampground) => {
        if (err){
            console.log("error");
            console.log(err);
        }
        else{
            res.render("show", {campground: foundCampground});
        }
    }); 
});