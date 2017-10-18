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
  usersUrl: process.env.USERS_URL,
  port: process.env.PORT || 3000
};
