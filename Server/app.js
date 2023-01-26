const express = require("express");
const cors = require("cors");
/// gets product data from product
const productData = require('./product');

let app = express();
app.set('json spaces', 3);

// setup cors middleware
app.use(cors());

app.use(function(req, res, next) {
    // log incoming requests to console
    console.log("Incoming request: " + req.url);
    next();
});

app.get("/", function(req, res) {
    res.send("Welcome to my website!");
});

/// {/user} route endpoint to get user details
app.get("/user", function(req, res) {

   res.json({
      "email": "user@email.com",
      "password": "password"
   });
})

/// {/product} route to get list of product
app.get("/product", function(req, res) {
    res.json(productData.product);
});

/// handles invalid request
app.use(function(req, res) {
    res.status(404).send("Resource not found...");
});

/// listening on port 3000
app.listen(3000, function() {
    console.log("App started on port 3000");
});