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

db.getConnection((err, connection) => {
    if (err) {
        console.error('ERROR DATABASE:', err);
    } else {
        console.log('Koneksi Database BERHASIL!');
        connection.release();
    }
});

module.exports = db.promise();