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
      number:"1001",
      user: "Marcus 1"
    },
    {
      number:"1002",
      user: "Marcus 2"
    },
    {
      number:"1003",
      user: "Marcelo 3"
    },
    {
      number:"1004",
      user: "Marcelo 4"
    },
    {
      number:"1005"
    }
  ],
  port: process.env.PORT || 3000
};
