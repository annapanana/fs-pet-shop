'use strict';

var fs = require('fs');
var path = require('path');
var petsPath = path.join(__dirname, 'pets.json');
var http = require('http');
var port = process.env.PORT || 8000;

var server = http.createServer(function(req, res) {
  // var myArray = myReg.exec(req.url);
  if (req.method === 'GET' && req.url ==='/pets') {
    fs.readFile(petsPath, 'utf8', function(err, petsJSON) {
      if (err) {
        console.error(err);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plane');
        return res.end('Internal Server Error');
      }
      res.setHeader('Content-Type', 'application/json');
      res.end(petsJSON);
    });
  } else if (req.method === 'GET' && req.url === '/pets/0') {
    fs.readFile(petsPath, 'utf8', function(err, petsJSON) {
      if (err) {
        console.error(err);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plane');
        return res.end('Internal Server Error');
      }
      var pets = JSON.parse(petsJSON);
      var firstPet = JSON.stringify(pets[0]);
      res.setHeader('Content-Type', 'application/json');
      res.end(firstPet);
    });
  } else if (req.method === 'GET' && req.url === '/pets/1') {
    fs.readFile(petsPath, 'utf8', function(err, petsJSON) {
      if (err) {
        console.error(err);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plane');
        return res.end('Internal Server Error');
      }
      var pets = JSON.parse(petsJSON);
      var firstPet = JSON.stringify(pets[1]);

      res.setHeader('Content-Type', 'application/json');
      res.end(firstPet);
    });
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not Found');
  }
});

  server.listen(port, function() {
  console.log('Listening on port', port);
});


module.exports = server;
