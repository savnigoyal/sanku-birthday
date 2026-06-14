const birthday = new Date("June 26, 2026 00:00:00").getTime();

const daysValue = document.getElementById("daysValue");
const hoursValue = document.getElementById("hoursValue");
const minsValue = document.getElementById("minsValue");
const secsValue = document.getElementById("secsValue");
const surpriseBtn = document.getElementById("surpriseBtn");
const surpriseModal = document.getElementById("surpriseModal");
const closeModalBtn = document.getElementById("closeModalBtn");

let audioContext;
let musicPlayed = false;

const birthdaySong = [
    { freq: 264, duration: 0.4 },
    { freq: 264, duration: 0.4 },
    { freq: 297, duration: 0.8 },
    { freq: 264, duration: 0.8 },
    { freq: 352, duration: 0.8 },
    { freq: 330, duration: 1.6 },
    { freq: 264, duration: 0.4 },
    { freq: 264, duration: 0.4 },
    { freq: 297, duration: 0.8 },
    { freq: 264, duration: 0.8 },
    { freq: 396, duration: 0.8 },
    { freq: 352, duration: 1.6 },
    { freq: 264, duration: 0.4 },
    { freq: 264, duration: 0.4 },
    { freq: 528, duration: 0.8 },
    { freq: 440, duration: 0.8 },
    { freq: 352, duration: 0.8 },
    { freq: 330, duration: 0.8 },
    { freq: 297, duration: 1.6 },
    { freq: 466, duration: 0.4 },
    { freq: 466, duration: 0.4 },
    { freq: 440, duration: 0.8 },
    { freq: 352, duration: 0.8 },
    { freq: 396, duration: 0.8 },
    { freq: 352, duration: 1.6 }
];

function playNote(freq, startTime, duration) {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.frequency.setValueAtTime(freq, startTime);
    osc.type = 'sine';

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.07, startTime + 0.02);
    gain.gain.linearRampToValueAtTime(0, startTime + duration - 0.02);

    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
}

function playBirthdayMusic() {
    if (musicPlayed) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    audioContext = new AudioContext();
    const startTime = audioContext.currentTime + 0.1;
    let cursor = startTime;

    birthdaySong.forEach(note => {
        playNote(note.freq, cursor, note.duration);
        cursor += note.duration;
    });

    musicPlayed = true;
}

function tryAutoplayMusic() {
    try {
        playBirthdayMusic();
    } catch (error) {
        // Autoplay may be blocked; music will start on interaction.
    }
}

document.body.addEventListener('click', () => {
    playBirthdayMusic();
}, { once: true });

const heartBackground = document.getElementById('heartBackground');
let heartbeatSyncTimer = null;

function showSurprise() {
    surpriseModal.classList.remove('hidden');
    createBackgroundHearts();
}

function hideSurprise() {
    surpriseModal.classList.add('hidden');
}

