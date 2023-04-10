
const express = require('express');
const parser = require('body-parser');
const path = require('path');
const _ = require('lodash')

const date = require(path.join(__dirname, 'functions', 'date'));
const insert = require(path.join(__dirname, 'functions', 'dbOperations'))

// import mongoose for saving data
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Connect to mongodb server
mongoose.connect('mongodb://127.0.0.1:27017/to_do')


const item_schema = new Schema({
    title: {
        type: String,
        minlength: 1,
        maxlength: 100
    }
})

const list_schema = new Schema({
    name: {
        type: String,
        minlength: 3,
        maxlength: 15
    },
    items: {
        type: [item_schema],
        validate: [
            function sizeCheck(val) {
                return val.length <= 20;
            },
            "You already have 20 items pending! You should complete those before adding new items"
        ]
    }
})

// create model for schema
const item = mongoose.model("Item", item_schema);

// create model for list_schema
const lists = mongoose.model("List", list_schema);

const app = express();

app.set('view engine', 'ejs');

// Path to static files (javascript or css)
app.use('/public', express.static(path.join(__dirname, 'public')));
// To parse url encoded response from post request
app.use(parser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    item.find({}, 'title _id').then(async function(docs) {
        if (docs.length === 0) {
            const addDefault = require(path.join(__dirname, 'functions', 'dbOperations'));
            await addDefault.addItems(item);
            res.redirect("/");
        } else {
            res.render('list', {
                PageTitle:"Todo",
                title: date.currentDay(), 
                items: docs,
                postPath: "/"
            });
        }
    }).catch (err => {
        console.log("Some error occured! " + err)
    })
});

app.post("/", async function (req, res) {
    // extract inserted string
    let list_item = req.body.item;

    new item({
        title: list_item
    }).save().then(() => {
        console.log("Document saved successfully")
        res.redirect("/");
    }).catch(err => {
        if (err.name === "ValidationError") {
            console.log(err.code)
            const error = Object.values(err.errors).map((val) => val.message)
            return res.status(400).json({title: err.name, message: error})
        }
        res.status(500).send("Internal Server Error")
    })
});

app.post("/delete", async function (req, res) {
    const id = req.body.checkbox;

    item.deleteOne({_id: id}).then(doc => {
        if (doc.deletedCount === 1) {
            console.log("Item Deleted Successfully!");
        }
        res.redirect("/");
    }).catch(err => {
        console.log("Some error occured! " + err.name);
        res.send(`<h1>${err.name}<h1>`);
    })
})

app.get("/about", (req, res) => {
    res.render("about", {PageTitle: "About"});
});

app.get("/:list_name", (req, res) => {
    // to make list name with only 1st character capitalized
    const list_name = _.capitalize(req.params.list_name);

    lists.findOne({name: list_name}).then(async function (result) {
        if (result && result.length !== 0) {
            output_list = result.items;
        } else {
            const allowedLists = 10;
            if (await lists.countDocuments() < allowedLists ) {
                const item1 = new item({title: "Welcome to To-do List"});
                const item2 = new item({title: "Add items by pressing +"});
                const item3 = new item({title: "<-- Press to mark as done"});

                const defaultList = [item1, item2, item3];

                new lists({
                    name: list_name,
                    items: defaultList
                }).save();
                output_list = defaultList;
            } else {
                res.status(400)
                return res.send(
                    `<h1>${allowedLists} lists are already created! More lists can't be created<\h1>`
                );
            }
        }
        res.render('list', {
            PageTitle: `Todo - ${list_name}`,
            title: date.currentDay(), 
            items: output_list,
            postPath: `/${list_name}`
        });
    }).catch(err => {
        console.log('Some Error occured! ' + err.name);
        res.status(400).send(`Error: ${err.name}`);
    })
});

app.post("/:list_name", (req, res) => {
    const list_name = req.params.list_name;
    lists.findOne({name: list_name}).then(async function(doc){
        const items = doc.items;
        await items.push(new item({
            title: req.body.item
        }));
        doc.save().then(result => {
            res.redirect(`/${list_name}`)
        }).catch(err => {
            if (err.name === "ValidationError") {
                for (field in err.errors) {
                    const msg = err.errors[field].message
                    console.log("Some Error occured: " + msg)
                    res.status(400)
                    return res.send(`<h1>${msg}</h1>`) 
                }
            }
        });

    }).catch(err => {
        console.log("Some error occured while inserting! " + err);
    })
});

app.post("/delete/:list_name", async function (req, res) {
    const list_name = req.params.list_name;
    const id = req.body.checkbox;

    const doc = await lists.findOneAndUpdate(
        {name: list_name}, 
        {$pull: {items: {_id: id}}}
    ).then(async function(result) {
        await result.save();
        res.redirect(`/${list_name}`);
    }).catch(err => {
        console.log("Some error occured while deleting document! " + err);
    })
});

const PORT = process.env.PORT || 5400;

app.listen(PORT, () => {
    console.log("Server Running on port: " + PORT);
});
