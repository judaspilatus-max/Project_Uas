const db = require('../config/db'); 
exports.getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const [cartItems] = await db.query(
            `SELECT cart.id, cart.qty, products.name, products.price, products.image, (products.price * cart.qty) AS total_harga 
             FROM cart 
             JOIN products ON cart.product_id = products.id 
             WHERE cart.user_id = ?`, 
            [userId]
        );
        res.render('cart', { user: req.user, cartItems });
    } catch (error) {
        console.error(error);
        res.status(500).send("Gagal memuat keranjang, Lek!");
    }
};
exports.addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, qty } = req.body; 

        const [existingCart] = await db.query(
            'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );

        if (existingCart.length > 0) {
            await db.query(
                'UPDATE cart SET qty = qty + ? WHERE user_id = ? AND product_id = ?',
                [parseInt(qty), userId, productId]
            );
        } else {
            await db.query(
                'INSERT INTO cart (user_id, product_id, qty) VALUES (?, ?, ?)',
                [userId, productId, parseInt(qty)]
            );
        }

        res.sendStatus(200); 
    } catch (error) {
        console.error(error);
        res.status(500).send("Gagal menambah barang, Lek!");
    }
};

exports.deleteCartItem = async (req, res) => {
    try {
        const cartId = req.params.id;
        await db.query('DELETE FROM cart WHERE id = ?', [cartId]);
        res.redirect('/cart');
    } catch (error) {
        console.error(error);
        res.status(500).send("Gagal menghapus item");
    }
};

exports.checkout = async (req, res) => {
    try {
        const userId = req.user.id;
        const [cartItems] = await db.query(
            'SELECT cart.*, products.price FROM cart JOIN products ON cart.product_id = products.id WHERE cart.user_id = ?', 
            [userId]
        );

        if (cartItems.length === 0) {
            return res.send("<script>alert('Keranjang kau kosong Lek!'); window.location='/';</script>");
        }

        let totalBelanja = 0;
        cartItems.forEach(item => {
            totalBelanja += item.price * item.qty;
        });

        const [resultOrder] = await db.query(
            'INSERT INTO orders (user_id, total_price, status, created_at) VALUES (?, ?, ?, NOW())',
            [userId, totalBelanja, 'pending']
        );

        for (let item of cartItems) {
            await db.query('UPDATE products SET stock = stock - ? WHERE id = ?', [item.qty, item.product_id]);
        }

        await db.query('DELETE FROM cart WHERE user_id = ?', [userId]);

        res.send("<script>alert('Pesanan Sukses Dibuat! Silakan cek status pesanan kau Lek.'); window.location='/user/orders';</script>");
    } catch (error) {
        console.error(error);
        res.status(500).send("Proses Checkout Gagal, Lek!");
    }
};