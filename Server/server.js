const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

let propertiesReader = require("properties-reader");
let propertiesPath = path.resolve(__dirname, "conf/db.properties");
let properties = propertiesReader(propertiesPath);

let dbPprefix = properties.get("db.prefix");
//URL-Encoding of User and PWD
//for potential special characters
let dbUsername = encodeURIComponent(properties.get("db.user"));
let dbPwd = encodeURIComponent(properties.get("db.pwd"));
let dbName = properties.get("db.dbName");
let dbUrl = properties.get("db.dbUrl");
let dbParams = properties.get("db.params");
const uri = dbPprefix + dbUsername + ":" + dbPwd + dbUrl + dbParams;

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });
let db = client.db(dbName);


const app = express();

app.set('json spaces', 3);

// setup cors middleware
app.use(cors());

// acts like a parameter !!! 
app.param('collectionName', function(req, res, next, collectionName) {
    req.collection = db.collection(collectionName);
    return next();
});

app.get('/', function(req, res, next) {
    res.send('Select a collection, e.g., /collections/products')
});

app.get('/collections/:collectionName', function(req, res, next) {
    req.collection.find({}).toArray(function(err, results) {
        if (err) {
            return next(err);
        }
        res.send(results);
    });
});

app.get('/collections/:collectionName', function(req, res, next) {
    req.collection.find({}, {
        limit: 3,
        sort: [
            ["price", -1]
        ]
    }).toArray(function(err, results) {
        if (err) {
            return next(err);
        }
        res.send(results);
    });
});

app.get('/collections/:collectionName/:max/:sortAspect/:sortAscDesc', function(req, res, next) {
    // TODO: Validate params
    var max = parseInt(req.params.max, 10); // base 10
    let sortDirection = 1;
    if (req.params.sortAscDesc === "desc") {
        sortDirection = -1;
    }
    req.collection.find({}, {
        limit: max,
        sort: [
            [req.params.sortAspect,
                sortDirection
            ]
        ]
    }).toArray(function(err, results) {
        if (err) {
            return next(err);
        }
        res.send(results);
    });
});

//we do not need the following line because we already load ObjectId
//with the connection to the db
//const ObjectId = require('mongodb').ObjectId;
app.get('/collections/:collectionName/:id', function(req, res, next) {
    //var id = parseInt(req.params.id, 10);
    req.collection.findOne({
        _id: new ObjectId(req.params.id)
    }, function(err, results) {
        if (err) {
            return next(err);
        }
        res.send(results);
    });
});

// app.post('/collections/:collectionName', function(req, res, next) {
//     // TODO: Validate req.body
//     req.collection.insertOne(req.body, function(err, results) {
//         if (err) {
//             return next(err);
//         }
//         res.send(results);
//     });
// });

//const express = require('express');
const { check, validationResult } = require('express-validator');

//const app = express();
app.use(express.json());

app.post('/collections/:collectionName', [
  check('id').isInt().withMessage('ID must be an integer'),
  check('subject').isString().withMessage('Subject must be a string'),
  check('location').isString().withMessage('Location must be a string'),
  check('description').isString().withMessage('Description must be a string'),
  check('price').isFloat().withMessage('Price must be a floating point number'),
  check('image').isString().withMessage('Image must be a string'),
  check('numberOfSpaces').isInt().withMessage('Number of spaces must be an integer'),
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  req.collection.insertOne(req.body, function(err, results) {
    if (err) {
      return next(err);
    }
    res.status(201).json(results);
  });
});

app.delete('/collections/:collectionName/:id', function(req, res, next) {
    req.collection.deleteOne({
        _id: new ObjectId(req.params.id)
    }, function(err, result) {
        if (err) {
            return next(err);
        } else {
            res.send((result.deletedCount === 1) ? {
                msg: "success"
            } : {
                msg: "error"
            });
        }
    });
});

app.put('/collections/:collectionName/:id', function(req, res, next) {
    // TODO: Validate req.body
    req.collection.updateOne({
        _id: new ObjectId(req.params.id)
    }, {
        $set: req.body
    }, {
        safe: true,
        multi: false
    }, function(err, result) {
        if (err) {
            return next(err);
        } else {
            res.send((result.matchedCount === 1) ? {
                msg: "success"
            } : {
                msg: "error"
            });
        }
    });
});

/// handles invalid request
app.use(function(req, res) {
    res.status(404).send("Resource not found...");
});

/// listening on port 3000
app.listen(3000, function() {
    console.log("App started on port 3000");
});