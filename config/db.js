const mysql = require('mysql2');

require('dotenv').config();

const db = mysql.createPool({
    host: process.env.DB_HOST || process.env.MYSQLHOST,
    user: process.env.DB_USER || process.env.MYSQLUSER,
    password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD,
    database: process.env.DB_NAME || process.env.MYSQLDATABASE || 'railway',
    port: process.env.DB_PORT || process.env.MYSQLPORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


db.getConnection((err, connection) => {
    if (err) {
        console.error('DATABASE ERROR:', err.message);
        return;
    }
    console.log('Koneksi ke Database Cloud Railway Sukses Terbuka!');
    connection.release();
});

module.exports = db.promise();