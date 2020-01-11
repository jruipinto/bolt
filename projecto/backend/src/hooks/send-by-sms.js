const modem = require('../modem.js');

const send = function (context) {
    const phoneNumber = context.data.phoneNumber || null;
    const text = context.data.text || null;

    modem.sendSMS({ phoneNumber, text })
        .subscribe(data => console.log('Message delivered! Here is the report:', data));
};

module.exports = send;