function createBackgroundHearts() {
    if (!heartBackground || heartBackground.dataset.created) return;
+    const colors = ['#ff657f', '#ff9fb7', '#ffccd9', '#e0355b', '#ff3c79'];
+    const total = 42;
+    for (let i = 0; i < total; i++) {
+        const heart = document.createElement('div');
+        heart.className = 'bg-heart';
+        const isFloating = Math.random() > 0.42;
+        if (isFloating) heart.classList.add('floating');
+        const size = 14 + Math.random() * 48;
+        const left = Math.random() * 100;
+        const top = 4 + Math.random() * 84;
+        const opacity = 0.12 + Math.random() * 0.45;
+        const beatDuration = 1 + Math.random() * 0.45;
+        const floatDuration = 10 + Math.random() * 10;
+        const floatDelay = Math.random() * 5;
+        const beatDelay = Math.random() * 1.5;
+        const blur = isFloating ? (1.2 + Math.random() * 2.8).toFixed(2) : (Math.random() * 1.1).toFixed(2);
+        const color = colors[Math.floor(Math.random() * colors.length)];
+        heart.style.left = `${left}%`;
+        heart.style.top = `${top}%`;
+        heart.style.fontSize = `${size}px`;
+        heart.style.opacity = opacity;
+        heart.style.color = color;
+        heart.style.filter = `blur(${blur}px)`;
+        heart.style.setProperty('--beat', `${beatDuration}s`);
+        heart.style.setProperty('--floatDur', `${floatDuration}s`);
+        heart.style.setProperty('--scale', `${0.92 + Math.random() * 0.18}`);
+        heart.style.animationDelay = `${beatDelay}s${isFloating ? `, ${floatDelay}s` : ''}`;
+        heart.textContent = '❤';
+        heartBackground.appendChild(heart);
+    }
+    heartBackground.dataset.created = 'true';
+    heartbeatSyncTimer = setInterval(() => {
+        const hearts = heartBackground.querySelectorAll('.bg-heart');
+        hearts.forEach(h => h.classList.add('sync-pulse'));
+        setTimeout(() => hearts.forEach(h => h.classList.remove('sync-pulse')), 320);
+    }, 3000);
 }
*** End Patch
function checkSurpriseAvailability() {
    surpriseBtn.disabled = false;
    surpriseBtn.classList.remove('disabled');
}

surpriseBtn.addEventListener('click', () => {
    startCelebrationSequence();
});

// --- Celebration sequence: confetti, floating emojis, burst, pop sound, reveal ---
const confettiCanvas = document.getElementById('confettiCanvas');
const floatingEmojisContainer = document.getElementById('floatingEmojis');
let confettiRAF = null;

function playPopSound() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const now = ctx.currentTime;
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'triangle';
        o.frequency.setValueAtTime(800, now);
        o.frequency.exponentialRampToValueAtTime(200, now + 0.12);
        g.gain.setValueAtTime(0, now);
        g.gain.linearRampToValueAtTime(0.12, now + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        o.connect(g); g.connect(ctx.destination);
        o.start(now); o.stop(now + 0.2);
    } catch (e) {
        // ignore
    }
}

function runConfetti(duration = 4500) {
    if (!confettiCanvas) return;
    const ctx = confettiCanvas.getContext('2d');
    let w = confettiCanvas.width = window.innerWidth;
    let h = confettiCanvas.height = window.innerHeight;
    confettiCanvas.style.display = 'block';

    const colors = ['#ff4c78', '#ffb6c1', '#ffffff', '#d4af37'];
    const total = Math.floor(Math.min(160, w / 6));
    const particles = [];
    for (let i = 0; i < total; i++) {
        particles.push({
            x: Math.random() * w,
            y: -Math.random() * h * 0.5,
            size: 6 + Math.random() * 10,
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: Math.random() * Math.PI * 2,
            speed: 1 + Math.random() * 3,
            swing: 0.02 + Math.random() * 0.04,
            rotation: Math.random() * 360
        });
    }

    const start = performance.now();
    function resize() { w = confettiCanvas.width = window.innerWidth; h = confettiCanvas.height = window.innerHeight; }
    window.addEventListener('resize', resize);

    function frame(now) {
        ctx.clearRect(0,0,w,h);
        const t = (now - start) / 1000;
        for (let p of particles) {
            p.y += 60 * p.speed * 0.016;
            p.x += Math.sin(p.tilt + t * p.swing * 60) * (6 * p.speed * 0.016);
            p.rotation += p.speed * 6;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation * Math.PI / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size * 0.6);
            ctx.restore();
        }
        confettiRAF = requestAnimationFrame(frame);
    }
    confettiRAF = requestAnimationFrame(frame);

    setTimeout(() => {
        cancelAnimationFrame(confettiRAF);
        ctx.clearRect(0,0,w,h);
        confettiCanvas.style.display = 'none';
        window.removeEventListener('resize', resize);
    }, duration);
}

