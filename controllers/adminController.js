const db = require('../config/db');
exports.getDashboard = async (req, res) => {
    try {
        const [orders] = await db.query(`
            SELECT orders.*, users.username 
            FROM orders 
            JOIN users ON orders.user_id = users.id
            ORDER BY orders.created_at DESC
        `);
        return res.render('admin/dashboard', { orders, user: req.user });
        
    } catch (error) {
        console.error("ERROR GET DASHBOARD:", error);
        return res.status(500).send("Gagal memuat dashboard admin, Lek.");
    }
};
exports.getManageProducts = async (req, res) => {
    try {
        const [products] = await db.query('SELECT * FROM products ORDER BY id DESC');
        
        return res.render('admin/manage-product', { 
            user: req.user, 
            products: products 
        });
    } catch (error) {
        console.error("ERROR GET MANAGE PRODUCTS:", error);
        return res.status(500).send("Gagal memuat manajemen produk, Lek.");
    }
};
exports.postAddProduct = async (req, res) => {
    const { name, description, price, stock } = req.body;
    const image = req.file ? req.file.filename : 'default.jpg';

    try {
        await db.query(
            'INSERT INTO products (name, description, price, stock, image) VALUES (?, ?, ?, ?, ?)',
            [name, description, price, stock, image]
        );
        return res.redirect('/admin/manage-products');
    } catch (error) {
        console.error("ERROR SIMPAN BARANG:", error);
        return res.status(500).send("Gagal menyimpan barang ke database, Lek.");
    }
};

exports.updateOrderStatus = async (req, res) => {
    const orderId = req.params.id; 
    const { status } = req.body;
    try {
        await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
        return res.redirect('/admin/dashboard');
    } catch (error) {
        console.error("ERROR UPDATE STATUS:", error);
        return res.status(500).send("Gagal memperbarui status transaksi, Lek.");
    }
};