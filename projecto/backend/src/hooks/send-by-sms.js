const modem = require('../modem.js').modem;
const of = require('rxjs').of;
const concatMap = require('rxjs/operators').concatMap;
const first = require('rxjs/operators').first;

const send = function (context) {
    const phoneNumber = context.data.phoneNumber || null;
    const text = context.data.text || null;

    if (context.data.state === 'unread') {
        return;
    }

    modem.status$.pipe(
        first(),
        concatMap(status => {
            if (!status.error && status.connected) {
                return modem.sendSMS({ phoneNumber, text });
            }
            console.log('Modem error: Verify modem. Status:', modem.status);
            context.app.service(context.path).patch(+context.result.id, { state: "error" });
            return of(null);
        })
    ).subscribe(
        report => {
            if (report !== null) {
                if (+report.st === 0) {
                    context.app.service(context.path).patch(
                        +context.result.id,
                        {
                            state: "delivered",
                            submitedAt: report.submitTime,
                            deliveredAt: report.deliveryTime
                        }
                    );
                } else {
                    context.app.service(context.path).patch(
                        +context.result.id,
                        {
                            state: "unreachable",
                            submitedAt: report.submitTime
                        }
                    );
                }
            }
        },
        err => {
            console.log('SMS error:', err);
            context.app.service(context.path).patch(+context.result.id, { state: "error" });
        }
    );

};

module.exports = send;