function createFloatingEmojis() {
    if (!floatingEmojisContainer) return;
    const types = ['❤️','🎈','🎂'];
    const total = 20;
    for (let i = 0; i < total; i++) {
        setTimeout(() => {
            const el = document.createElement('div');
            el.className = 'floating-emoji';
            el.style.left = (5 + Math.random() * 90) + '%';
            el.style.fontSize = (14 + Math.random() * 28) + 'px';
            el.textContent = types[Math.floor(Math.random() * types.length)];
            floatingEmojisContainer.appendChild(el);
            el.addEventListener('animationend', () => el.remove());
        }, i * 120);
    }
}

function createBurst() {
    const burst = document.createElement('div');
    burst.className = 'celebration-burst burst-animate';
    document.body.appendChild(burst);
    setTimeout(() => burst.remove(), 900);
}

function revealImageAndText() {
    const img = document.querySelector('.surprise-image-photo');
    if (!img) return;
    img.classList.remove('hidden-reveal');
}

function startCelebrationSequence() {
    // Show cinematic overlay and enter glass-breaking scene
    surpriseBtn.disabled = true;
    playPopSound();
    // prepare image to stay hidden until we shatter the glass
    const img = document.querySelector('.surprise-image-photo');
    if (img) {
        // force immediate hide (no transition) to avoid flash
        img.setAttribute('data-hidden-until-shatter', '');
        img.style.filter = 'blur(2px) brightness(0.96)';
    }
    // show modal overlay after image is hidden
    showSurprise();

    // initialize glass interactions and show glass elements
    initGlassScene();
}

// --- Glass breaking logic ---
const glassCanvas = document.getElementById('glassCanvas');
const hammerFollower = document.getElementById('hammerFollower');
const glassInstruction = document.getElementById('glassInstruction');
let glassCtx = null;
let glassVisible = false;
let crackCount = 0;
const crackThreshold = 5;
let glassFrame = null;

