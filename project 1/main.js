'use strict';

/* ══════════════════════════════════════
   CUSTOM CURSOR
══════════════════════════════════════ */
(function setupCursor() {
    const dot   = document.getElementById('cursor');
    const trail = document.getElementById('cursor-trail');
    if (!dot || !trail) return;

    let tx = 0, ty = 0;
    document.addEventListener('mousemove', e => {
        tx = e.clientX; ty = e.clientY;
        dot.style.left = tx + 'px';
        dot.style.top  = ty + 'px';
        trail.style.left = tx + 'px';
        trail.style.top  = ty + 'px';
    });

    document.addEventListener('mousedown', () => dot.style.transform = 'translate(-50%,-50%) scale(0.6)');
    document.addEventListener('mouseup',   () => dot.style.transform = 'translate(-50%,-50%) scale(1)');

    // Grow on hoverable elements
    document.querySelectorAll('a,button,.glow-card,.project-card,.tech-icon-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            dot.style.transform   = 'translate(-50%,-50%) scale(2)';
            dot.style.background  = '#06b6d4';
            trail.style.borderColor = 'rgba(6,182,212,0.6)';
        });
        el.addEventListener('mouseleave', () => {
            dot.style.transform   = 'translate(-50%,-50%) scale(1)';
            dot.style.background  = '#8b5cf6';
            trail.style.borderColor = 'rgba(139,92,246,0.5)';
        });
    });
})();


/* ══════════════════════════════════════
   SCROLL PROGRESS BAR
══════════════════════════════════════ */
(function setupProgress() {
    const bar = document.getElementById('progress-bar');
    if (!bar) return;
    window.addEventListener('scroll', () => {
        const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        bar.style.width = pct + '%';
    }, { passive: true });
})();


