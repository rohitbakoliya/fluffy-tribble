require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

exports.makeCall = () => {
  client.calls
    .create({
      url: `https://rohitbakoliya-showcase.s3.ap-south-1.amazonaws.com/caller.xml`,
      method: 'GET',
      to: process.env.MY_PHONE_NUMBER,
      from: '+13236152007',
    })
    .then(message => console.log(message.sid))
    .catch(e => console.log(e));
};
