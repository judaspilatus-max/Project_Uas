const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const db = require('../config/db');
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);

        if (rows.length === 0) {
            return res.status(404).send("User gak ketemu Lek!");
        }
        res.render('profile', { user: rows[0] });
    } catch (error) {
        console.error(" Error Profil GET:", error);
        res.status(500).send("Gagal memuat halaman profil, Lek!");
    }
});

router.get('/orders', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const [myOrders] = await db.query(
            'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', 
            [userId]
        );
        res.render('users/order', { user: req.user, orders: myOrders });
    } catch (error) {
        console.error("Error Orders:", error);
        res.status(500).send("Gagal mengambil status pesanan, Lek.");
    }
});

router.post('/profile/update', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { username, email, phone, address } = req.body;
        await db.query(
            'UPDATE users SET username = ?, email = ?, phone = ?, address = ? WHERE id = ?',
            [username, email, phone, address, userId]
        );
        res.redirect('/user/profile');
    } catch (error) {
        console.error("🚨 ERROR UPDATE PROFIL:", error);
        res.status(500).send("Gagal menyimpan perubahan data profil, Lek: " + error.message);
    }
});

module.exports = router;