/* ══════════════════════════════════════
   PARTICLE CANVAS
══════════════════════════════════════ */
(function setupParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const COLORS = ['rgba(139,92,246,', 'rgba(6,182,212,', 'rgba(236,72,153,'];
    const COUNT  = 70;

    const particles = Array.from({ length: COUNT }, () => ({
        x:  Math.random() * window.innerWidth,
        y:  Math.random() * window.innerHeight,
        r:  Math.random() * 1.6 + 0.4,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        col: COLORS[Math.floor(Math.random() * COLORS.length)],
        op: Math.random() * 0.5 + 0.15,
    }));

    function drawLine(a, b, dist, maxDist) {
        const alpha = (1 - dist / maxDist) * 0.18;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(139,92,246,${alpha})`;
        ctx.lineWidth   = 0.6;
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
    }

    function tick() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const W = canvas.width, H = canvas.height;
        const MAX = 130;

        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
            if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.col + p.op + ')';
            ctx.fill();
        });

        // Connect nearby particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const d  = Math.sqrt(dx * dx + dy * dy);
                if (d < MAX) drawLine(particles[i], particles[j], d, MAX);
            }
        }

        requestAnimationFrame(tick);
    }
    tick();
})();


/* ══════════════════════════════════════
   TYPING ANIMATION
══════════════════════════════════════ */
(function setupTyping() {
    const el = document.getElementById('typed-text');
    if (!el) return;

    const phrases = [
        'Software Engineer',
        'Backend & IoT Developer',
        'Python · Elixir Engineer',
        'Cloud & DevOps Enthusiast',
        'AI Automation Builder',
    ];

    let pi = 0, ci = 0, del = false;

    function tick() {
        const cur = phrases[pi];
        if (!del) {
            el.textContent = cur.slice(0, ++ci);
            if (ci === cur.length) { del = true; setTimeout(tick, 1800); return; }
        } else {
            el.textContent = cur.slice(0, --ci);
            if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; }
        }
        setTimeout(tick, del ? 48 : 82);
    }
    tick();
})();


/* ══════════════════════════════════════
   SKILL CIRCLES
══════════════════════════════════════ */
const SKILLS = [
    { name: 'Python',     pct: 90, color: '#10b981', glow: '#10b981' },
    { name: 'Elixir',     pct: 80, color: '#a855f7', glow: '#a855f7' },
    { name: 'JavaScript', pct: 83, color: '#f59e0b', glow: '#f59e0b' },
    { name: 'AWS',        pct: 78, color: '#f97316', glow: '#f97316' },
    { name: 'Docker',     pct: 82, color: '#3b82f6', glow: '#3b82f6' },
    { name: 'DSA',        pct: 75, color: '#ec4899', glow: '#ec4899' },
];

function buildSkills() {
    const grid = document.getElementById('skills-grid');
    if (!grid) return;

    SKILLS.forEach(({ name, pct, color, glow }, i) => {
        const offset = +(283 * (1 - pct / 100)).toFixed(1);
        const div = document.createElement('div');
        div.className = 'flex flex-col items-center reveal';
        div.style.transitionDelay = `${i * 0.09}s`;
        div.dataset.skillOffset   = offset;
        div.dataset.ringIdx       = i;
        div.innerHTML = `
        <div style="position:relative;width:82px;height:82px;">
            <svg width="82" height="82" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" stroke="rgba(255,255,255,0.06)" stroke-width="8" fill="none"/>
                <circle cx="50" cy="50" r="45" stroke="${color}" stroke-width="8" fill="none"
                    stroke-dasharray="283" stroke-dashoffset="283"
                    stroke-linecap="round"
                    class="skill-ring" id="ring-${i}"
                    style="filter:drop-shadow(0 0 5px ${glow});"/>
            </svg>
            <span style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:0.9rem;font-weight:700;color:#e2e8f0;font-family:'Fira Code',monospace;">${pct}%</span>
        </div>
        <span style="margin-top:8px;font-size:0.7rem;font-weight:600;color:#64748b;">${name}</span>`;
        grid.appendChild(div);
    });
}


/* ══════════════════════════════════════
   INTERSECTION OBSERVER — reveal + rings + counters
══════════════════════════════════════ */
function setupObservers() {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            e.target.classList.add('visible');

            // Skill ring
            const off = e.target.dataset.skillOffset;
            const idx = e.target.dataset.ringIdx;
            if (off !== undefined && idx !== undefined) {
                setTimeout(() => {
                    const ring = document.getElementById(`ring-${idx}`);
                    if (ring) ring.style.strokeDashoffset = off;
                }, 150);
            }

            // Counters
            e.target.querySelectorAll('[data-count]').forEach(animateCounter);

            obs.unobserve(e.target);
        });
    }, { threshold: 0.18 });

    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

function animateCounter(el) {
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || '';
    const dur    = 1600;
    const start  = performance.now();

    function step(now) {
        const progress = Math.min((now - start) / dur, 1);
        const ease     = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(ease * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}


/* ══════════════════════════════════════
   3D CARD TILT
══════════════════════════════════════ */
function setupTilt() {
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const { left, top, width, height } = card.getBoundingClientRect();
            const x = (e.clientX - left - width  / 2) / (width  / 2);
            const y = (e.clientY - top  - height / 2) / (height / 2);
            card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateZ(4px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) translateZ(0)';
            card.style.transition = 'transform 0.5s ease';
        });
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.1s ease';
        });
    });
}


/* ══════════════════════════════════════
   ACTIVE NAV
══════════════════════════════════════ */
function setupActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const links    = document.querySelectorAll('nav a.nav-link');

    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            links.forEach(l => l.classList.remove('active'));
            const m = [...links].find(l => l.getAttribute('href') === `#${e.target.id}`);
            if (m) m.classList.add('active');
        });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(s => obs.observe(s));
}


