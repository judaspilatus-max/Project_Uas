const db = require('../config/db');


exports.getAllProducts = async (req, res) => {
    try {
        const { search } = req.query;
        let query = 'SELECT * FROM products';
        let queryParams = [];

        if (search) {
            query += ' WHERE name LIKE ?';
            queryParams.push(`%${search}%`);
        }

        const [products] = await db.query(query, queryParams);
        res.render('index', { products, user: req.user || null, search: search || '' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error memuat katalog produk.');
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { phone, address } = req.body;

        await db.query('UPDATE users SET phone = ?, address = ? WHERE id = ?', [phone, address, userId]);
        
        
        const [users] = await db.query('SELECT id, username, email, phone, address FROM users WHERE id = ?', [userId]);

        res.render('profile', { user: users[0], success: 'Profil berhasil diperbarui, Lek!', error: null });
    } catch (error) {
        console.error(error);
        res.status(500).render('profile', { user: req.user, success: null, error: 'Gagal memperbarui profil.' });
    }
};