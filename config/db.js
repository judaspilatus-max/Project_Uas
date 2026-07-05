// config/db.js
const mysql = require('mysql2');
require('dotenv').config();

// Membuat koneksi ke database MySQL menggunakan variabel di .env
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Mishael120806',
    database: process.env.DB_NAME || 'mikroskil_ecommerce',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const db = pool.promise();

// Tes Koneksi Awal
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Database gagal terkoneksi, Lek! Error:', err.message);
    } else {
        console.log('Mantap! Database MySQL berhasil terhubung.');
        connection.release();
    }
});

module.exports = db;