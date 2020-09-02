// APP PACKAGES
var express = require('express'),
    load = require('express-load'),
    bodyParser = require('body-parser'),
    // GET AUTHENTICATION
    authCliente = require('../config/auth').authCliente,
    authProdutor = require('../config/auth').authProdutor;


module.exports = () => {
    // EXPRESS
    let app = express();
    // CROSS-ORIGN
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    function requireHTTPS(req, res, next) {
        // The 'x-forwarded-proto' check is for Heroku
        if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development") {
            return res.redirect('https://' + req.get('host') + req.url);
        }
        next();
    }
    app.use(requireHTTPS);

    // APP USE 
    app.set('PORT', process.env.PORT);
    app.use(bodyParser.json());
    app.use(express.static('./public'));
    app.use(authCliente.initialize());
    app.use(authProdutor.initialize());
    // APP FOLDERS
    load('controllers', { cwd: 'app' })
        .then('routers')
        .into(app);

    return app;
};