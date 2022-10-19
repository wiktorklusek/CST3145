const express = require('express');
const req = require('express/lib/request');
//const http = require('http');



// Calls the express function to start a new Express application
const app = express();

app.use(function(request, response, next){ // middleware
    console.log("In comes a request to: " + request.url);
    // response.end("Hello, victor!");
    next();
});

var path = require('path');
var fs = require('fs');

app.use(function(req, res, next) {
    var filePath = path.join(__dirname, "static", req.url);

    fs.stat(filePath, function(err, fileInfo) {
        if(err) {
            next();
            return;
        }
        if (fileInfo.isFile()) res.sendFile(filePath);
        else next();
    });
});

app.use(function(req, res) {
    res.status(404);

    res.send("File not found!")
})

// app.use(function(request, response, next) {
//     var minute = (new Date()).getMinutes();
//     if ((minute % 2) === 0) { 
//         next();
//     } else {
//         response.statusCode = 403;
//         response.end("Not authorized.")
//     }
// });

// app.use(function(request, response) {
//     response.end('Secret info: the password is "swordish"!');
// });

// http.createServer(app).listen(3000); // start the server

app.listen(3000, function() {
    console.log("Express server started.");
});