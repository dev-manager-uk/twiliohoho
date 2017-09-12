"use strict";
const config = require('./config');
const async = require('async');
const o2x = require("object-to-xml");
const twilio = require("twilio");
const VoiceResponse = twilio.twiml.VoiceResponse;
const phoneComponent = require("./phoneComponent");

let databaseInMemory = [];
const colectionStructure = {
  clientConferenceName: "",
  usersConferenceName: "",
  timestamp: ""
}

const USERS = config.users;

const client = twilio(config.twilio.apiKey, config.twilio.apiSecret, {
  accountSid: config.twilio.accountSid
});

function getServer(req) {
  let server = req.protocol + "://" + req.get("host");
  return server;
}

module.exports.formatPhoneNumberPerUserPOST = function (req, res, next) {
  if (
    config.twilio.apiKey === undefined ||
    config.twilio.apiSecret === undefined ||
    config.twilio.accountSid === undefined
  ) {
    return res
      .status(405)
      .send(o2x({ message: "accountSid or authToken invalid" }));
  }

  let called;
  let user;

  if (req.body.called !== undefined) {
    called = req.body.called;
  } else if (req.body.Called !== undefined) {
    called = req.body.Called;
  } else if (req.query.called !== undefined) {
    called = req.query.called;
  } else {
    called = req.query.Called;
  }

  if (req.body.user !== undefined) {
    user = req.body.user;
  } else if (req.body.User !== undefined) {
    user = req.body.User;
  } else if (req.query.user !== undefined) {
    user = req.query.user;
  } else {
    user = req.query.User;
  }

  res.set("Content-Type", "text/xml");

  if (called === undefined || called === "") {
    return res
      .status(405)
      .send(o2x({ message: "There is no called number selected" }));
  }

  if (user === undefined || user === "") {
    return res.status(405).send(o2x({ message: "There is no user selected" }));
  }

  if (called.indexOf("@") > -1) {
    called = called.substring(called.indexOf(":") + 2, called.indexOf("@"));
  }

  if (called.indexOf("%40") > -1) {
    called = called.substring(called.indexOf("%3A") + 2, called.indexOf("%40"));
  }

  phoneComponent.formatPhoneNumber(called, function (err, returnedNumber) {
    if (err) {
      return res
        .status(405)
        .send(o2x({ message: "Error to calculate this number" }));
    }
    let server = getServer(req);
    let fullUrl = server + "/Click-Dial";
    let userCall = "sip:" + user + "@" + config.twilio.sipDomain;

    client.calls.create(
      {
        url: fullUrl + "?number=" + called,
        method: "POST",
        to: userCall,
        from: config.twilio.callerId
      },
      function (err, call) {
        if (err) {
          res.status(405).send(o2x({ message: err }));
          return;
        }
        res.status(200).send(o2x({ message: "Thanks for calling!" }));
      }
    );
  });
};

module.exports.outboundCallPOST = function (req, res, next) {
  let called;

  if (req.body.number !== undefined) {
    called = req.body.number;
  } else if (req.body.Number !== undefined) {
    called = req.body.Number;
  } else if (req.query.number !== undefined) {
    called = req.query.number;
  } else {
    called = req.query.Number;
  }

  if (called === undefined || called === "") {
    return res
      .status(405)
      .send(o2x({ message: "There is no number selected" }));
  }

  if (called.indexOf("@") > -1) {
    called = called.substring(called.indexOf(":") + 2, called.indexOf("@"));
  }

  if (called.indexOf("%40") > -1) {
    called = called.substring(called.indexOf("%3A") + 2, called.indexOf("%40"));
  }

  phoneComponent.formatPhoneNumber(called, function (err, returnedNumber) {
    if (err) {
      return res
        .status(405)
        .send(o2x({ message: "Error to calculate this number" }));
    }
    res.contentType("application/xml");
    const twimlResponse = new VoiceResponse();
    const dial = twimlResponse.dial({ callerId: config.twilio.callerId });
    dial.number({}, returnedNumber);

    // We include a second Dial here. When the original Dial ends because the
    // customer is redirected, the user continues to this Dial and joins their
    // own conference.
    const confDial = twimlResponse.dial({});
    confDial.conference({}, req.body.CallSid + "_Users");
    res.status(200).send(twimlResponse.toString());
  });
};

