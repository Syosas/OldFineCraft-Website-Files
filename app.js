import { createIcons, icons } from 'https://unpkg.com/lucide@latest/dist/esm/lucide.js';

// ─── LUCIDE ICONS ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) window.lucide.createIcons();
});

// ─── PAGE TRANSITION ───────────────────────────────────────
const overlay = document.getElementById('page-overlay');

function fadeOverlayOut() {
    overlay.style.opacity = '0';
}
function fadeOverlayIn(cb) {
    overlay.style.transition = 'opacity 0.25s ease';
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'all';
    setTimeout(() => {
        cb();
        setTimeout(() => {
            overlay.style.opacity = '0';
            overlay.style.pointerEvents = 'none';
        }, 60);
    }, 260);
}

// On load: fade in from black
window.addEventListener('load', () => {
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'none';
    requestAnimationFrame(() => {
        setTimeout(() => {
            overlay.style.transition = 'opacity 0.5s ease';
            overlay.style.opacity = '0';
        }, 80);
    });
    if (window.lucide) window.lucide.createIcons();
    initParticles();
    initNav();
    initCopyBtn();
    initMobileMenu();
    initAuthTabs();
    injectStore();
});

// ─── NAVIGATION ────────────────────────────────────────────
function initNav() {
    const allNavBtns = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.view-section');
    const navUnderlines = document.querySelectorAll('.nav-underline');

    function showView(target) {
        fadeOverlayIn(() => {
            sections.forEach(s => {
                s.classList.remove('active');
                s.style.display = 'none';
            });
            const el = document.getElementById('view-' + target);
            if (el) {
                el.style.display = 'block';
                requestAnimationFrame(() => el.classList.add('active'));
            }

            navUnderlines.forEach(b => {
                b.classList.toggle('active', b.dataset.target === target);
            });
        });
    }

    allNavBtns.forEach(btn => {
        const t = btn.dataset.target;
        if (!t) return;
        btn.addEventListener('click', () => {
            closeMobileMenu();
            showView(t);
        });
    });

    document.getElementById('nav-logo')?.addEventListener('click', () => showView('home'));
}

// ─── COPY IP BUTTON ─────────────────────────────────────────
function initCopyBtn() {
    const btn = document.getElementById('copy-ip-btn');
    const toast = document.getElementById('copy-toast');
    let toastTimer;

    btn?.addEventListener('click', () => {
        navigator.clipboard.writeText('oyna.oldfinecraft.online').then(() => {
            clearTimeout(toastTimer);
            toast.classList.add('show');
            toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
        });
    });
}

// ─── MOBILE MENU ────────────────────────────────────────────
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger-btn');
    const drawer = document.getElementById('mobile-drawer');
    const mobOverlay = document.getElementById('mobile-overlay');

    hamburger?.addEventListener('click', () => {
        const isOpen = drawer.classList.contains('open');
        isOpen ? closeMobileMenu() : openMobileMenu();
    });

    mobOverlay?.addEventListener('click', closeMobileMenu);
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

// ─── AUTH TABS ──────────────────────────────────────────────
function initAuthTabs() {
    const tabs = document.querySelectorAll('.auth-tab');
    const registerFields = document.getElementById('register-fields');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => {
                t.classList.remove('active');
                t.style.color = 'rgba(255,255,255,0.5)';
            });
            tab.classList.add('active');
            tab.style.color = 'white';
            if (registerFields) {
                registerFields.classList.toggle('hidden', tab.dataset.type !== 'register');
            }
        });
    });
}

// ─── STORE INJECT ───────────────────────────────────────────
function injectStore() {
    const grid = document.getElementById('store-grid');
    if (!grid) return;
    grid.innerHTML = `
        <div class="col-span-3 flex items-center justify-center py-24 text-white/30 text-sm">
            Mağaza yakında açılacak...
        </div>
    `;
}

// ─── PARTICLES ──────────────────────────────────────────────
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const PARTICLE_COUNT = 38;
    const particles = [];

    function resize() {
        const wrapper = canvas.parentElement;
        canvas.width = wrapper.offsetWidth;
        canvas.height = wrapper.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function randomX() { return Math.random() * canvas.width; }
    function randomStartY() { return -20 - Math.random() * 80; }
    function randomSize() { return 4 + Math.random() * 5; }
    function randomSpeed() { return 0.5 + Math.random() * 1.2; }
    function randomOpacity() { return 0.4 + Math.random() * 0.5; }
    function randomDrift() { return (Math.random() - 0.5) * 0.3; }

    // Draw a small star shape (4-pointed / cross)
    function drawStar(ctx, x, y, size, rotation) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.beginPath();
        const arm = size / 2;
        const thin = size / 6;
        // Horizontal bar
        ctx.moveTo(-arm, -thin);
        ctx.lineTo(-arm, thin);
        ctx.lineTo(-thin, thin);
        ctx.lineTo(-thin, arm);
        ctx.lineTo(thin, arm);
        ctx.lineTo(thin, thin);
        ctx.lineTo(arm, thin);
        ctx.lineTo(arm, -thin);
        ctx.lineTo(thin, -thin);
        ctx.lineTo(thin, -arm);
        ctx.lineTo(-thin, -arm);
        ctx.lineTo(-thin, -thin);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
            x: randomX(),
            y: randomStartY() - Math.random() * canvas.height, // spread initial
            size: randomSize(),
            speed: randomSpeed(),
            opacity: randomOpacity(),
            drift: randomDrift(),
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.03,
        });
    }

    let lastTime = 0;
    function animate(ts) {
        const dt = Math.min((ts - lastTime) / 16.67, 3); // cap
        lastTime = ts;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.y += p.speed * dt;
            p.x += p.drift * dt;
            p.rotation += p.rotationSpeed * dt;

            if (p.y > canvas.height + 20) {
                p.y = randomStartY();
                p.x = randomX();
                p.speed = randomSpeed();
                p.opacity = randomOpacity();
                p.drift = randomDrift();
                p.size = randomSize();
            }

            ctx.globalAlpha = p.opacity;
            ctx.fillStyle = '#ffffff';
            drawStar(ctx, p.x, p.y, p.size, p.rotation);
        });

        ctx.globalAlpha = 1;
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}