/* ══════════════════════════════════════
   HAMBURGER
══════════════════════════════════════ */
function setupHamburger() {
    const btn  = document.getElementById('hamburger');
    const menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;

    const [h1, h2, h3] = ['hb1','hb2','hb3'].map(id => document.getElementById(id));

    btn.addEventListener('click', () => {
        const open = menu.classList.toggle('open');
        if (h1) h1.style.transform = open ? 'translateY(8px) rotate(45deg)' : '';
        if (h2) h2.style.opacity   = open ? '0' : '1';
        if (h3) h3.style.transform = open ? 'translateY(-8px) rotate(-45deg)' : '';
    });

    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        menu.classList.remove('open');
        if (h1) h1.style.transform = '';
        if (h2) h2.style.opacity   = '1';
        if (h3) h3.style.transform = '';
    }));
}


/* ══════════════════════════════════════
   BACK TO TOP
══════════════════════════════════════ */
function setupBackTop() {
    const btn = document.getElementById('back-top');
    if (!btn) return;
    window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY > 400), { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}


/* ══════════════════════════════════════
   CONTACT FORM  (powered by Formsubmit.co)
   No account or API key needed.
   First submission → verification email arrives
   in sanjaykumarr99009@gmail.com → click Activate
   → every future submission lands in Gmail.
══════════════════════════════════════ */
function setupContactForm() {
    const form      = document.getElementById('contact-form');
    const status    = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');
    const btnText   = document.getElementById('btn-text');
    const spinner   = document.getElementById('btn-spinner');
    if (!form || !status) return;

    const ENDPOINT = 'https://formsubmit.co/ajax/sanjaykumarr99009@gmail.com';

    form.addEventListener('submit', async e => {
        e.preventDefault();

        const name    = document.getElementById('f-name').value.trim();
        const email   = document.getElementById('f-email').value.trim();
        const subject = document.getElementById('f-subject').value.trim();
        const message = document.getElementById('f-message').value.trim();

        if (!name || !email || !message) {
            showStatus('// please fill in all required fields (*)', 'error'); return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showStatus('// invalid email address', 'error'); return;
        }

        setLoading(true);

        let sent = false;

        // Try Formsubmit (works when site is hosted / activated)
        try {
            const res = await fetch(ENDPOINT, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    message,
                    _replyto:  email,
                    _subject:  `Portfolio — ${subject || 'New message from ' + name}`,
                    _captcha:  'false',
                    _template: 'table',
                }),
            });
            const data = await res.json();
            if (data.success === 'true' || data.success === true) sent = true;
        } catch (_) {
            // Network / CORS — fall through to mailto
        }

        if (sent) {
            showStatus("// message sent! I'll get back to you soon ✓", 'success');
            form.reset();
        } else {
            // Guaranteed fallback — open email client with form pre-filled
            const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
            const mailto = `mailto:sanjaykumarr99009@gmail.com`
                + `?subject=${encodeURIComponent('Portfolio: ' + (subject || 'New message from ' + name))}`
                + `&body=${encodeURIComponent(body)}`;
            window.open(mailto, '_blank');
            showStatus('// your email client opened with the message pre-filled — just hit Send ✓', 'success');
            form.reset();
        }

        setLoading(false);
    });

    function setLoading(on) {
        submitBtn.disabled      = on;
        btnText.textContent     = on ? 'Sending...' : 'Send Message ✉';
        spinner.classList.toggle('hidden', !on);
        submitBtn.style.opacity = on ? '0.7' : '1';
    }

    function showStatus(msg, type) {
        const map = {
            success: { color: '#6ee7b7', border: 'rgba(16,185,129,0.3)',  bg: 'rgba(16,185,129,0.08)' },
            error:   { color: '#fca5a5', border: 'rgba(239,68,68,0.3)',   bg: 'rgba(239,68,68,0.08)'  },
        };
        const s = map[type] || map.error;
        status.textContent       = msg;
        status.style.color       = s.color;
        status.style.borderColor = s.border;
        status.style.background  = s.bg;
        status.classList.remove('hidden');
        setTimeout(() => status.classList.add('hidden'), 6000);
    }
}


/* ══════════════════════════════════════
   INIT
══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
    buildSkills();
    setupObservers();
    setupActiveNav();
    setupHamburger();
    setupBackTop();
    setupContactForm();
    setupTilt();
});
