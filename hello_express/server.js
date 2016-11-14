'use strict';

var express = require('express');
var app = express();
var port = process.evn.PORT || 8000;

app.use(function(req, res) {
  res.send('Hello World');
});

app.listen(port, function() {
  console.log('Listening on port', port);
});
