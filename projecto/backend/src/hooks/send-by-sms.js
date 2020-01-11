const modem = require('../modem.js');

const send = function (context) {
  const phoneNumber = context.data.phoneNumber || null;
  const text = context.data.text || null;

  modem.sendSMS({ phoneNumber, text })
    .subscribe(report => {
      console.log('Message delivered! Here is the report:', report);
      context.app.service(context.path).patch(+context.result.id, { state: "gsyss", deliveredAt: report.deliveryTime });
    });
};

module.exports = send;
