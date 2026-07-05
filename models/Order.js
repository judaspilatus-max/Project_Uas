const db = require('../config/db');
const Order = {
    create: async (userId, totalPrice) => {
        const [result] = await db.query(
            'INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, ?)',
            [userId, totalPrice, 'pending']
        );
        return result.insertId;
    },
    getAllOrdersWithUser: async () => {
        const [rows] = await db.query(`
            SELECT orders.*, users.username 
            FROM orders 
            JOIN users ON orders.user_id = users.id 
            ORDER BY orders.created_at DESC
        `);
        return rows;
    }
};

module.exports = Order;