require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const cookieParser = require('cookie-parser');


const app = express();
const server = http.createServer(app);
const io = new Server(server);

const { checkUserStatus } = require('./middlewares/authMiddleware');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(checkUserStatus);

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/', authRoutes);
app.use('/user', userRoutes);
app.use('/', productRoutes);
app.use('/cart', cartRoutes);
app.use('/admin', adminRoutes);


io.on('connection', (socket) => {
    console.log(`Ada user terhubung ke WebSocket, ID: ${socket.id}`);

    socket.on('kirim-pesan', (data) => {
        console.log("Pesan Masuk:", data);
        io.emit('terima-pesan', {
            sender: data.sender,
            message: data.message
        });
    });

    socket.on('disconnect', () => {
        console.log('User terputus dari WebSocket');
    });
});

app.get('/chat', (req, res) => {
    res.render('chat', { user: req.user || null });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`=`);
    console.log(`Server Mikroskil Shop Berhasil Berjalan!`);
    console.log(`Silakan buka di: http://localhost:${PORT}`);
    console.log(`=`);
});