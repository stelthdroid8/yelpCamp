const express = require("express");
app = express();

app.set("view engine", "ejs");

app.listen(8000, process.env.IP, () => {
    console.log("yelpcamp server v1 has started");
});

app.get('/', (req,res) => {
    // res.send("landing page");
    res.render("landing");
});

app.get('/campgrounds', (req,res) => {
    let campgrounds = [
        {name: "Salmon Creek", image: "https://farm1.staticflickr.com/130/321487195_ff34bde2f5.jpg"},
        {name: "Granite Hill", image: "https://farm9.staticflickr.com/8167/7121865553_e1c6a31f07.jpg"},
        {name: "Mountain Goat Rest", image: "https://farm3.staticflickr.com/2116/2164766085_0229ac3f08.jpg"}
    ];

    res.render("campgrounds", {campgrounds});


});

