const mysql = require('mysql2');

const db = mysql.createPool({
    // Railway akan mengisi nilai ini secara otomatis dari fitur Reference 
    // yang sudah kamu atur di tab Variables
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.MYSQLPORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = db.promise();