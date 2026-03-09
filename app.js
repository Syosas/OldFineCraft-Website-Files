// ─── INIT ──────────────────────────────────────────────────
window.addEventListener('load', () => {
    if (window.lucide) window.lucide.createIcons();
    initPageReveal();
    initNav();
    initNavHoverEffect();
    initCopyBtn();
    initMobileMenu();
    initAuthTabs();
    injectStore();
    initRememberMe();
});

// ─── PAGE REVEAL (fade in from black on load/refresh) ───────
function initPageReveal() {
    // Overlay sadece sayfa geçişlerinde kullanılır, ilk yüklemede dokunmuyoruz
    const overlay = document.getElementById('page-overlay');
    if (overlay) {
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
    }
}

// ─── PAGE TRANSITION ────────────────────────────────────────
function transitionTo(cb) {
    const overlay = document.getElementById('page-overlay');
    overlay.style.transition = 'opacity 0.25s ease';
    overlay.classList.add('active');
    setTimeout(() => {
        cb();
        if (window.lucide) window.lucide.createIcons();
        setTimeout(() => {
            overlay.style.transition = 'opacity 0.4s ease';
            overlay.classList.remove('active');
        }, 60);
    }, 260);
}

// ─── NAVIGATION ─────────────────────────────────────────────
let currentView = 'home';

function initNav() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        const target = btn.dataset.target;
        if (!target) return;

        btn.addEventListener('click', () => {
            const authType = btn.dataset.auth || null;
            const scrollTo = btn.dataset.scroll || null;
            closeMobileMenu();
            showView(target, authType, scrollTo);
        });
    });

    document.getElementById('nav-logo')?.addEventListener('click', () => showView('home'));
}

function showView(target, authType = null, scrollTarget = null) {
    if (target === currentView && !scrollTarget && !authType) return;

    transitionTo(() => {
        // Hide all
        document.querySelectorAll('.view-section').forEach(s => {
            s.classList.remove('active', 'anim-enter');
            s.style.display = 'none';
        });

        // Show target
        const el = document.getElementById('view-' + target);
        if (el) {
            el.style.display = target === 'auth' ? 'flex' : 'block';
            el.classList.remove('anim-enter');
            void el.offsetWidth; // reflow
            el.classList.add('active', 'anim-enter');
            // anim-enter class'ını animasyon bitince kaldır
            setTimeout(() => el.classList.remove('anim-enter'), 450);
        }

        currentView = target;
        updateNavActive(target, scrollTarget);

        // Auth tab auto-switch
        if (target === 'auth' && authType) {
            switchAuthTab(authType);
        }

        // Scroll to section within bilgiler view
        if (scrollTarget) {
            setTimeout(() => {
                const sec = document.getElementById('section-' + scrollTarget);
                if (sec) {
                    sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    sec.classList.add('highlight');
                    setTimeout(() => sec.classList.remove('highlight'), 1200);
                }
            }, 350);
        }
    });
}

function updateNavActive(target, scrollTarget) {
    document.querySelectorAll('.nav-underline').forEach(btn => {
        const sameTarget = btn.dataset.target === target;
        const sameScroll = scrollTarget ? btn.dataset.scroll === scrollTarget : !btn.dataset.scroll;
        const isActive = sameTarget && sameScroll;
        btn.classList.toggle('active', isActive);
        btn.style.color = isActive ? 'white' : '';
    });
}

// Hover: underline slides to hovered button, returns to active on mouse leave
function initNavHoverEffect() {
    const navBtns = document.querySelectorAll('.nav-underline');
    navBtns.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            navBtns.forEach(b => {
                if (b !== btn) b.classList.add('hover-suppressed');
            });
        });
        btn.addEventListener('mouseleave', () => {
            navBtns.forEach(b => b.classList.remove('hover-suppressed'));
        });
    });
}

// ─── COPY IP ─────────────────────────────────────────────────
function initCopyBtn() {
    const btn = document.getElementById('copy-ip-btn');
    const toast = document.getElementById('copy-toast');
    let toastTimer;

    btn?.addEventListener('click', () => {
        navigator.clipboard.writeText('oyna.oldfinecraft.online').then(() => {
            // Toast
            clearTimeout(toastTimer);
            toast.classList.add('show');
            toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);


        });
    });
}


