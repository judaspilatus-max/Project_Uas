document.addEventListener('DOMContentLoaded', () => {
    console.log('Mikroskil E-Commerce Client script ready, Lek!');

    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.display = 'none';
        }, 3000);
    });
});