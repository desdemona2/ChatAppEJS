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
    res.render('list', {PageTitle:"Work Todo", title: currentDay, items: items, postPath: "/"});
});

app.post("/", (req, res) => {
    let item = req.body.item;
    items.push(item);
    res.redirect("/");
});


let workItems = [];
app.get("/work", (req, res) => {
    res.render('list', {PageTitle:"Work Todo", title: "Work Items", items: workItems, postPath: "/work"});
});


app.post("/work", (req, res) => {
    let item = req.body.item;
    workItems.push(item);
    res.redirect("/work");
});

const PORT = process.env.PORT || 5400;
app.listen(PORT, () => {
    console.log("Server Running on port: " + PORT);
});
