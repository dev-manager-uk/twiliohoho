if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

module.exports = {
  twilio: {
    accountSid: process.env.ACCOUNT_SID,
    apiKey: process.env.API_SID,
    apiSecret: process.env.API_SECRET,
    callerId: process.env.CALLER_ID,
    sipDomain: process.env.SIP_DOMAIN
  },
  users: [
    {
      number: "sip:1001@tweb.sip.us1.twilio.com",
      text:"1001",
      user: "Marcus 1"
    },
    {
      number: "sip:1002@tweb.sip.us1.twilio.com",
      text:"1002",
      user: "Marcus 2"
    },
    {
      number: "sip:1003@tweb.sip.us1.twilio.com",
      text:"1003",
      user: "Marcelo 3"
    },
    {
      number: "sip:1004@tweb.sip.us1.twilio.com",
      text:"1004",
      user: "Marcelo 4"
    },
    {
      number: "sip:1005@tweb.sip.us1.twilio.com",
      text:"1005"
    }
  ],
  port: process.env.PORT || 3000
};
