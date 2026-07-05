const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 

exports.register = async (req, res) => {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
        return res.render('register', { 
            error: 'Semua field wajib diisi ya, Lek!', 
            success: null, 
            user: null 
        });
    }
    
    try {
        console.log("Mengecek email di database...");
        const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (existingUser.length > 0) {
            return res.render('register', { error: 'Email sudah terdaftar, Lek!', success: null, user: null });
        }

        console.log("Hashing password...");
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const finalRole = (role === 'admin') ? 'admin' : 'user';

        console.log(`Mencoba menyimpan user baru dengan role: ${finalRole}...`);
        await db.query(
            'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', 
            [username, email, hashedPassword, finalRole]
        );

        console.log("User berhasil disimpan ke database!");
        return res.render('login', { error: null, success: 'Akun berhasil dibuat! Silakan masuk, Lek.', user: null });

    } catch (error) {
        console.error("ERROR REGISTER TERDETEKSI:", error);
        return res.render('register', { error: `Gagal simpan ke database: ${error.message}`, success: null, user: null });
    }
};
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (users.length === 0) {
            return res.render('login', { error: 'Email tidak terdaftar, Lek!', success: null, user: null });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('login', { error: 'Password kelen salah, Lek! Cek lagi.', success: null, user: null });
        }
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role }, 
            process.env.JWT_SECRET || 'secret_key_kamu', 
            { expiresIn: '1d' }
        );
        res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

        if (user.role === 'admin') {
            console.log(`Pemilik Toko (${user.username}) berhasil login. Dialihkan ke /admin/dashboard.`);
            return res.redirect('/admin/dashboard'); 
        } else {
            console.log(`Pembeli (${user.username}) berhasil login. Dialihkan ke katalog utama.`);
            return res.redirect('/'); 
        }

    } catch (error) {
        console.error("ERROR LOGIN:", error);
        return res.render('login', { error: 'Terjadi kesalahan sistem pada server.', success: null, user: null });
    }
};
exports.logout = (req, res) => {
    res.clearCookie('token'); 
    return res.redirect('/login');
};