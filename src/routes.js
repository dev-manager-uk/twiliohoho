'use strict';
const dialController = require('./dialController');
const clickController = require('./clickController');

module.exports.generateRoutes = function (app) {
  app.get('/Dial', dialController.formatPhoneNumberGET);
  app.post('/Dial', dialController.formatPhoneNumberPOST);

  app.post('/Click', clickController.formatPhoneNumberPerUserPOST);  
  app.post('/Click-Client', clickController.clickClient);
  app.post('/Click-Dial', clickController.outboundCallPOST);
  app.get('/Click-Dial', clickController.outboundCallGET);

  app.get('/Call-List', clickController.callList);
  app.get('/Conference-List', clickController.conferenceList);

  app.post("/Create-Conference", clickController.createConference);
  app.post("/Join-Conference", clickController.joinConference);

  app.post("/Drop-Call", clickController.dropCall);
  app.post("/Join-Client-Conference", clickController.joinClientConference);
  app.post("/Create-Call-Join-Conference", clickController.createCallAndJoinConference);  

  app.get("/Get-Users", clickController.getUsers);

  app.use('/*', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
  });
}