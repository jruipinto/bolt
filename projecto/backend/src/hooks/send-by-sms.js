const modem = require('../modem.js').modem;

const send = function (context) {
    const phoneNumber = context.data.phoneNumber || null;
    const text = context.data.text || null;

    if (context.data.state === 'unread') {
        return;
    }

    if (modem.status.error || !modem.status.connected) {
        console.log('Modem error: Verify modem. Status:', modem.status);
        context.app.service(context.path).patch(+context.result.id, { state: "error" });
        return;
    }

    modem.sendSMS({ phoneNumber, text })
        .subscribe(
            report => {
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
            },
            err => {
                console.log('SMS error:', err);
                context.app.service(context.path).patch(+context.result.id, { state: "error" });
            }
        );
};

module.exports = send;
