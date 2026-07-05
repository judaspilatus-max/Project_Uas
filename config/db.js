const mysql = require('mysql2'); // atau require('mysql') sesuai library-mu

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'mikroskil_ecommerce',
    port: process.env.DB_PORT || 3306
});

db.connect((err) => {
    if (err) {
        console.error('Gagal koneksi database:', err);
        return;
    }
    console.log('Database MySQL Berhasil Terhubung!');
});

module.exports = db;