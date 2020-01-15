// import { from } from 'rxjs';
const from = require('rxjs').from;
// import { concatMap, tap, map } from 'rxjs/operators';
const concatMap = require('rxjs/operators').concatMap;
const tap = require('rxjs/operators').tap;
const map = require('rxjs/operators').map;
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

    let newLog = null;
    modem.log$.pipe(
        map(log => log.trim()),
        tap(log => newLog = (newLog ? (newLog + ';\r' + log) : log).slice(-1500)),
        concatMap(() => from(
            app.service('configs').patch(
                null,
                { value: newLog },
                { query: { key: "modemLog" } }
            )
        ))
    ).subscribe();

}

module.exports.modem = modem;
module.exports.listen = listen;