module.exports.outboundCallGET = function (req, res, next) {
  // res.contentType('application/xml');
  // res.sendFile(__dirname + '/public/resp.xml');
  // return;

  let called;

  if (req.query.number !== undefined) {
    called = req.query.number;
  } else {
    called = req.query.Number;
  }

  if (called === undefined || called === "") {
    return res
      .status(405)
      .send(o2x({ message: "There is no number selected" }));
  }

  if (called.indexOf("@") > -1) {
    called = called.substring(called.indexOf(":") + 2, called.indexOf("@"));
  }

  if (called.indexOf("%40") > -1) {
    called = called.substring(called.indexOf("%3A") + 2, called.indexOf("%40"));
  }

  phoneComponent.formatPhoneNumber(called, function (err, returnedNumber) {
    if (err) {
      return res
        .status(405)
        .send(o2x({ message: "Error to calculate this number" }));
    }
    res.contentType("application/xml");
    res.status(200).send(
      o2x({
        '?xml version="1.0" encoding="utf-8"?': null,
        Response: {
          Dial: {
            "@": {
              callerId: config.twilio.callerId
            },
            "#": {
              Number: returnedNumber
            }
          }
        }
      })
    );
    /*let twimlResponse = new VoiceResponse();
    twimlResponse.say('We are dialling your number.',
      { voice: 'alice' });
    twimlResponse.dial(returnedNumber);
    res.status(200).send(twimlResponse.toString());*/
  });
};

module.exports.clickClient = function (req, res, next) {
  let called;

  if (req.body.called !== undefined) {
    called = req.body.called;
  } else if (req.body.Called !== undefined) {
    called = req.body.Called;
  } else if (req.query.called !== undefined) {
    called = req.query.called;
  } else {
    called = req.query.Called;
  }

  res.set("Content-Type", "text/xml");

  if (called === undefined || called === "") {
    return res
      .status(405)
      .send(o2x({ message: "There is no called number selected" }));
  }

  if (called.indexOf("@") > -1) {
    called = called.substring(called.indexOf(":") + 2, called.indexOf("@"));
  }

  if (called.indexOf("%40") > -1) {
    called = called.substring(called.indexOf("%3A") + 2, called.indexOf("%40"));
  }

  phoneComponent.formatPhoneNumber(called, function (err, returnedNumber) {
    if (err) {
      res.status(405).send(o2x({ message: "Error to calculate this number" }));
      return;
    }
    res.status(200).send(
      o2x({
        '?xml version="1.0" encoding="utf-8"?': null,
        Response: {
          Dial: {
            "@": {
              callerId: config.twilio.callerId
            },
            "#": {
              Number: returnedNumber
            }
          }
        }
      })
    );
  });
};

module.exports.dropCall = function (req, res, next) {
  let callSid = req.body.callSid;
  if (callSid === undefined) {
    return res
      .status(405)
      .send({ message: "There is no callSid" });
  }
  client.calls(callSid)
    .update({
      status: 'completed',
    }, function (err, call) {
      if (err) {
        return res.status(500).send(err);
      }
      res.status(200).send({ "message": "success" });
    })
}

module.exports.callList = function (req, res, next) {
  client.calls.list(
    {
      status: "in-progress"
      // status: "completed"
    },
    function (err, data) {
      if (err) {
        return res.status(500).send(err);
      }
      let arrayOfCalls = [];
      data.forEach(call => {
        let progressCall = {};
        progressCall.from = call.from;
        progressCall.to = call.to;
        progressCall.sid = call.sid;
        progressCall.startTime = call.startTime;
        progressCall.parentCallSid = call.parentCallSid;
        arrayOfCalls.push(progressCall);
      });
      return res.status(200).send(arrayOfCalls);
    }
  );
};

function getCall(callSid, cb) {
  client
    .calls(callSid)
    .fetch()
    .then(call => {
      let callData = {};
      callData.to = call.to;
      callData.from = call.from;
      return cb(null, callData);
    });
}

function getParticipants(progressConference, cb) {
  let conf = client.conferences(progressConference.sid);
  conf.participants.list({}, function (err, data) {
    async.each(data, function (participant, next) {
      getCall(participant.callSid, function (err, result) {
        let part = {
          "callSid": participant.callSid,
          "to": result.to
        };
        let noOfParticipants = progressConference.participants.length;
        USERS.forEach(function(user){
          if(user.number === result.to){
            part.toUserText = user.user;
            progressConference.participants.push(part);
          }
        });
        if(noOfParticipants === progressConference.participants.length){
          progressConference.participants.push(part);
        }
        next();
      });
    }, function (err) {
      return cb(null, progressConference);
    });
  });
}

