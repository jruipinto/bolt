const from = require('rxjs').from;
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

const modem = new Modem(modemConfig);

const listen = function (app) {
    modem.init(err => {
        if (err) {
            console.log(err);
        }
    });

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
    let createdFlag = false;
    modem.log$.pipe(
        map(log => log.trim()),
        tap(log => newLog = (newLog ? (newLog + ';\r' + log) : log).slice(-1500)),
        concatMap(() => from(app.service('configs').find({ query: { key: "modemLog" } }))),
        map(result => +result.total),
        concatMap(total => {
            if (!total && !createdFlag) {
                createdFlag = true;
                return from(app.service('configs').create({ key: "modemLog", value: newLog }));
            }
            return from(
                app.service('configs').patch(
                    null,
                    { value: newLog },
                    { query: { key: "modemLog" } }
                )
            );

        })
    ).subscribe();

    modem.status$.subscribe(status => {
        if (!status.connected && status.error) {
            // console.log('Modem disconnected.');
        }
        if (status.connected && status.error) {
            // console.log('Modem error.');
        }
        if (status.debug) {
            // console.log('Modem in debug mode.');
        }
    });

}

module.exports.modem = modem;
module.exports.listen = listen;
