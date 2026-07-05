const db = require('../config/db');
const Product = {

    getAll: async (searchQuery = '') => {
        if (searchQuery) {
            const [rows] = await db.query('SELECT * FROM products WHERE name LIKE ? ORDER BY created_at DESC', [`%${searchQuery}%`]);
            return rows;
        }
        const [rows] = await db.query('SELECT * FROM products ORDER BY created_at DESC');
        return rows;
    },
    create: async (name, description, price, stock, image) => {
        const [result] = await db.query(
            'INSERT INTO products (name, description, price, stock, image) VALUES (?, ?, ?, ?, ?)',
            [name, description, price, stock, image]
        );
        return result.insertId;
    },
    delete: async (id) => {
        const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);
        return result;
    }
};

module.exports = Product;