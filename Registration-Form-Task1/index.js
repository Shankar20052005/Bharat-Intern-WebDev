var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect('mongodb://localhost:27017/Database');

var db = mongoose.connection;
db.on('error', () => console.log("Error in Connecting to Database"));
db.once('open', () => console.log("Connected to Database"));

var userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

var User = mongoose.model('User', userSchema);

app.post("/sign_up", async (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;

    var newUser = new User({
        name: name,
        email: email,
        password: password
    });

    try {
        await newUser.save();
        console.log("Record Inserted Successfully");
        return res.redirect('successfulpg.html');
    } catch (err) {
        console.error("Error in inserting record:", err);
        return res.status(500).send("Error in inserting record");
    }
});

app.get("/", (req, res) => {
    res.set({
        "Allow-access-Allow-Origin": '*'
    });
    return res.redirect('index.html');
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});
