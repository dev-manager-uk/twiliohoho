'use strict';
const PNF = require('google-libphonenumber').PhoneNumberFormat;
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

const countryCode = "GB";

function selectValidCaracters(formattedNumber, cb) {
  let returnNumber = "";
  let count = 0;
  for (let numberOrPlus of formattedNumber) {
    count++;
    switch (numberOrPlus) {
      case "+":
        returnNumber += numberOrPlus
        break;
      case "0":
        returnNumber += numberOrPlus
        break;
      case "1":
        returnNumber += numberOrPlus
        break;
      case "2":
        returnNumber += numberOrPlus
        break;
      case "3":
        returnNumber += numberOrPlus
        break;
      case "4":
        returnNumber += numberOrPlus
        break;
      case "5":
        returnNumber += numberOrPlus
        break;
      case "6":
        returnNumber += numberOrPlus
        break;
      case "7":
        returnNumber += numberOrPlus
        break;
      case "8":
        returnNumber += numberOrPlus
        break;
      case "9":
        returnNumber += numberOrPlus
        break;
      default:
        break;
    }
    if (formattedNumber.length === count) {
      return cb(null, returnNumber);
    }
  }
}

module.exports.formatPhoneNumber = function(phoneNumber, cb) {
  try {
    // Parse number with country code. 
    let phoneNumberByCountryCode = phoneUtil.parse(phoneNumber, countryCode);
    //Apply formatation
    let formattedNumber = phoneUtil.format(phoneNumberByCountryCode, PNF.INTERNATIONAL);
    //Remove spaces and invalid caracters
  }
  catch(err) {
    return cb(err);
  }

  selectValidCaracters(formattedNumber, function (err, returnNumber) {
    if(err){
      return cb(err);
    }
    return cb(null, returnNumber);
  });
}