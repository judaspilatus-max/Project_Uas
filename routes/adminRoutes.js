const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

const upload = require('../middlewares/uploadMiddleware'); 

router.get('/', verifyToken, isAdmin, (req, res) => {
    res.redirect('/admin/dashboard');
});
router.get('/chat', (req, res) => {
    res.render('admin/chat', { user: req.user });
});
router.get('/dashboard', verifyToken, isAdmin, adminController.getDashboard);

router.get('/manage-products', verifyToken, isAdmin, adminController.getManageProducts);

router.get('/add-product', verifyToken, isAdmin, (req, res) => {
    res.render('admin/add-product', { user: req.user });
});

router.post('/add-product', verifyToken, isAdmin, upload.single('image'), adminController.postAddProduct);
router.post('/update-order-status/:id', verifyToken, isAdmin, adminController.updateOrderStatus);

router.get('/products/edit/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const [products] = await db.query('SELECT * FROM products WHERE id = ?', [productId]);
        
        if (products.length === 0) {
            return res.status(404).send("Produk gak ketemu Lek!");
        }

        res.render('admin/edit-product', { user: req.user, product: products[0] });
    } catch (error) {
        console.error(error);
        res.status(500).send("Gagal memuat halaman edit");
    }
});
router.post('/products/edit/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const { name, price, stock, description } = req.body;
        await db.query(
            'UPDATE products SET name = ?, price = ?, stock = ?, description = ? WHERE id = ?',
            [name, price, stock, description, productId]
        );

        res.redirect('/admin/manage-products');
    } catch (error) {
        console.error(error);
        res.status(500).send("Gagal mengupdate data produk Lek");
    }
});

module.exports = router;