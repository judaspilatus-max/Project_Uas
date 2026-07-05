const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Halaman GET untuk merender form tampilan
router.get('/login', (req, res) => {
    res.render('login', { error: null, success: null, user: null });
});

router.get('/register', (req, res) => {
    res.render('register', { error: null, success: null, user: null });
});

// Halaman POST untuk memproses data dari form ke controller
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

module.exports = router;