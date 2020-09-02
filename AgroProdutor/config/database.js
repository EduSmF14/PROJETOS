// POSTGRE CLIENT
var { Pool } = require('pg');

module.exports = () => {
    // POOL CONFIG
    let pool = new Pool({
        user: 'srvvjwszzcdmgl',
        password: '32db7b606f23b120d0e9b6788c032e5a8be2f1edd78aff9561af11f3f2c085d1',
        host: 'ec2-174-129-240-67.compute-1.amazonaws.com',
        port: 5432,
        database: 'dc772toj21s42b',

    });

    return pool;
};