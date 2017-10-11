'use strict';
const config = require('./config');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes');
const multer = require('multer');
const upload = multer();

let app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(upload.array()); // for parsing multipart/form-data
//Create routes
routes.generateRoutes(app);

var server = app.listen(config.port || 3000, function () {
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});