// ─── MOBILE MENU ─────────────────────────────────────────────
function initMobileMenu() {
    document.getElementById('hamburger-btn')?.addEventListener('click', () => {
        const isOpen = document.getElementById('mobile-drawer').classList.contains('open');
        isOpen ? closeMobileMenu() : openMobileMenu();
    });
    document.getElementById('mobile-overlay')?.addEventListener('click', closeMobileMenu);
}
function openMobileMenu() {
    document.getElementById('hamburger-btn').classList.add('open');
    document.getElementById('mobile-drawer').classList.add('open');
    document.getElementById('mobile-overlay').classList.add('open');
}
function closeMobileMenu() {
    document.getElementById('hamburger-btn')?.classList.remove('open');
    document.getElementById('mobile-drawer')?.classList.remove('open');
    document.getElementById('mobile-overlay')?.classList.remove('open');
}

// ─── AUTH TABS ───────────────────────────────────────────────
function initAuthTabs() {
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', () => switchAuthTab(tab.dataset.type));
    });
}

function switchAuthTab(type) {
    const tabs = document.querySelectorAll('.auth-tab');
    const registerFields = document.getElementById('register-fields');
    const titleBlock = document.getElementById('auth-title-block');

    tabs.forEach(t => {
        const active = t.dataset.type === type;
        t.classList.toggle('active', active);
    });

    if (registerFields) {
        registerFields.classList.toggle('hidden', type !== 'register');
    }

    // Beni hatırla sadece login'de görünsün
    const rememberRow = document.getElementById('remember-row');
    if (rememberRow) rememberRow.style.display = type === 'login' ? 'flex' : 'none';

    if (titleBlock) {
        if (type === 'register') {
            titleBlock.innerHTML = '<h2 class="text-lg font-bold text-white mb-1">Hesap Oluştur</h2><p class="text-xs text-white/40">Sunucuya katıl ve efsaneni yazmaya başla</p>';
        } else {
            titleBlock.innerHTML = '<h2 class="text-lg font-bold text-white mb-1">Tekrar hoş geldin</h2><p class="text-xs text-white/40">Hesabına giriş yap ve macerana devam et</p>';
        }
    }
}

// Submit: beni hatırla aktifse kullanıcı adını kaydet
document.addEventListener('click', e => {
    if (e.target.closest('.submit-btn-new') && rememberEnabled) {
        const userInput = document.querySelector('#auth-form input[type="text"]');
        if (userInput && userInput.value.trim()) {
            localStorage.setItem('ofc_remember', userInput.value.trim());
        }
    }
});

// ─── REMEMBER ME ─────────────────────────────────────────────
let rememberEnabled = false;

function initRememberMe() {
    // Kayıtlı kullanıcı adı varsa doldur
    const saved = localStorage.getItem('ofc_remember');
    if (saved) {
        rememberEnabled = true;
        const userInput = document.querySelector('#auth-form input[type="text"]');
        if (userInput) userInput.value = saved;
        const box = document.getElementById('remember-box');
        const check = document.getElementById('remember-check');
        if (box) box.classList.add('checked');
        if (check) check.classList.remove('hidden');
    }
}

window.toggleRemember = function() {
    rememberEnabled = !rememberEnabled;
    const box = document.getElementById('remember-box');
    const check = document.getElementById('remember-check');
    if (box) box.classList.toggle('checked', rememberEnabled);
    if (check) check.classList.toggle('hidden', !rememberEnabled);

    if (!rememberEnabled) {
        localStorage.removeItem('ofc_remember');
    }
};

// Kayıt ol sekmesinde "Beni Hatırla" satırını gizle
function updateRememberRow(type) {
    const row = document.getElementById('remember-row');
    if (row) row.style.display = type === 'login' ? 'flex' : 'none';
}

// ─── STORE ───────────────────────────────────────────────────
function injectStore() {
    const grid = document.getElementById('store-grid');
    if (!grid) return;
    grid.innerHTML = `
        <div class="col-span-1 md:col-span-3 flex items-center justify-center py-24 text-white/30 text-sm">
            Mağaza yakında açılacak...
        </div>
    `;
}
