const mysql = require('mysql2');

// Ubah dari createConnection menjadi createPool
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Mishael120806',
    database: process.env.DB_NAME || 'railway', // Pastikan namanya mengarah ke database 'railway' yang benar
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Tes koneksi pool saat server pertama kali berjalan
db.getConnection((err, connection) => {
    if (err) {
        console.error('Gagal mendapatkan koneksi dari Pool:', err);
        return;
    }
    console.log('Database MySQL Berhasil Terhubung Menggunakan Pool!');
    connection.release(); // Jangan lupa kembalikan koneksi ke pool setelah dites
});

// Gunakan metode .promise() jika kode route kamu memakai async/await
module.exports = db.promise();