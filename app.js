const express = require('express');
const parser = require('body-parser');
const path = require('path');
const date = require(path.join(__dirname, 'functions', 'date'));

const app = express();

app.set('view engine', 'ejs');

// Path to static files (javascript or css)
app.use('/public', express.static(path.join(__dirname, 'public')));
// To parse url encoded response from post request
app.use(parser.urlencoded({extended: true}));

let items = [];

app.get("/", (req, res) => {
    res.render('list', {PageTitle:"Todo", title: date.currentDay(), items: items, postPath: "/"});
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


app.get("/about", (req, res) => {
    res.render("about", {PageTitle: "About"});
});

const PORT = process.env.PORT || 5400;

app.listen(PORT, () => {
    console.log("Server Running on port: " + PORT);
});
