const socket = io();
const formChat = document.getElementById('form-chat');
const inputPesan = document.getElementById('input-pesan');
const wadahPesan = document.getElementById('wadah-pesan');

if (formChat) {
    formChat.addEventListener('submit', (e) => {
        e.preventDefault();
        if (inputPesan.value.trim() !== '') {
            const namaUser = formChat.getAttribute('data-username') || 'Pembeli';
            
            socket.emit('kirim-pesan', {
                user: namaUser,
                teks: inputPesan.value
            });

            inputPesan.value = ''; 
        }
    });
}

socket.on('terima-pesan', (data) => {
    if (wadahPesan) {
        const elemenPesan = document.createElement('div');
        elemenPesan.innerHTML = `<strong>${data.user}:</strong> ${data.teks}`;
        elemenPesan.style.marginBottom = '8px';
        
        wadahPesan.appendChild(elemenPesan);
        
        // Otomatis scroll ke bawah setiap ada pesan baru
        wadahPesan.scrollTop = wadahPesan.scrollHeight;
    }
});

socket.on('notifikasi-checkout-baru', (data) => {
    alert(`Pemberitahuan Admin: Ada orderan baru masuk senilai Rp${data.total}!`);
});