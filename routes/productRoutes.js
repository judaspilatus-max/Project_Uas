const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/', async (req, res) => {
    try {
        const searchKeyword = req.query.search;
        let query = 'SELECT * FROM products';
        let queryParams = [];

        if (searchKeyword && searchKeyword.trim() !== '') {
            query += ' WHERE name LIKE ? OR description LIKE ?';
            queryParams.push(`%${searchKeyword}%`, `%${searchKeyword}%`);
        }
        query += ' ORDER BY created_at DESC'; 
        const [rows] = await db.query(query, queryParams);
        res.render('index', { 
            user: req.user || null, 
            products: rows, 
            searchKeyword: searchKeyword || '' 
        });
    } catch (error) {
        console.error("Error di rute utama:", error);
        res.status(500).send("Server Error, Lek!");
    }
});

router.get('/products/delete/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        await db.query('DELETE FROM products WHERE id = ?', [productId]);
        res.redirect('/admin/manage-products');
    } catch (error) {
        console.error(error);
        res.status(500).send("Gagal menghapus produk, Lek.");
    }
});

router.get('/', async (req, res) => {
    try {
        const searchKeyword = req.query.search;
        
        let query = 'SELECT * FROM products';
        let queryParams = [];

        if (searchKeyword && searchKeyword.trim() !== '') {
            query += ' WHERE name LIKE ? OR description LIKE ?';
            queryParams.push(`%${searchKeyword}%`, `%${searchKeyword}%`);
        }
        const [rows] = await db.query(query, queryParams);
        res.render('index', { 
            user: req.user || null, 
            products: rows, 
            searchKeyword: searchKeyword || '' 
        });
    } catch (error) {
        console.error("Gagal cari produk:", error);
        res.status(500).send("Database error, Lek!");
    }
});
router.post('/admin/products/edit/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const { name, price, stock, description } = req.body;
        await db.query(
            'UPDATE products SET name = ?, price = ?, stock = ?, description = ? WHERE id = ?',
            [name, price, stock, description, productId]
        );

        res.redirect('/admin/manage-products');
    } catch (error) {
        console.error("🚨 ERROR DETAIL POST EDIT:", error);
        res.status(500).send("Gagal memperbarui data produk: " + error.message);
    }
});


module.exports = router;