# README #

An Open-Source PBX-Like Phone System for Twilio SIP Domains Built in node.js and Hosted on Heroku. 

Requirements:

1. Create Twilio calls when dialed from a SIP endpoint

2. Create Twilio calls using 2 legs when dialed from an HTTP endpoint (Click2Call aka Click2Dial)

3. Display list of active calls

4. Display list of active conferences

5. Allow active calls to be transferred to another user
(by moving User to Conference1, Customer to Conference2, adding User2 to Conference1, then moving User2 to Conference2)]

6. Create Hunt Group to dial User 1/2/3/etc in order.  Move to next if Busy, DND or after XX seconds
May be creating a node.js version of: 
https://github.com/philnash/useful-twilio-functions/tree/master/hunt
