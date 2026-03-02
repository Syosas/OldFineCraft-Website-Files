// ─── INIT ──────────────────────────────────────────────────
window.addEventListener('load', () => {
    if (window.lucide) window.lucide.createIcons();
    initPageReveal();
    initNav();
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

        // Scroll to section in info view
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
        const isActive = sameTarget && (target !== 'info' || sameScroll);
        btn.classList.toggle('active', isActive);
        btn.style.color = isActive ? 'white' : '';
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

// ─── STAR BURST (only on copy) ───────────────────────────────
function triggerStarBurst() {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.classList.add('burst-active');

    const COUNT = 55;
    const DURATION = 3000; // ms
    const start = performance.now();

    const particles = Array.from({ length: COUNT }, () => ({
        x: Math.random() * canvas.width,
        y: -10 - Math.random() * 60,
        size: 5 + Math.random() * 7,
        speed: 2.5 + Math.random() * 4,
        drift: (Math.random() - 0.5) * 1.2,
        rotation: Math.random() * Math.PI * 2,
        rotSp: (Math.random() - 0.5) * 0.08,
        delay: Math.random() * 800, // stagger start
    }));

    function drawStar(ctx, x, y, size, rot) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rot);
        const arm = size / 2;
        const thin = size / 6;
        ctx.beginPath();
        ctx.moveTo(-arm, -thin); ctx.lineTo(-arm, thin);
        ctx.lineTo(-thin, thin); ctx.lineTo(-thin, arm);
        ctx.lineTo(thin, arm);  ctx.lineTo(thin, thin);
        ctx.lineTo(arm, thin);  ctx.lineTo(arm, -thin);
        ctx.lineTo(thin, -thin);ctx.lineTo(thin, -arm);
        ctx.lineTo(-thin, -arm);ctx.lineTo(-thin, -thin);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    let lastTs = null;

    function frame(ts) {
        if (!lastTs) lastTs = ts;
        const elapsed = ts - start;
        const dt = Math.min((ts - lastTs) / 16.67, 3);
        lastTs = ts;

        // Global fade out in last 30% of duration
        const progress = elapsed / DURATION;
        const globalAlpha = progress > 0.7 ? 1 - (progress - 0.7) / 0.3 : 1;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            if (elapsed < p.delay) return;

            p.y += p.speed * dt;
            p.x += p.drift * dt;
            p.rotation += p.rotSp * dt;

            // Individual brightness (bright at start, fade with progress)
            const alpha = globalAlpha * (0.6 + 0.4 * Math.random()); // shimmer

            ctx.globalAlpha = alpha;
            ctx.fillStyle = '#ffffff';
            drawStar(ctx, p.x, p.y, p.size, p.rotation);
        });

        ctx.globalAlpha = 1;

        if (elapsed < DURATION) {
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
