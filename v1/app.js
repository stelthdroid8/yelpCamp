import express from "express";
app = express();
import { urlencoded } from "body-parser";
import mongoose from "mongoose";


app.use(urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.listen(8000, process.env.IP, () => {
    console.log("yelpcamp server v1 has started");
});

app.get('/', (req,res) => {
    res.render("landing");
});

let campgrounds = [
    {name: "Salmon Creek", image: "https://farm1.staticflickr.com/130/321487195_ff34bde2f5.jpg"},
    {name: "Granite Hill", image: "https://farm9.staticflickr.com/8167/7121865553_e1c6a31f07.jpg"},
    {name: "Mountain Goat Rest", image: "https://farm3.staticflickr.com/2116/2164766085_0229ac3f08.jpg"},
    {name: "Salmon Creek", image: "https://farm1.staticflickr.com/130/321487195_ff34bde2f5.jpg"},
    {name: "Granite Hill", image: "https://farm9.staticflickr.com/8167/7121865553_e1c6a31f07.jpg"},
    {name: "Mountain Goat Rest", image: "https://farm3.staticflickr.com/2116/2164766085_0229ac3f08.jpg"}
];

app.get('/campgrounds', (req,res) => {
    res.render("campgrounds", {campgrounds});
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
    let newCampground = {name, image};
    campgrounds.push(newCampground);
    res.redirect('/campgrounds');
});

