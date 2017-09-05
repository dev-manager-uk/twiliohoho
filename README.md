# ABOUT #

An Open-Source PBX-Like Phone System for Twilio SIP Domains Built in node.js and Hosted on Heroku. 

# PURPOSE #

1. Create Twilio calls when dialed from a SIP endpoint

2. Create Twilio calls using 2 legs when dialed from an HTTP endpoint (Click2Call aka Click2Dial)

3. Display list of active calls

4. Display list of active conferences

5. Allow active calls to be transferred to another user
(by moving User to Conference1, Customer to Conference2, adding User2 to Conference1, then moving User2 to Conference2)]

6. Create Hunt Group to dial User 1/2/3/etc in order.  Move to next if Busy, DND or after XX seconds
May be creating a node.js version of: 
https://github.com/philnash/useful-twilio-functions/tree/master/hunt

# INSTALLATION #

To deploy to Heroku:

1. Create a new application in Heroku

2. In the 'Deploy' tab in Heroku, connect to this github repo

3. In the 'Settings' tab in Heroku, set up the following Config Variables:

ACCOUNT_SID 
(the ID of your Twilio account from https://www.twilio.com/console/account/settings )

API_SID
(THe ID of your new API Key from https://www.twilio.com/console/runtime/api-keys )

API_SECRET
(The secret for your new API Key from https://www.twilio.com/console/runtime/api-keys )

CALLER_ID
(The Twilio phone number Caller ID you would like to use for the application)


# USAGE #

1. Load the monitor pages by going to:
https://YOUR-APP.herokuapp.com/calls
https://YOUR-APP.herokuapp.com/conferences

2. Load the Click2Call by submitting a POST request to:
https://YOUR-APP.herokuapp.com/Click
Called: [The phone number you would like to call]
CallerID:  [The caller ID for the call]
User: [The SIP user who should be connected to the external call]

3. You will need to set up a SIP domain in Twilio at:
https://www.twilio.com/console/voice/sip/endpoints

4. You will need to set up SIP User Endpoints at:
https://www.twilio.com/console/voice/sip/cls


