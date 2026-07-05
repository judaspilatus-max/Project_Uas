const db = require('../config/db');

exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id; 

        const [users] = await db.query('SELECT id, username, email, phone, address FROM users WHERE id = ?', [userId]);
        
        res.render('profile', { user: users[0], success: null, error: null });
    } catch (error) {
        console.error(error);
        res.status(500).send('Gagal memuat halaman profil, Lek.');
    }
};

exports.updateProfile = async (req, res) => {
    
    const { phone, address } = req.body;
    const userId = req.user.id;

    try {
       
        await db.query(
            'UPDATE users SET phone = ?, address = ? WHERE id = ?',
            [phone, address, userId]
        );
        return res.redirect('/user/profile');
    } catch (error) {
        console.error("Gagal mengupdate profil user:", error);
        return res.status(500).send("Gagal menyimpan perubahan data, Lek.");
    }
};