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

module.exports = modem;