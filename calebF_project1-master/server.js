const logger = require("morgan");
const bcrypt = require("bcrypt");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");

const MONGO_URL = "mongodb://localhost/mean";
const MONGO_USERNAME = "matchMaker";
const MONGO_PASSWORD = "p@ssw0rd";

mongoose.connect(MONGO_URL, {
    auth: {
        user: MONGO_USERNAME,
        password: MONGO_PASSWORD
    },
    useNewUrlParser: true
});
mongoose.set("useCreateIndex", true);
let meanSchema = require("./mean_schema.js").meanSchema;
//hashing a password before saving it to the database
meanSchema.pre('save', function (next) {
    bcrypt.hash(newUser.password, 10, function (err, hash){
        if (err) {
            return next(err);
        }
        newUser.password = hash;
        next();
    })
});
const User = mongoose.model("User", meanSchema);
let newUser = new User();

mongoose.connection.once("open", function () {
    console.log("Open connection!");
});

var app = express();
// Logging
app.use("/", logger("dev"));
// Static files
app.use("/css", express.static("css"));
app.use("/html", express.static("html"));
app.use("/images", express.static("images"));
app.use("/js", express.static("js"));
// Body parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
//use sessions for tracking logins
app.use(session({
    secret: "it is a secret to everybody",
    resave: true,
    saveUninitialized: false
}));

// Sending those who type "localhost" to
// "localhost/static/html/register.html"
app.get("/", function (req, res) {
    res.redirect("/html/index.html");
});

// User is registering
app.post("/index", function (req, res) {
    console.log("Saving Registration Information");
    console.log(req.body);
    newUser.userName = req.body.username;
    newUser.password = req.body.password;
    console.log(newUser);

    newUser.save({},function (err, doc) {
        if (err) {
            console.log(err);
            res.writeHead(500);
            res.end(JSON.stringify(err));
        } else {
            console.log("\nSaved document: " + doc);
            res.writeHead(200);
            res.end(JSON.stringify(doc));
        }
    });
});

// User is logging in
app.post("/index/login", function (req, res) {
    console.log("Checking Login Credentials");
    console.log(req.body);
    User.findOne({ userName: req.body.username })
        .exec(function (err, user) {
            if (err) {
                console.log(err);
                res.writeHead(500);
                res.end(JSON.stringify(err));
            } else if (!user) {
                var err = new Error("User not found.");
                console.log(err);
                res.writeHead(400);
                res.end(JSON.stringify(err));
            }
            console.log(user);
            bcrypt.compare(req.body.password, user.password, function (err, result) {
                if (result === true) {
                    console.log("Authentication successful!");
                    // Saving _id from MongoDB to Session
                    req.session.userId = user._id;
                    res.writeHead(200);
                    res.end(JSON.stringify(result));
                } else {
                    var err = new Error("Invalid credentials!");
                    console.log(err);
                    res.writeHead(401);
                    res.end(JSON.stringify(err));
                }
            })
        });
});

// Get User Info from Session
app.post("/personalProfile/update", function (req, res) {
    console.log("Getting _id from the session.");
    console.log(req.session.userId);

    if (req.session.userId) {
        User.update({ _id: req.session.userId }, {$set: {firstName: req.body.firstName, lastName: req.body.lastName, interest: req.body.interest, state: req.body.state, profileImage: req.body.file}})
            .exec(function (err, user) {
                if (err) {
                    console.log(err);
                    res.writeHead(400);
                    res.end(JSON.stringify(err));
                } else if (!user) {
                    var err = new Error("User not found.");
                    console.log(err);
                    res.writeHead(400);
                    res.end(JSON.stringify(err));
                } else {
                    console.log(user);
                    res.writeHead(200);
                    res.end(JSON.stringify(user));
                }
            });
    } else {
        var err = new Error("You must be logged in to view this page.");
        console.log(err);
        res.writeHead(401);
        res.end(JSON.stringify({message:"You must be logged in to view this page."}));
    }
});
// Get User Info and perform search on database
app.post("/personalProfile/search", function (req, res) {
    console.log("Getting _id from the session.");
    console.log(req.session.userId);
    console.log(req.session.formValue);

    if (req.session.userId) {
        if (req.body.radioPass === "location"){
            User.find({state: req.body.state})
                .exec(function (err, user) {
                    if (err) {
                        console.log(err);
                        res.writeHead(400);
                        res.end(JSON.stringify(err));
                    } else if (!user) {
                        var err = new Error("User not found.");
                        console.log(err);
                        res.writeHead(400);
                        res.end(JSON.stringify(err));
                    } else {
                        console.log(user);
                        res.writeHead(200);
                        res.end(JSON.stringify(user));
                    }
                });
        } else if (req.body.radioPass === "interest") {
            User.find({interest: req.body.interestSearch})
                .exec(function (err, user) {
                    if (err) {
                        console.log(err);
                        res.writeHead(400);
                        res.end(JSON.stringify(err));
                    } else if (!user) {
                        var err = new Error("User not found.");
                        console.log(err);
                        res.writeHead(400);
                        res.end(JSON.stringify(err));
                    } else {
                        console.log(user);
                        res.writeHead(200);
                        res.end(JSON.stringify(user));
                    }
                });
        }
    } else {
        var err = new Error("You must be logged in to view this page.");
        console.log(err);
        res.writeHead(401);
        res.end(JSON.stringify({message:"You must be logged in to view this page."}));
    }
});
// User is logging out
app.get("/logout", function(req, res, next) {
    if (req.session) {
        console.log("Deleting the session");
        req.session.destroy(function(err) {
            if(err) {
                return next(err);
            } else {
                return res.redirect("/");
            }
        });
    }
});

// Listening to port 80
app.listen(80);