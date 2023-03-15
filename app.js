const express = require('express');
const parser = require('body-parser');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');

// Path to static files (javascript or css)
app.use('/public', express.static(path.join(__dirname, 'public')));
// To parse url encoded response from post request
app.use(parser.urlencoded({extended: true}));


var options = { weekday: 'long', month: 'long', day: 'numeric' };
var today  = new Date();

let currentDay = today.toLocaleDateString("en-US", options); // Saturday, September 17

let items = [];

app.get("/", (req, res) => {
    res.render('list', {dayName: currentDay, items: items});
});

app.post("/", (req, res) => {
    item = req.body.item;
    items.push(item);
    res.redirect("/");
});

const PORT = process.env.PORT || 5400;
app.listen(PORT, () => {
    console.log("Server Running on port: " + PORT);
});
