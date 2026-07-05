const mysql = require('mysql2');

const db = mysql.createPool({
    host: 'hayabusa.proxy.rlwy.net', 
    user: 'root', 
    password: 'NRBbtcuBSyycKYsirloqiEBZEYacPFet',
    database: 'railway', 
    port: 46715, 
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = db.promise();