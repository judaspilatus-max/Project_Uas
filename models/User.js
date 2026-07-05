const db = require('../config/db');

const User = {
    findByEmail: async (email) => {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    },
    findById: async (id) => {
        const [rows] = await db.query('SELECT id, username, email, role, phone, address FROM users WHERE id = ?', [id]);
        return rows[0];
    },
    create: async (username, email, hashedPassword, role = 'user') => {
        const [result] = await db.query(
            'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
            [username, email, hashedPassword, role]
        );
        return result.insertId;
    },
    updateProfile: async (id, phone, address) => {
        const [result] = await db.query(
            'UPDATE users SET phone = ?, address = ? WHERE id = ?',
            [phone, address, id]
        );
        return result;
    }
};

module.exports = User;