'use strict';
const o2x = require('object-to-xml');
const PNF = require('google-libphonenumber').PhoneNumberFormat;
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

const phoneComponent = require('./phoneComponent');

module.exports.formatPhoneNumberGET = function (req, res, next) {
  let called;
  let callerId;

  if (req.query.called !== undefined) {
    called = req.query.called;
  } else {
    called = req.query.Called;
  }

  if (req.query.callerId !== undefined) {
    callerId = req.query.callerId;
  } else {
    callerId = req.query.CallerId;
  }

  res.set('Content-Type', 'text/xml');

  if (called === undefined || called === "") {
    return res.status(405).send(o2x({ message: 'There is no called number selected' }));
  }

  if (callerId === undefined || callerId === "") {
    return res.status(405).send(o2x({ message: 'There is no callerId selected' }));
  }

  if (called.indexOf("@") > -1) {
    called = called.substring(called.indexOf(":") + 2, called.indexOf("@"));
  }

  if (called.indexOf("%40") > -1) {
    called = called.substring(called.indexOf("%3A") + 2, called.indexOf("%40"));
  }

  phoneComponent.formatPhoneNumber(called, function (err, returnedNumber) {
    if (err) {
      return res.status(405).send(o2x({ message: 'Error to calculate this number' }));
    }
    res.status(200).send(o2x({
      '?xml version="1.0" encoding="utf-8"?': null,
      Response: {
        Dial: {
          '@': {
            'callerId': callerId
          },
          '#': {
            'Number': returnedNumber
          }
        }
      }
    }));
  });
}

module.exports.formatPhoneNumberPOST = function (req, res, next) {
  let called;
  let callerId;

  if (req.body.called !== undefined) {
    called = req.body.called;
  } else if(req.body.Called !== undefined) {
    called = req.body.Called;
  } else if(req.query.called !== undefined){
    called = req.query.called;
  } else{
    called = req.query.Called;
  }

  if (req.body.callerId !== undefined) {
    callerId = req.body.callerId;
  } else if(req.body.CallerId !== undefined) {
    callerId = req.body.CallerId;
  } else if(req.query.callerId !== undefined){
    callerId = req.query.callerId;
  } else{
    callerId = req.query.CallerId;
  }

  res.set('Content-Type', 'text/xml');

  if (called === undefined || called === "") {
    return res.status(405).send(o2x({ message: 'There is no called number selected' }));
  }

  if (callerId === undefined || callerId === "") {
    return res.status(405).send(o2x({ message: 'There is no callerId selected' }));
  }

  if (called.indexOf("@") > -1) {
    called = called.substring(called.indexOf(":") + 2, called.indexOf("@"));
  }

  if (called.indexOf("%40") > -1) {
    called = called.substring(called.indexOf("%3A") + 2, called.indexOf("%40"));
  }

  phoneComponent.formatPhoneNumber(called, function (err, returnedNumber) {
    if (err) {
      res.status(405).send(o2x({ message: 'Error to calculate this number' }));
      return;
    }
    res.status(200).send(o2x({
      '?xml version="1.0" encoding="utf-8"?': null,
      Response: {
        Dial: {
          '@': {
            'callerId': callerId
          },
          '#': {
            'Number': returnedNumber
          }
        }
      }
    }));
  });
}