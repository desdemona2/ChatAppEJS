const express = require('express');
const parser = require('body-parser');

const app = express();
// Path to static files (javascript or css)
app.use(express.static(__dirname + "/public"));
// To parse url encoded response from post request
app.use(parser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post("/", (req, res) => {
    const input = req.body.input;
    console.log(input)
});

const PORT = process.env.PORT || 5400;
app.listen(PORT, () => {
    console.log("Server Running on port: " + PORT);
});