module.exports.conferenceList = function (req, res, next) {
  client.conferences.list(
    {
      status: "in-progress",
      // status: "completed"
    },
    function (err, data) {
      if (err) {
        return res.status(500).send(err);
      }

      if(data.length < 1 && databaseInMemory.length >= 1){
        databaseInMemory = [];
      }

      let arrayOfConferences = [];

      async.each(data, function (conference, next) {
        let progressConference = {
          "participants": []
        };
        progressConference.sid = conference.sid;
        progressConference.friendlyName = conference.friendlyName;
        progressConference.dateCreated = conference.dateCreated;
        getParticipants(progressConference, function (err, result) {
          if (err) {
            return next();
          }
          arrayOfConferences.push(result);
          next();
        });
      }, function (err) {
        res.status(200).send(arrayOfConferences);
      });
    }
  );
};

module.exports.createConference = function (req, res, next) {
  let user1;
  let user2No;
  let user2CallSid;
  let clientNo;
  let clientCallSid;

  if (req.body.user1 !== undefined) {
    user1 = req.body.user1;
  }
  if (req.body.user2No !== undefined) {
    user2No = req.body.user2No;
  }
  if (req.body.user2CallSid !== undefined) {
    user2CallSid = req.body.user2CallSid;
  }
  if (req.body.clientNo !== undefined) {
    clientNo = req.body.clientNo;
  }
  if (req.body.clientCallSid !== undefined) {
    clientCallSid = req.body.clientCallSid;
  }

  if (
    user1 === undefined ||
    clientNo === undefined ||
    clientCallSid === undefined ||
    clientNo === undefined ||
    user2CallSid === undefined
  ) {
    return res.status(405).send({ message: "Missing parameters" });
  }

  let newCollection = colectionStructure;

  let server = getServer(req);
  // conference name will be the parent call SID
  let conferenceName = user2CallSid;
  let fullUrl = server + "/Join-Conference?id=" + conferenceName;

  client.calls(clientCallSid).update({
    url: fullUrl,
    method: "POST"
  }, function (err, call) {
    if (err) {
      res.status(405).send({ message: err });
      return;
    }

    newCollection.clientConferenceName = conferenceName;

    conferenceName = user2CallSid + "_Users";
    fullUrl = server + "/Join-Conference?id=" + conferenceName;

    newCollection.usersConferenceName = conferenceName;
    newCollection.timestamp = Date.now();

    client.calls.create(
      {
        url: fullUrl,
        method: "POST",
        to: user1,
        from: config.twilio.callerId
      },
      function (err, call) {
        if (err) {
          res.status(405).send({ message: err });
          return;
        }
        databaseInMemory.push(newCollection);
        return res.status(200).send({ message: "Conferences created" });
      }
    );
  });
};

// This is the endpoint that Twilio will call when you answer the phone
module.exports.joinConference = function (req, res, next) {
  // res.contentType('application/xml');
  // res.sendFile(__dirname + '/public/resp.xml');
  // return;

  let conferenceName = req.query.id;

  // We return TwiML to enter the same conference
  const twiml = new VoiceResponse();
  const dial = twiml.dial();

  dial.conference(conferenceName, {
    startConferenceOnEnter: true,
    endConferenceOnExit: true
  });
  res.contentType("application/xml");
  res.set("Content-Type", "text/xml");
  res.send(twiml.toString());
};

module.exports.joinClientConference = function (req, res, next) {
  let callSid = req.body.callSid;
  let conferenceName = req.body.conferenceName;

  if (callSid === undefined || conferenceName === undefined) {
    return res.status(405).send({ message: "Missing parameters" });
  }

  let isCallFound = false;
  let error = {
    hasError: false,
    err: ""
  };

  databaseInMemory.forEach(function (doc) {
    if (doc.usersConferenceName === conferenceName && !isCallFound) {
      isCallFound = true;

      let server = getServer(req);
      let fullUrl = server + "/Join-Conference?id=" + doc.clientConferenceName;

      client.calls(callSid).update({
        url: fullUrl,
        method: "POST"
      }, function (err, call) {
        if (err) {
          error.hasError = true;
          error.err = err;
        }
      });
    }
  });

  if(error.hasError){
    return res.status(405).send({ message: error.err });
  }else{
    return res.status(200).send({ message: "Ok" });
  }
}

module.exports.createCallAndJoinConference = function(req, res, next){
  let conferenceName = req.body.conferenceName;
  let callNo = req.body.callNo;
  if(conferenceName === undefined || callNo === undefined){
    return res.status(405).send({ message: "Missing parameters" });
  }

  let server = getServer(req);
  let fullUrl = server + "/Join-Conference?id=" + conferenceName;

  client.calls.create(
    {
      url: fullUrl,
      method: "POST",
      to: callNo,
      from: config.twilio.callerId
    },
    function (err, call) {
      if (err) {
        res.status(405).send(o2x({ message: err }));
        return;
      }
      res.status(200).send({ message: "Thanks for calling!" });
    }
  );
}

module.exports.getUsers = function(req, res, next){
  return res.status(200).send({ users: USERS });
}