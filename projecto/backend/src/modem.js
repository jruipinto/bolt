const Modem = require('modemjs').Modem;
let modemConfig;

if (process.env.NODE_ENV === "production") {
    modemConfig = require("../config/production.json").modemConfig;
} else {
    modemConfig = require("../config/default.json").modemConfig;
}

const modem = new Modem(modemConfig, err => {
    if (err) {
        console.log(err);
    }
});

const listen = function (app) {
    modem.onReceivedSMS().subscribe(({ phoneNumber, text, submitTime }) => {
        app.service('messages').create(
            {
                phoneNumber,
                text,
                submitedAt: submitTime,
                state: 'unread'
            }
        );
    });
}

module.exports.modem = modem;
module.exports.listen = listen;
