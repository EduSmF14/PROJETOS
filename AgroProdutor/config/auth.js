// AUTHENTICATION PACKAGES
var passport = require('passport'),
    jwt = require('jsonwebtoken'),
    passportJWT = require('passport-jwt'),
    // DATABASE POOL
    pool = require('../config/database')(),
    // AUTHENTICATION VALIDATION
    ExtractJwt = passportJWT.ExtractJwt,
    JwtStrategy = passportJWT.Strategy,
    // AUTHENTICATION OPTIONS
    jwtOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: '0ah13fldfe12jkjjz358osisx88za'
    };

module.exports = {
    // GET AUTHENTICATION
    get authCliente() {
        // STRATEGY
        strategy = new JwtStrategy(jwtOptions, (jwt_payload, next) => {
            // CONNECT
            pool.connect()
                .then(client => {
                    // QUERY
                    client.query('SELECT * FROM tbCliente WHERE idCliente = $1', [jwt_payload._id])
                        .then(result => {
                            if (result.rowCount > 0) {
                                next(null, result.rows[0]);
                            } else {
                                next(null, false);
                            }
                        })
                        .catch(err => console.log(err.message))
                    // DISCONNECT
                    client.release();
                })
                .catch(err => console.log(err.message))
        });
        // PASSPORT
        passport.use(strategy);

        return {
            initialize() {
                return passport.initialize();
            },
            get authenticate() {
                return passport.authenticate('jwt', { session: false });
            }
        }
    },
    get authProdutor() {
        // STRATEGY
        strategy2 = new JwtStrategy(jwtOptions, (jwt_payload, next) => {
            // CONNECT
            pool.connect()
                .then(client => {
                    // QUERY
                    client.query('SELECT * FROM tbProdutor WHERE idProdutor = $1', [jwt_payload._id])
                        .then(result => {
                            if (result.rowCount > 0) {
                                next(null, result.rows[0]);
                            } else {
                                next(null, false);
                            }
                        })
                        .catch(err => console.log(err.message))
                    // DISCONNECT
                    client.release();
                })
                .catch(err => console.log(err.message))
        });
        // PASSPORT
        passport.use(strategy2);

        return {
            initialize() {
                return passport.initialize();
            },
            get authenticate() {
                return passport.authenticate('jwt', { session: false });
            }
        }
    },
    // LOGIN FUNCTION
    loginCliente(name, password, callback) {
        // CONNECT
        pool.connect()
            .then(client => {
                // QUERY
                client.query('SELECT * FROM tbCliente WHERE nomeUser = $1 AND senha = MD5($2)', [name, password])
                    .then(result => {
                        // CHECK RESULT
                        if (result.rowCount > 0) {
                            let payload = { _id: result.rows[0].idcliente, _user_name: result.rows[0].nomeuser },
                                token = jwt.sign(payload, jwtOptions.secretOrKey);
                            // CALLBACK IF USER EXIST
                            callback({ id: payload._id, user_name: payload._user_name, token });
                        } else {
                            // CALLBACK IF USER NOT EXIST
                            callback(false);
                        }
                    })
                    .catch(err => console.log(err.message))
                // DISCONNECT
                client.release();
            })
            .catch(err => console.error(err.message));
    },
    loginProdutor(name, password, callback) {
        // CONNECT
        pool.connect()
            .then(client => {
                // QUERY
                client.query('SELECT * FROM tbProdutor WHERE nomeUserProdutor = $1 AND senha = MD5($2)', [name, password])
                    .then(result => {
                        // CHECK RESULT
                        if (result.rowCount > 0) {
                            let payload = { _id: result.rows[0].idprodutor, _user_name: result.rows[0].nomeuserprodutor},
                                token = jwt.sign(payload, jwtOptions.secretOrKey);
                            // CALLBACK IF USER EXIST
                            callback({ id: payload._id, user_name: payload._user_name, token });
                        } else {
                            // CALLBACK IF USER NOT EXIST
                            callback(false);
                        }
                    })
                    .catch(err => console.log(err.message))
                // DISCONNECT
                client.release();
            })
            .catch(err => console.error(err.message));
    }
};