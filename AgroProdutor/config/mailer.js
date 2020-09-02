// NODEMAILER TRANSPORTER
var nodemailer = require('nodemailer');

module.exports = () => {
    // TRANSPORTER CONFIG
    let transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com", // hostname
        secureConnection: false, // TLS requires secureConnection to be false
        port: 587, // port for secure SMTP
        tls: {
            ciphers: 'SSLv3'
        },
        auth: {
            user: 'app_agroprodutor@hotmail.com',
            pass: 'AgroProdutor.app'
        }
    });

    return transporter;
};