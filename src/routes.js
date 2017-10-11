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

  app.post('/Click-Between-Clients', clickController.clickBetweenClients);
  app.post('/Connect-Users', clickController.connectUsers);

  app.get('/Call-List', clickController.callList);
  app.get('/Conference-List', clickController.conferenceList);

  app.post("/Create-Conference", clickController.createConference);
  app.post("/Join-Conference", clickController.joinConference);

  app.post("/Drop-Call", clickController.dropCall);
  app.post("/Join-Client-Conference", clickController.joinClientConference);
  app.post("/Create-Call-Join-Conference", clickController.createCallAndJoinConference);  

  app.get("/Get-Users", clickController.getUsers);

  app.post('/events', function(req, res){
    let to = req.body.to;
    let fromNumber = req.body.from;
    let callStatus = req.body.CallStatus;
    let callSid = req.body.callSid;

    client.calls.create(
      {
        to: to,
        from: config.twilio.callerId,
      },
      function(err, call) {
        if (err) {
          res.status(405).send(o2x({ message: err }));
          return;
        }
        res.status(200).send(o2x({ message: "Thanks for calling!" }));
      }
    );
  });

  app.use('/*', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
  });
}