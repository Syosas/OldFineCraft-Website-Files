// --- IP Kopyalama Sistemi (Yeşil animasyonlu bildirim) ---
const copyBtn = document.getElementById('copy-ip-btn');
const copyToast = document.getElementById('copy-toast');

if (copyBtn && copyToast) {
    copyBtn.addEventListener('click', () => {
        const ip = "oyna.oldfinecraft.online";
        navigator.clipboard.writeText(ip).then(() => {
            // Bildirimi göster
            copyToast.classList.add('show');
            // 3 saniye sonra bildirimi gizle
            setTimeout(() => {
                copyToast.classList.remove('show');
            }, 3000);
        });
    });
}

// --- Navigasyon Geçişleri (Sayfalar arası geçiş aktif) ---
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.dataset.target;
        
        // Tüm navigasyon butonlarındaki 'active' sınıfını temizle
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        // Tıklanan butona 'active' sınıfını ekle
        btn.classList.add('active');
        
        // Tüm section'ları gizle
        document.querySelectorAll('main.view-section').forEach(section => {
            section.classList.add('hidden');
        });
        
        // Hedef section'ı göster
        const targetSection = document.getElementById(target);
        if (targetSection) {
            targetSection.classList.remove('hidden');
        }
    });
});
