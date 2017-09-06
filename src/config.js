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
      number: "sip:101@tweb.sip.us1.twilio.com",
      text:"101",
      user: "Marcus"
    },
    {
      number: "sip:102@tweb.sip.us1.twilio.com",
      text:"102",
      user: "Marcelo"
    },
    {
      number: "sip:103@tweb.sip.us1.twilio.com",
      text:"103",
      user: "Emily"
    },
    {
      number: "sip:104@tweb.sip.us1.twilio.com",
      text:"104",
      user: "Kate"
    },
    {
      number: "sip:105@tweb.sip.us1.twilio.com",
      text:"105"
    }
  ],
  port: process.env.PORT || 3000
};
