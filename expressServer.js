'use strict';

var express = require("express");
var app = express();
var port = process.env.PORT || 8000;

var fs = require('fs');
var path = require('path');
var petsPath = path.join(__dirname, 'pets.json');

var bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get('/pets/:id', function(req, res) {
  fs.readFile(petsPath, 'utf8', function(err, petsJSON) {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }

    var id = Number.parseInt(req.params.id);
    var pets = JSON.parse(petsJSON);

    if (id < 0 || id > pets.length-1 || Number.isNaN(id)) {
      return res.sendStatus(404);
    }

    res.set('Content-Type', 'application/json');
    res.send(pets[id]);
  });
});

app.get('/:path', function (req, res) {

  if (req.params.path === "pets") {
    fs.readFile(petsPath, 'utf8', function(err, petsJSON) {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      }
      var pets = JSON.parse(petsJSON);

      res.set('Content-Type', 'application/json');
      res.send(pets);

    });
  } else {
    console.log("request UR");
    return res.sendStatus(404);
  }
});

app.get('/', function (req, res) {
  return res.sendStatus(404);
});

app.post('/pets', function(req, res) {
  fs.readFile(petsPath, 'utf8', function(err, petsJSON) {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }
    var pets = JSON.parse(petsJSON);
    if (req.body.name && req.body.age && req.body.kind) {
      if (!Number.isInteger(req.body.age)) {
        console.log("age must be a number");
        return res.sendStatus(400);
      }
      var newPet = {name: req.body.name, age: req.body.age, kind: req.body.kind};
      pets.push(newPet);
      fs.writeFile(petsPath, JSON.stringify(pets), function(writeErr) {
        if (writeErr) {
          throw writeErr;
        }
      });
      res.set('Content-Type', 'application/json');
      res.send(newPet);
    } else {
      console.log("invalid params");
      return res.sendStatus(400);
    }
  });
});

app.listen(port, function() {
  console.log('listening on port ', port);
});

module.exports = app;
