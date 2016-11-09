#!/usr/bin/env node
'use strict';

var fs = require('fs');
var path = require('path');
var petsPath = path.join(__dirname, 'pets.json');

var node = path.basename(process.argv[0]);
var file = path.basename(process.argv[1]);
var cmd = process.argv[2];
var entry = process.argv[3];

if (cmd === 'read') {
  fs.readFile(petsPath, 'utf8', function(err, data) {
    if (err) {
      throw (err);
    }
    var pets = JSON.parse(data);
    if (entry) {
      if (pets[entry]) {
        console.log(pets[entry]);
      } else {
        console.error(`Usage: ${node} ${file} INDEX`);
        process.exit(1);
      }
    } else {
      // If there is no index, log the entire pets array
      console.log(pets);
    }
  });
} else if (cmd === 'create') {
  fs.readFile(petsPath, 'utf8', function(err, data) {
    if (err) {
      throw (err);
    }

    var pets = JSON.parse(data);
    var petAge = Number(process.argv[3]);
    var petKind = process.argv[4];
    var petName = process.argv[5];

    if (!petAge || !petKind || !petName) {
      console.error(`Usage: ${node} ${file} ${cmd} AGE KIND NAME`);
      process.exit(1);
    }

    var newPet = {age: petAge, kind: petKind, name: petName};
    pets.push(newPet);

    var petsJSON = JSON.stringify(pets);


    fs.writeFile(petsPath, petsJSON, function(writeErr) {
      if (writeErr) {
        throw writeErr;
      }
      console.log(newPet);
    });

  });
} else if (cmd === 'update') {
  fs.readFile(petsPath, 'utf8', function(err, data) {
    if (err) {
      throw err;
    }

    var pets = JSON.parse(data);
    var petAge = Number(process.argv[4]);
    var petKind = process.argv[5];
    var petName = process.argv[6];
    if (!entry || !petAge || !petKind || !petName) {
      console.error(`Usage: ${node} ${file} ${cmd} INDEX AGE KIND NAME`);
      process.exit(1);
    }

    pets[entry].age = petAge;
    pets[entry].kind = petKind;
    pets[entry].name = petName;

    var petsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, petsJSON, function(writeErr) {
      if (writeErr) {
        throw writeErr;
      }
      console.log(pets[entry]);
    })
  });
} else if (cmd === 'destroy') {
  fs.readFile(petsPath, 'utf8', function(err, data) {
    if (err) {
      throw err;
    }

    var pets = JSON.parse(data);

    if (pets[entry]) {
      console.log(pets[entry]);
      pets.splice(entry, 1);
      var petsJSON = JSON.stringify(pets);
      fs.writeFile(petsPath, petsJSON, function(writeErr) {
        if (writeErr) {
          throw writeErr;
        }
      });
    } else {
      console.error(`Usage: ${node} ${file} ${cmd} INDEX`);
      process.exit(1);
    }
  });
} else {
  console.error(`Usage: ${node} ${file} ${cmd} [read | create | update | destroy]`);
  process.exit(1);
}
