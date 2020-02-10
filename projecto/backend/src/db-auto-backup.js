const mysqldump = require('mysqldump');
const nodemailer = require('nodemailer');
const CronJob = require('cron').CronJob;

const dbDumpHeader = `

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for bolt
DROP DATABASE IF EXISTS \`bolt\`;
CREATE DATABASE IF NOT EXISTS \`bolt\` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE \`bolt\`;


`;

const dbDumpFooter = `
/*!40000 ALTER TABLE \`users\` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;

`;

// retrieve database path from configs json
let mysql;
let transport;
if (process.env.NODE_ENV === "production") {
    mysql = require("../config/production.json").mysql;
    transport = require("../config/production.json").nodemailer;
} else {
    mysql = require("../config/default.json").mysql;
    transport = require("../config/default.json").nodemailer;
}
const db = {
    host: mysql.split('@')[1].split(':')[0],
    port: mysql.split(':')[3].split('/')[0],
    user: mysql.split('//')[1].split(':')[0],
    password: mysql.split(':')[2].split('@')[0],
    database: mysql.split('/')[3],
};

const transporter = nodemailer.createTransport(transport);
const mailOptions = {
    from: 'rui.nreparacoes@gmail.com',
    to: 'rui.nreparacoes@gmail.com, geral@nreparacoes.com',
    subject: 'Backup automático diário do software Bolt',
    text: 'Bom dia,\n\nEm anexo segue a última cópia de segurança da base de dados do gestor de assistências Bolt.\n\nAtentamente,\nJ Rui Pinto'
};


/**
 * Send email everyday at midnight after mysqldump() has been resolved
 */
function scheduleAutoBackup() {

    const job = new CronJob('00 00 00 */1 * *', () => {
        mysqldump({ connection: db }).then(({ dump }) => transporter.sendMail(
            {
                ...mailOptions,
                attachments: [
                    {   // utf-8 string as an attachment
                        filename: 'bolt-dump.sql',
                        content: Buffer.from(dbDumpHeader + dump.schema + '\n\n' + dump.data + '\n\n' + dump.trigger + dbDumpFooter)
                    }
                ]
            },
            function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            }
        ));
    });

    job.start();

}

module.exports = scheduleAutoBackup