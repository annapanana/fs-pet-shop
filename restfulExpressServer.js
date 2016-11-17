'use strict';

var express = require('express');
var app = express();

app.set('port', process.env.PORT || 8000);

var morgan = require('morgan');
app.use(morgan('short'));

var bodyParser = require('body-parser');
app.use(bodyParser.json());

var fs = require('fs');
var path = require('path');
var petsPath = path.join(__dirname, 'pets.json');

// everything in this folder is a static file and we want to gain access
app.use(express.static('public'));

// let's skip to the next middleware
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods","GET,POST,PATCH,PUT,DELETE");
  next();
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
      console.log(pets, typeof pets);
      res.send(pets);

    });
  } else {
    console.log("request UR");
    return res.sendStatus(404);
  }
});

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

app.get('/', function (req, res) {
  return res.sendStatus(404);
});

app.post('/pets', function(req, res) {

  console.log(req.body);
  
  fs.readFile(petsPath, 'utf8', function(err, petsJSON) {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }
    var pets = JSON.parse(petsJSON);
    if (req.body.name && req.body.age && req.body.kind) {
      if (isNaN(req.body.age)) {
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

app.put('/pets/:index', function(req, res) {
  // use the body params to update property of index val
  fs.readFile(petsPath, 'utf8', function(err, parseJSON) {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }

    var pets = JSON.parse(parseJSON);
    var index = req.params.index;

    if (index < 0 || index > pets.length || Number.isNaN(index)) {
      console.log("index is not valid");
      return res.sendStatus(400);
    }

    if (req.body.name && req.body.age && req.body.kind) {
      if (isNaN(req.body.age)) {
        console.log("age must be a number");
        return res.sendStatus(400);
      }
      var newPet = {name: req.body.name, age: req.body.age, kind: req.body.kind};
      pets[index] = newPet;
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

app.patch('/pets/:index', function (req, res) {
  fs.readFile(petsPath, 'utf8', function(err, parseJSON) {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }

    var pets = JSON.parse(parseJSON);
    var index = req.params.index;

    if (index < 0 || index > pets.length || Number.isNaN(index)) {
      console.log("index is not valid");
      return res.sendStatus(400);
    }

    if (req.body.name) {
      pets[index].name = req.body.name;
    }
    if (req.body.age) {
      // ParseInt and isNaN don't mix?
      if (isNaN(req.body.age)) {
        console.log("age must be a number");
        return res.sendStatus(400);
      }
      pets[index].age = req.body.age;
    }
    if (req.body.kind) {
      pets[index].kind = req.body.kind;
    }

    fs.writeFile(petsPath, JSON.stringify(pets), function(writeErr) {
      if (writeErr) {
        throw writeErr;
      }
    });
    res.set('Content-Type', 'application/json');
    res.send(pets[index]);
  });
});

app.delete('/pets/:index', function (req, res) {
  fs.readFile(petsPath, 'utf8', function(err, parseJSON) {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }

    var pets = JSON.parse(parseJSON);
    var index = req.params.index;
    var deletedPet = pets[index];

    // Is index valid
    pets.splice(index, 1);
    fs.writeFile(petsPath, JSON.stringify(pets), function(writeErr) {
      if (writeErr) {
        throw writeErr;
      }
    });
    res.set('Content-Type', 'application/json');
    res.send(deletedPet);
  });
});

app.listen(app.get('port'), function() {
  console.log('Listening on', app.get('port'));
});

module.exports = app;
