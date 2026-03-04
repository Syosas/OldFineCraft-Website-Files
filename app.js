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
});

// ─── PAGE REVEAL (fade in from black on load/refresh) ───────
function initPageReveal() {
    const overlay = document.getElementById('page-overlay');
    overlay.classList.add('active');
    requestAnimationFrame(() => {
        setTimeout(() => {
            overlay.style.transition = 'opacity 0.55s ease';
            overlay.classList.remove('active');
        }, 60);
    });
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
            s.classList.remove('active');
            s.style.display = 'none';
        });

        // Show target
        const el = document.getElementById('view-' + target);
        if (el) {
            el.style.display = 'block';
            requestAnimationFrame(() => el.classList.add('active'));
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
            // Temporarily show underline on hovered (non-active) btn via CSS hover — already handled
            // But we need to suppress active underline visually while hovering another
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

            // Particle burst
            triggerStarBurst();
        });
    });
}

// ─── NEON FLASH BURST (copy effect) ─────────────────────────
function triggerStarBurst() {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.classList.add('burst-active');

    const DURATION = 3000;
    const start = performance.now();

    // Create 4-6 random flash points
    const flashes = Array.from({ length: 5 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        delay: Math.random() * 1800,
        duration: 600 + Math.random() * 600,
        maxSize: 80 + Math.random() * 140,
        born: null,
    }));

    function drawGeminiStar(ctx, x, y, size, alpha) {
        ctx.save();
        ctx.globalAlpha = alpha;

        // Outer soft glow
        const glow = ctx.createRadialGradient(x, y, 0, x, y, size * 1.8);
        glow.addColorStop(0, 'rgba(255,255,255,0.18)');
        glow.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, size * 1.8, 0, Math.PI * 2);
        ctx.fill();

        // 4-point star (Gemini style) - two elongated diamonds
        ctx.fillStyle = 'rgba(255,255,255,1)';

        // Vertical spike
        ctx.beginPath();
        ctx.moveTo(x, y - size);
        ctx.quadraticCurveTo(x + size * 0.08, y, x, y + size);
        ctx.quadraticCurveTo(x - size * 0.08, y, x, y - size);
        ctx.fill();

        // Horizontal spike
        ctx.beginPath();
        ctx.moveTo(x - size * 0.55, y);
        ctx.quadraticCurveTo(x, y + size * 0.08, x + size * 0.55, y);
        ctx.quadraticCurveTo(x, y - size * 0.08, x - size * 0.55, y);
        ctx.fill();

        // Bright core
        const core = ctx.createRadialGradient(x, y, 0, x, y, size * 0.15);
        core.addColorStop(0, 'rgba(255,255,255,1)');
        core.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = core;
        ctx.beginPath();
        ctx.arc(x, y, size * 0.15, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    function frame(ts) {
        const elapsed = ts - start;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let anyActive = false;

        flashes.forEach(f => {
            if (elapsed < f.delay) { anyActive = true; return; }
            if (!f.born) f.born = ts;

            const age = ts - f.born;
            if (age > f.duration) return;

            anyActive = true;
            const progress = age / f.duration;

            // Bell curve alpha: rises then fades
            let alpha;
            if (progress < 0.3) {
                alpha = progress / 0.3;
            } else if (progress < 0.6) {
                alpha = 1;
            } else {
                alpha = 1 - (progress - 0.6) / 0.4;
            }

            const size = f.maxSize * Math.sin(progress * Math.PI);
            drawGeminiStar(ctx, f.x, f.y, size, alpha);
        });

        if (elapsed < DURATION && anyActive) {
            requestAnimationFrame(frame);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.classList.remove('burst-active');
        }
    }

    requestAnimationFrame(frame);
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

    tabs.forEach(t => {
        const active = t.dataset.type === type;
        t.classList.toggle('active', active);
        t.style.color = active ? 'white' : 'rgba(255,255,255,0.5)';
    });

    if (registerFields) {
        registerFields.classList.toggle('hidden', type !== 'register');
    }
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
