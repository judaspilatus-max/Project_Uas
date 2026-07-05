const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, cartController.getCart);

router.post('/add', verifyToken, cartController.addToCart);

router.post('/delete/:id', verifyToken, cartController.deleteCartItem);
router.post('/checkout', verifyToken, cartController.checkout);

module.exports = router;