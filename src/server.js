'use strict';
const config = require('./config');
const express = require('express');
const bodyParser = require('body-parser');
var path = require('path');
const routes = require('./routes');

let app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

var XMLWriter = require('xml-writer'),
               fs = require('fs');
    var ws = fs.createWriteStream('./src/assets/users.xml');
    ws.on('close', function() {
            console.log(fs.readFileSync('./src/assets/users.xml', 'UTF-8'));
    });
    let xw = new XMLWriter(false, function(string, encoding) {
            ws.write(string, encoding);
    });
    xw.startDocument('1.0', 'UTF-8').startElement(function() {
        return 'root';
    }).text(function() {
        return 'Some content';
    });
    ws.end();

//Create routes
routes.generateRoutes(app);

var server = app.listen(config.port || 3000, function () {
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});