function initGlassScene() {
    if (!glassCanvas) return;
    glassCtx = glassCanvas.getContext('2d');
    const frame = document.querySelector('.surprise-image-frame');
    function resizeCanvas() {
        const rect = frame.getBoundingClientRect();
        glassFrame = frame;
        // canvas is positioned absolutely inside the frame — size to match frame
        glassCanvas.width = Math.max(1, Math.floor(rect.width));
        glassCanvas.height = Math.max(1, Math.floor(rect.height));
        glassCanvas.style.left = '0px';
        glassCanvas.style.top = '0px';
        glassCanvas.style.width = rect.width + 'px';
        glassCanvas.style.height = rect.height + 'px';
        // initialize hammer in center of frame so it doesn't appear stuck top-left (relative coords)
        if (hammerFollower) {
            hammerFollower.style.left = (rect.width / 2) + 'px';
            hammerFollower.style.top = (rect.height / 2) + 'px';
        }
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // show glass UI
    document.body.classList.add('glass-visible');
    glassVisible = true;

    // position hammer follower
    document.addEventListener('mousemove', onMouseMoveWhileGlass);
    hammerFollower.style.display = 'grid';

    // clear any prior cracks
    glassCtx.clearRect(0,0,glassCanvas.width, glassCanvas.height);
    drawGlassSurface();

    // listen for clicks on the canvas to create cracks
    glassCanvas.addEventListener('click', handleGlassClick);
}

function drawGlassSurface() {
    if (!glassCtx) return;
    const w = glassCanvas.width, h = glassCanvas.height;
    glassCtx.clearRect(0,0,w,h);
    // subtle frosted gloss
    const grad = glassCtx.createLinearGradient(0,0,w, h);
    grad.addColorStop(0, 'rgba(255,255,255,0.04)');
    grad.addColorStop(0.5, 'rgba(255,255,255,0.02)');
    grad.addColorStop(1, 'rgba(255,255,255,0.01)');
    // very subtle glass wash (almost transparent) to avoid color shift
    glassCtx.fillStyle = 'rgba(255,255,255,0.02)';
    glassCtx.fillRect(0,0,w,h);
    // sheen
    glassCtx.fillStyle = grad;
    glassCtx.fillRect(0,0,w, Math.max(18, h * 0.06));
}

function onMouseMoveWhileGlass(e) {
    if (!glassVisible || !glassFrame) return;
    const rect = glassFrame.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // clamp inside frame bounds
    const cx = Math.max(0, Math.min(rect.width, x));
    const cy = Math.max(0, Math.min(rect.height, y));
    hammerFollower.style.left = (cx) + 'px';
    hammerFollower.style.top = (cy) + 'px';
    hammerFollower.style.transform = 'translate(-50%,-50%) rotate(-18deg)';
}

function handleGlassClick(e) {
    if (!glassCtx) return;
    const rect = glassCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    drawCrack(x, y);
    playCrackSound();
    crackCount++;
    if (crackCount >= crackThreshold) {
        // small delay to let last crack render
        setTimeout(() => shatterGlass(), 350);
    }
}

function drawCrack(cx, cy) {
    if (!glassCtx) return;
    const ctx = glassCtx;
    const w = glassCanvas.width, h = glassCanvas.height;
    const branches = 6 + Math.floor(Math.random() * 5);
    ctx.strokeStyle = 'rgba(255,255,255,0.85)';
    ctx.lineWidth = 1.2 + Math.random() * 1.6;
    ctx.lineCap = 'round';
    for (let i = 0; i < branches; i++) {
        let angle = (Math.PI * 2) * (i / branches) + (Math.random() - 0.5) * 0.6;
        let len = (Math.min(w,h) * (0.18 + Math.random() * 0.26));
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        let px = cx, py = cy;
        const segments = 6 + Math.floor(Math.random() * 5);
        for (let s = 0; s < segments; s++) {
            const t = s / segments;
            const nx = px + Math.cos(angle + (Math.random() - 0.5) * 0.6) * (len * (0.18 + Math.random() * 0.3));
            const ny = py + Math.sin(angle + (Math.random() - 0.5) * 0.6) * (len * (0.18 + Math.random() * 0.3));
            ctx.lineTo(nx, ny);
            px = nx; py = ny;
            if (Math.random() < 0.18) {
                // small branch
                ctx.moveTo(px, py);
                ctx.lineTo(px + (Math.random()-0.5)*18, py + (Math.random()-0.5)*18);
            }
        }
        ctx.stroke();
    }
    // small radial highlight at impact
    const rg = ctx.createRadialGradient(cx, cy, 2, cx, cy, Math.max(18, Math.min(w,h)*0.06));
    rg.addColorStop(0, 'rgba(255,255,255,0.85)');
    rg.addColorStop(1, 'rgba(255,255,255,0.0)');
    ctx.fillStyle = rg;
    ctx.fillRect(cx - 60, cy - 60, 120, 120);
}

function playCrackSound() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const now = ctx.currentTime;
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'square';
        o.frequency.setValueAtTime(1200 + Math.random()*200, now);
        o.frequency.exponentialRampToValueAtTime(300 + Math.random()*200, now + 0.22);
        g.gain.setValueAtTime(0, now);
        g.gain.linearRampToValueAtTime(0.16, now + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        o.connect(g); g.connect(ctx.destination);
        o.start(now); o.stop(now + 0.35);
    } catch (e) { }
}

function shatterGlass() {
    if (!glassCtx) return;
    const ctx = glassCtx;
    const w = glassCanvas.width, h = glassCanvas.height;
    // prepare shards grid
    const cols = 10, rows = 6;
    const shardW = Math.ceil(w / cols), shardH = Math.ceil(h / rows);
    const shards = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const x = c * shardW; const y = r * shardH;
            const cx = x + shardW/2; const cy = y + shardH/2;
            const angle = Math.atan2(cy - h/2, cx - w/2);
            const speed = 220 + Math.random() * 240;
            shards.push({ x, y, w: shardW, h: shardH, cx, cy, vx: Math.cos(angle) * (speed * (0.6 + Math.random()*0.8)), vy: Math.sin(angle) * (speed * (0.6 + Math.random()*0.8)) - 60, rot: Math.random()*360, vr: (Math.random()-0.5)*10 });
        }
    }

    // animate shards for ~1200ms
    const start = performance.now();
    function frame(now) {
        const t = (now - start) / 1000;
        ctx.clearRect(0,0,w,h);
        // draw remaining cracks dimmed
        drawGlassSurface();
        ctx.globalCompositeOperation = 'source-over';
        for (let s of shards) {
            const dt = t;
            const x = s.x + s.vx * dt;
            const y = s.y + (s.vy * dt + 80 * dt * dt);
            const rot = s.rot + s.vr * dt * 30;
            ctx.save();
            ctx.translate(x + s.w/2, y + s.h/2);
            ctx.rotate(rot * Math.PI/180);
            // glass piece: translucent with slight sheen
            const g = ctx.createLinearGradient(-s.w/2, -s.h/2, s.w/2, s.h/2);
            g.addColorStop(0, 'rgba(255,255,255,0.85)');
            g.addColorStop(1, 'rgba(255,255,255,0.55)');
            ctx.fillStyle = 'rgba(255,255,255,0.85)';
            ctx.globalAlpha = 0.95 - Math.min(0.9, dt*1.2);
            ctx.fillRect(-s.w/2, -s.h/2, s.w, s.h);
            ctx.restore();
        }
        if (t < 1.2) {
            requestAnimationFrame(frame);
        } else {
            // done, clear glass and hide UI
            ctx.clearRect(0,0,w,h);
            document.body.classList.remove('glass-visible');
            glassVisible = false;
            hammerFollower.style.display = 'none';
            glassCanvas.style.display = 'none';
            if (document.querySelector('.surprise-image-photo')) {
                const img = document.querySelector('.surprise-image-photo');
                img.style.filter = '';
                img.classList.remove('hidden-reveal');
                img.removeAttribute('data-hidden-until-shatter');
            }
            // start celebration effects
            runConfetti(4800);
            createFloatingEmojis();
            createBurst();
            // reveal text after a short delay
            setTimeout(() => {
                // ensure surprise copy fades in (CSS handles per-line delays)
                const copy = document.querySelector('.surprise-copy');
                if (copy) copy.querySelectorAll('h2, .surprise-text')[0];
            }, 240);
            // re-enable button later
            setTimeout(() => { surpriseBtn.disabled = false; }, 5200);
        }
    }
    // play big shatter sound
    playCrackSound();
    requestAnimationFrame(frame);
}

closeModalBtn.addEventListener('click', hideSurprise);
window.addEventListener('click', event => {
    if (event.target === surpriseModal) {
        hideSurprise();
    }
});

window.addEventListener('load', () => {
    tryAutoplayMusic();
    checkSurpriseAvailability();
});

function updateCountdown() {
    const now = Date.now();
    const distance = birthday - now;

    const days = Math.max(0, Math.floor(distance / (1000 * 60 * 60 * 24)));
    const hours = Math.max(0, Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    const mins = Math.max(0, Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
    const secs = Math.max(0, Math.floor((distance % (1000 * 60)) / 1000));

    daysValue.textContent = String(days).padStart(2, '0');
    hoursValue.textContent = String(hours).padStart(2, '0');
    minsValue.textContent = String(mins).padStart(2, '0');
    secsValue.textContent = String(secs).padStart(2, '0');
}

updateCountdown();
setInterval(() => {
    updateCountdown();
    checkSurpriseAvailability();
}, 1000);