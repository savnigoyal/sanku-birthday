const birthday = new Date("June 26, 2026 00:00:00").getTime();

const daysValue = document.getElementById("daysValue");
const hoursValue = document.getElementById("hoursValue");
const minsValue = document.getElementById("minsValue");
const secsValue = document.getElementById("secsValue");
const surpriseBtn = document.getElementById("surpriseBtn");
const surpriseModal = document.getElementById("surpriseModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const birthdayAudio = document.getElementById("birthdayMusic");
const musicControlBtn = document.getElementById("musicControlBtn");

let audioContext;
let musicPlayed = false;
let birthdayAudioLoaded = false;
let birthdayAudioFadeInterval = null;
let birthdayReached = false;
let birthdayIntroPlayed = false;

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

function loadBirthdayAudio() {
    if (birthdayAudioLoaded || !birthdayAudio) return;
    const blob = createHappyBirthdayWav();
    const url = URL.createObjectURL(blob);
    birthdayAudio.src = url;
    birthdayAudio.loop = true;
    birthdayAudio.volume = 0;
    birthdayAudioLoaded = true;
}

function playBirthdayMusic() {
    if (!birthdayAudio) return;
    loadBirthdayAudio();
    if (birthdayAudio.paused) {
        birthdayAudio.play().catch(() => {});
    }
    fadeAudioVolume(0.02, 0.68, 2400);
    musicPlayed = true;
    updateMusicButton();
}

function pauseBirthdayMusic() {
    if (!birthdayAudio) return;
    clearInterval(birthdayAudioFadeInterval);
    birthdayAudio.pause();
    updateMusicButton();
}

function toggleBirthdayMusic() {
    if (!birthdayAudio) return;
    if (birthdayAudio.paused) {
        playBirthdayMusic();
    } else {
        pauseBirthdayMusic();
    }
}

function fadeAudioVolume(start, end, duration) {
    if (!birthdayAudio) return;
    clearInterval(birthdayAudioFadeInterval);
    birthdayAudio.volume = start;
    const stepTime = 60;
    const steps = Math.max(1, Math.floor(duration / stepTime));
    const volumeStep = (end - start) / steps;
    let currentStep = 0;
    birthdayAudioFadeInterval = setInterval(() => {
        currentStep += 1;
        birthdayAudio.volume = Math.min(1, Math.max(0, birthdayAudio.volume + volumeStep));
        if (currentStep >= steps) {
            clearInterval(birthdayAudioFadeInterval);
        }
    }, stepTime);
}

function updateMusicButton() {
    if (!musicControlBtn || !birthdayAudio) return;
    if (!birthdayAudioLoaded) {
        musicControlBtn.textContent = '🔊 Play Music';
        musicControlBtn.classList.remove('active');
        musicControlBtn.setAttribute('aria-label', 'Play birthday music');
        return;
    }
    if (birthdayAudio.paused) {
        musicControlBtn.textContent = '🔊 Play Music';
        musicControlBtn.classList.remove('active');
        musicControlBtn.setAttribute('aria-label', 'Play birthday music');
    } else {
        musicControlBtn.textContent = '🔇 Pause Music';
        musicControlBtn.classList.add('active');
        musicControlBtn.setAttribute('aria-label', 'Pause birthday music');
    }
}

function playBirthdayIntro() {
    if (!window.speechSynthesis || birthdayIntroPlayed) {
        playBirthdayMusic({ skipIntro: true });
        return;
    }

    birthdayIntroPlayed = true;
    const message = new SpeechSynthesisUtterance(
        'Happy birthday, Sanku. I am so happy we can celebrate this moment together. Let the surprise glow, the music rise, and the celebration begin.'
    );
    message.rate = 1.0;
    message.pitch = 1.1;
    message.volume = 1;
    message.onend = () => playBirthdayMusic({ skipIntro: true });
    message.onerror = () => playBirthdayMusic({ skipIntro: true });
    window.speechSynthesis.speak(message);
}

function playBirthdayMusic(options = {}) {
    if (!birthdayAudio) return;
    const { skipIntro = false } = options;
    loadBirthdayAudio();
    if (!skipIntro && !birthdayIntroPlayed && 'speechSynthesis' in window) {
        playBirthdayIntro();
        return;
    }
    if (birthdayAudio.paused) {
        birthdayAudio.play().catch(() => {});
    }
    fadeAudioVolume(0.02, 0.68, 2400);
    musicPlayed = true;
    updateMusicButton();
}

function pauseBirthdayMusic() {
    if (!birthdayAudio) return;
    clearInterval(birthdayAudioFadeInterval);
    birthdayAudio.pause();
    updateMusicButton();
}

function createHappyBirthdayWav() {
    const sampleRate = 44100;
    const melody = [
        [264, 0.4],[264, 0.4],[297, 0.8],[264, 0.8],[352, 0.8],[330, 1.6],
        [264, 0.4],[264, 0.4],[297, 0.8],[264, 0.8],[396, 0.8],[352, 1.6],
        [264, 0.4],[264, 0.4],[528, 0.8],[440, 0.8],[352, 0.8],[330, 0.8],[297, 1.6],
        [466, 0.4],[466, 0.4],[440, 0.8],[352, 0.8],[396, 0.8],[352, 1.6]
    ];
    const samples = [];
    melody.forEach(([freq, duration]) => {
        const frameCount = Math.floor(duration * sampleRate);
        for (let i = 0; i < frameCount; i++) {
            const t = i / sampleRate;
            const envelope = Math.min(1, t / 0.03) * Math.max(0, 1 - (t / duration));
            const phase = 2 * Math.PI * freq * t;
            samples.push(Math.sin(phase) * envelope * 0.35);
        }
    });
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + samples.length * 2, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, 'data');
    view.setUint32(40, samples.length * 2, true);
    let offset = 44;
    samples.forEach(s => {
        const clamped = Math.max(-1, Math.min(1, s));
        view.setInt16(offset, clamped < 0 ? clamped * 0x8000 : clamped * 0x7FFF, true);
        offset += 2;
    });
    return new Blob([view], { type: 'audio/wav' });
}

function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

function triggerBirthdayMusicIfNeeded() {
    if (!birthdayReached && Date.now() >= birthday) {
        birthdayReached = true;
        playPopSound();
        playBirthdayMusic();
    }
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

document.addEventListener('DOMContentLoaded', () => {
    if (musicControlBtn) {
        musicControlBtn.addEventListener('click', toggleBirthdayMusic);
    }
    updateMusicButton();
});

function showSurprise() {
    surpriseModal.classList.remove('hidden');
}

function hideSurprise() {
    surpriseModal.classList.add('hidden');
}

function checkSurpriseAvailability() {
    surpriseBtn.disabled = false;
    surpriseBtn.classList.remove('disabled');
}

surpriseBtn.addEventListener('click', () => {
    const latestKey = getLatestUnlockedSurpriseKey();
    if (latestKey) {
        openSurprise(latestKey);
    }
});

function getLatestUnlockedSurpriseKey() {
    const unlocked = surpriseSchedule.filter(item => isCardUnlocked(item.key));
    return unlocked.length ? unlocked[unlocked.length - 1].key : null;
}

// --- Celebration sequence: confetti, floating emojis, burst, pop sound, reveal ---
const confettiCanvas = document.getElementById('confettiCanvas');
const floatingEmojisContainer = document.getElementById('floatingEmojis');
let confettiRAF = null;

// DEBUG: force-unlock specific surprises for preview (remove or clear when done)
const FORCE_UNLOCKED_KEYS = [
    '2026-06-16',
    '2026-06-17',
    '2026-06-18',
    '2026-06-19'
];


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
    playBirthdayMusic();
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

function initGlassScene() {
    if (!glassCanvas) return;
    glassCtx = glassCanvas.getContext('2d');
    const frame = document.querySelector('.surprise-image-frame');
    function resizeCanvas() {
        const rect = frame.getBoundingClientRect();
        // canvas is positioned absolutely inside the frame — size to match frame
        glassCanvas.width = Math.max(1, Math.floor(rect.width));
        glassCanvas.height = Math.max(1, Math.floor(rect.height));
        glassCanvas.style.left = '0px';
        glassCanvas.style.top = '0px';
        glassCanvas.style.width = rect.width + 'px';
        glassCanvas.style.height = rect.height + 'px';
        // initialize hammer in center of frame so it doesn't appear stuck top-left
        if (hammerFollower) {
            hammerFollower.style.left = (rect.left + rect.width / 2) + 'px';
            hammerFollower.style.top = (rect.top + rect.height / 2) + 'px';
        }
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // show glass UI
    document.body.classList.add('glass-visible');
    glassVisible = true;

    // position hammer follower
    document.addEventListener('mousemove', onMouseMoveWhileGlass);
    document.addEventListener('touchmove', onTouchMoveWhileGlass, { passive: true });
    hammerFollower.style.display = 'grid';

    // clear any prior cracks
    glassCtx.clearRect(0,0,glassCanvas.width, glassCanvas.height);
    drawGlassSurface();

    // listen for clicks and touch taps on the canvas to create cracks
    glassCanvas.addEventListener('click', handleGlassClick);
    glassCanvas.addEventListener('touchstart', handleGlassTouch, { passive: false });
}

function handleGlassTouch(event) {
    event.preventDefault();
    if (!glassCtx) return;
    const touch = event.changedTouches[0];
    const rect = glassCanvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    drawCrack(x, y);
    playCrackSound();
    crackCount++;
    if (crackCount >= crackThreshold) {
        setTimeout(() => shatterGlass(), 350);
    }
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
    if (!glassVisible) return;
    hammerFollower.style.left = (e.clientX) + 'px';
    hammerFollower.style.top = (e.clientY) + 'px';
    hammerFollower.style.transform = 'translate(-50%,-50%) rotate(-18deg)';
}

function onTouchMoveWhileGlass(event) {
    if (!glassVisible || event.touches.length === 0) return;
    const touch = event.touches[0];
    hammerFollower.style.left = (touch.clientX) + 'px';
    hammerFollower.style.top = (touch.clientY) + 'px';
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
    triggerBirthdayMusicIfNeeded();
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

const surpriseCardGrid = document.getElementById('surpriseCardGrid');
const openSurpriseModal = document.getElementById('openSurpriseModal');
const closeOpenSurpriseModal = document.getElementById('closeOpenSurpriseModal');
const openSurpriseTitle = document.getElementById('openSurpriseTitle');
const openSurpriseContent = document.getElementById('openSurpriseContent');
const openSurpriseIcon = document.getElementById('openSurpriseIcon');

const surpriseSchedule = [
    {
        key: '2026-06-15',
        label: '15 June ❤️',
        display: '15 June',
        title: 'A Glimpse of My Favorite Future 💍',
        type: 'classic',
        content: `Hi Sanku ❤️\n\nYour birthday is coming soon, so I wanted to begin with something special. Maybe I don’t know what life has planned for us… But if I could choose, I would choose a future with you. A future where I get to sit beside you like this, laugh with you, annoy you, and keep choosing you every day. This is one of my favorite dreams. ❤️`,
    },
    {
        key: '2026-06-16',
        label: '16 June ❤️',
        display: '16 June',
        title: '20 Reasons Why I Love You Jar ❤️',
        type: 'jar',
        notes: [
            'You are a part of my life now—no, sorry, you are my life now. You are my support system, and I know I can always rely on you.',
            'You are always respectful towards me, no matter what.',
            'You are the only one who can handle all my nakhre.',
            'I love the way you make me feel—safe, loved, and special.',
            'You are so loyal and trustworthy, and that means everything to me.',
            'You make even my normal days feel special.',
            'I love how patient you are with me, even when I’m being difficult.',
            'You understand me even when I don’t say much.',
            'Your smile can instantly make my mood better.',
            'I love how comfortable I feel around you—I can truly be myself.',
            'You listen to me, even when I rant about random things.',
            'I love how you care about the little things related to me.',
            'You make me laugh when I need it the most.',
            'I love how protective you are without being controlling.',
            'You make me feel like I matter.',
            'In my eyes, you are perfect exactly the way you are—your flaws, your strengths, everything.',
            'You’ve become my favorite notification.',
            'I love that with you, silence never feels awkward.',
            'You bring peace to my chaos.',
            'I love you simply because you are you, Sanku ❤️'
        ]
    },
    {
        key: '2026-06-17',
        label: '17 June ❤️',
        display: '17 June',
        title: 'Puzzle Surprise ❤️',
        type: 'puzzle'
    },
    {
        key: '2026-06-18',
        label: '18 June ❤️',
        display: '18 June',
        title: "Today’s challenge ❤️",
        type: 'jumbledGame'
    },
    {
        key: '2026-06-19',
        label: '19 June ❤️',
        display: '19 June',
        title: 'A Sweet Gratitude',
        type: 'note',
        content: 'Thank you for filling my world with warmth. Today’s surprise is a little reminder that you are cherished and loved beyond words.'
    },
    {
        key: '2026-06-20',
        label: '20 June ❤️',
        display: '20 June',
        title: 'A Promise for Us',
        type: 'note',
        content: 'Every day with you feels like a gift. This note is a promise that I will choose you—today, tomorrow, and forever.'
    },
    {
        key: '2026-06-21',
        label: '21 June ❤️',
        display: '21 June',
        title: 'A Moonlit Wish',
        type: 'note',
        content: 'A quiet wish for us: may our journey be filled with laughter, patience, and endless beautiful memories together.'
    },
    {
        key: '2026-06-22',
        label: '22 June ❤️',
        display: '22 June',
        title: 'A Little Thank You',
        type: 'note',
        content: 'Thank you for being my comfort, my partner, and my favorite person. I treasure every moment we share.'
    },
    {
        key: '2026-06-23',
        label: '23 June ❤️',
        display: '23 June',
        title: 'A Loving Reminder',
        type: 'note',
        content: 'This surprise is a reminder that you are loved deeply, exactly as you are. Your presence makes every day brighter.'
    },
    {
        key: '2026-06-24',
        label: '24 June ❤️',
        display: '24 June',
        title: 'A Tender Moment',
        type: 'note',
        content: 'A little note to say I adore you. Your kindness and your smile are some of the best parts of my world.'
    },
    {
        key: '2026-06-25',
        label: '25 June ❤️',
        display: '25 June',
        title: 'A Pre-Birthday Wish',
        type: 'note',
        content: 'The big day is almost here, and I am so excited to celebrate you. This note is full of love, joy, and anticipation.'
    },
    {
        key: '2026-06-26',
        label: '26 June 🎂',
        display: '26 June',
        title: 'Final Birthday Surprise 🎂',
        type: 'final',
        content: 'The final surprise is here. Enjoy fireworks, confetti, music, and the special reveal that celebrates you in the most magical way.'
    }
];

function parseLocalMidnight(dateKey) {
    const [year, month, day] = dateKey.split('-').map(Number);
    return new Date(year, month - 1, day, 0, 0, 0, 0).getTime();
}

function getTodayMidnight() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).getTime();
}

function isCardUnlocked(dateKey) {
    if (Array.isArray(FORCE_UNLOCKED_KEYS) && FORCE_UNLOCKED_KEYS.includes(dateKey)) return true;
    return getTodayMidnight() >= parseLocalMidnight(dateKey);
}

function buildSurpriseCard(item) {
    const unlocked = isCardUnlocked(item.key);
    const isFinal = item.type === 'final';
    const icon = unlocked ? (isFinal ? '🎂' : '🎁') : '🔒';
    const noteText = unlocked ? (item.type === 'jar' ? 'Open Surprise 🎁' : 'Tap to open the surprise') : `Unlocks on ${item.display}`;

    return `
        <article class="surprise-card ${unlocked ? 'active' : 'locked'} ${isFinal ? 'final-card' : ''}" data-surprise-key="${item.key}" tabindex="0" role="button" aria-pressed="${unlocked}">
            <div class="card-top">
                <span class="card-date">${item.label}</span>
                <span class="card-status">${unlocked ? 'Open Surprise 🎁' : 'Locked'}</span>
            </div>
            <div class="card-footer">
                <p class="card-note">${noteText}</p>
                <div class="card-icon">${icon}</div>
            </div>
            <div class="locked-tooltip">This surprise unlocks on ${item.display} ❤️</div>
        </article>
    `;
}

function renderSurpriseCards() {
    if (!surpriseCardGrid) return;
    surpriseCardGrid.innerHTML = surpriseSchedule.map(buildSurpriseCard).join('');
}

function refreshSurpriseCards() {
    if (!surpriseCardGrid) return;
    surpriseCardGrid.querySelectorAll('.surprise-card').forEach(card => {
        const key = card.dataset.surpriseKey;
        const item = surpriseSchedule.find(entry => entry.key === key);
        if (!item) return;
        const unlocked = isCardUnlocked(key);
        card.classList.toggle('locked', !unlocked);
        card.classList.toggle('active', unlocked);
        card.querySelector('.card-status').textContent = unlocked ? 'Open Surprise 🎁' : 'Locked';
        card.querySelector('.card-note').textContent = unlocked ? (item.type === 'jar' ? 'Open Surprise 🎁' : 'Tap to open the surprise') : `Unlocks on ${item.display}`;
        card.querySelector('.card-icon').textContent = unlocked ? (item.type === 'final' ? '🎂' : '🎁') : '🔒';
        card.setAttribute('aria-pressed', String(unlocked));
    });
}

function openSurprise(key) {
    const item = surpriseSchedule.find(entry => entry.key === key);
    if (!item) return;

    if (item.key === '2026-06-15') {
        showSurprise();
        startCelebrationSequence();
        return;
    }

    openSurpriseIcon.textContent =
        item.type === 'final' ? '🎂' : '🎁';

    // Special override: 19 June becomes the Girlfriend Mode Wheel
    if (item.key === '2026-06-19') {
        openSurpriseIcon.textContent = '🎡';
        openSurpriseTitle.textContent = item.title;

        openSurpriseContent.innerHTML = buildGirlfriendModeWheelContent();
        openSurpriseModal.classList.remove('hidden');

        initGirlfriendModeWheel();
        return;
    }

    openSurpriseTitle.textContent = item.title;

    if (item.type === 'jar') {

        openSurpriseContent.innerHTML = buildJarContent(item);
        attachJarInteractions(item);
        openSurpriseModal.classList.remove('hidden');

        try {
            openSurpriseModal.scrollTop = 0;
            openSurpriseModal
                .querySelector('.open-surprise-panel')
                ?.scrollTo({ top: 0 });
        } catch (e) {}

        setTimeout(() => {
            const firstRoll =
                openSurpriseContent.querySelector('.roll');
            firstRoll?.focus();
        }, 120);

    } else if (item.type === 'puzzle') {
        openSurpriseContent.innerHTML = buildPuzzleContent();
        openSurpriseModal.classList.remove('hidden');
        initializePuzzle();

    } else if (item.type === 'jumbledGame') {
        openSurpriseContent.innerHTML = buildJumbledWordsGameContent();
        openSurpriseModal.classList.remove('hidden');
        initJumbledWordsGame();

    } else if (item.type === 'final') {
        openSurpriseContent.innerHTML = buildFinalContent(item);
        openSurpriseModal.classList.remove('hidden');
        playBirthdayMusic();
        runConfetti(5200);
        createFloatingEmojis();

    } else {
        openSurpriseContent.innerHTML = buildGenericContent(item);
        openSurpriseModal.classList.remove('hidden');
    }
}

function buildJarContent(item) {
    // Love Jar markup: jar shell + dynamic rolls container + unroll stage
    return `
        <div class="love-jar-stage">
            <h2 class="love-jar-title">20 Reasons Why I Love You ❤️</h2>
            <div class="love-jar-sub">Click a paper roll from the jar to reveal a reason.</div>
            <div class="love-jar-wrap">
                <div class="jar-decor hearts" aria-hidden="true"></div>
                <div class="jar-decor sparkles" aria-hidden="true"></div>
                <div class="love-jar" role="region" aria-label="Love jar">
                        <div class="jar-lid" aria-hidden="true">
                            <div class="lid-top"><span class="lid-heart">❤</span></div>
                        </div>
                        <div class="jar-hang">
                            <div class="hang-string"></div>
                            <div class="jar-label"><span class="label-text">20 Reasons Why I Love You ❤️</span></div>
                        </div>
                        <div class="jar-glass">
                            <div class="reflect" aria-hidden="true"></div>
                            <div class="jar-inner" id="jarInner">
                            ${item.notes.map((note, index) => `
                                <div class="roll" data-note-index="${index}" aria-label="Roll ${index + 1}" tabindex="0">
                                    <div class="paper-edge"></div>
                                    <div class="paper-core">${index + 1}</div>
                                    <div class="ribbon" aria-hidden="true"></div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="jar-shadow" aria-hidden="true"></div>
                </div>
            </div>
            <div class="jar-note-popup hidden" id="jarNotePopup" aria-hidden="true">
                <div class="jar-note-popup-card">
                    <button class="jar-note-close" type="button" aria-label="Close note">✕</button>
                    <div class="jar-note-title">Note</div>
                    <div class="unrolled-paper" id="unrolledPaper">
                        <div class="unrolled-text"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function attachJarInteractions(item) {
    const jarInner = openSurpriseContent.querySelector('#jarInner');
    const rolls = jarInner?.querySelectorAll('.roll') || [];
    const popup = openSurpriseContent.querySelector('#jarNotePopup');
    const popupText = openSurpriseContent.querySelector('.unrolled-text');
    const popupTitle = openSurpriseContent.querySelector('.jar-note-title');
    const closeButton = openSurpriseContent.querySelector('.jar-note-close');

    // Collision-aware no-overlap placement
    const placedRects = [];
    const jarW = jarInner.clientWidth;
    const jarH = jarInner.clientHeight;

    function rectsOverlap(r1, r2, padding) {
        return !(
            r1.x + r1.w + padding < r2.x ||
            r2.x + r2.w + padding < r1.x ||
            r1.y + r1.h + padding < r2.y ||
            r2.y + r2.h + padding < r1.y
        );
    }

    // Conservative padding so even with hover lift + slight scale, rolls stay separated.
    const COLLISION_PADDING = 22;

    // If jar is too small, we still guarantee layout via deterministic grid packing.
    const planned = [];
    rolls.forEach((roll, i) => {
        const baseW = 66;
        const baseH = 26;

        const maxW = Math.max(72, Math.floor(jarW * 0.20));
        const maxH = Math.max(26, Math.floor(jarH * 0.12));

        // Slightly reduce randomness to make packing reliable.
        const randW = Math.round(baseW + Math.random() * 46);
        const randH = Math.round(baseH + Math.random() * 24);
        const width = Math.min(randW, maxW);
        const height = Math.min(randH, maxH);

        roll.style.width = width + 'px';
        roll.style.height = height + 'px';

        planned.push({ roll, index: i, width, height });
    });

    function makeRect(cx, cy, width, height) {
        return {
            x: cx - Math.round(width / 2),
            y: cy - Math.round(height / 2),
            w: width,
            h: height
        };
    }

    function canPlace(rect) {
        for (const pr of placedRects) {
            if (rectsOverlap(pr, rect, COLLISION_PADDING)) return false;
        }
        return true;
    }

    function placeWithRetries(p, attempts) {
        const minX = 8;
        const maxX = 92;
        const minY = 8;
        const maxY = 92;

        for (let a = 0; a < attempts; a++) {
            const xPercent = minX + Math.random() * (maxX - minX);
            const yPercent = minY + Math.random() * (maxY - minY);

            const cx = Math.floor((xPercent / 100) * jarW);
            const cy = Math.floor((yPercent / 100) * jarH);

            const rect = makeRect(cx, cy, p.width, p.height);
            if (!canPlace(rect)) continue;

            placedRects.push(rect);
            return { cx, cy, rect };
        }
        return null;
    }

    // 1) Attempt packing with collision checks
    const placements = [];
    for (const p of planned) {
        const res = placeWithRetries(p, 500);
        if (res) {
            placements.push({ ...p, cx: res.cx, cy: res.cy, tl: res.rect });
        } else {
            // mark for deterministic grid fallback
            placements.push({ ...p, cx: null, cy: null, tl: null, willGrid: true });
        }
    }

    // 2) Deterministic grid packing for anything unplaced
    const gridPadding = COLLISION_PADDING;
    const cellW = 92;
    const cellH = 52;
    const cols = Math.max(3, Math.floor(jarW / cellW));

    // Reset placedRects to reflect final placements only
    placedRects.length = 0;
    for (const pl of placements) {
        if (!pl.willGrid && pl.tl) placedRects.push(pl.tl);
    }

    let gridIndex = 0;
    for (const pl of placements) {
        if (!pl.willGrid) continue;

        const r = Math.floor(gridIndex / cols);
        const c = gridIndex % cols;
        gridIndex++;

        const x = c * cellW + cellW / 2;
        const yTopSafe = 20;
        const y = r * cellH + cellH / 2 + yTopSafe;

        // clamp within jar bounds
        const cx = Math.max(Math.round(pl.width / 2) + 4, Math.min(jarW - Math.round(pl.width / 2) - 4, Math.round(x)));
        const cy = Math.max(Math.round(pl.height / 2) + 4, Math.min(jarH - Math.round(pl.height / 2) - 4, Math.round(y)));

        const rect = makeRect(cx, cy, pl.width, pl.height);
        // If grid cell still overlaps (rare), push it slightly in-place deterministically
        if (!canPlace(rect)) {
            let placed = false;
            const jitter = [-12, 0, 12, -24, 24];
            for (const jx of jitter) {
                for (const jy of jitter) {
                    const rcx = Math.max(Math.round(pl.width / 2) + 4, Math.min(jarW - Math.round(pl.width / 2) - 4, cx + jx));
                    const rcy = Math.max(Math.round(pl.height / 2) + 4, Math.min(jarH - Math.round(pl.height / 2) - 4, cy + jy));
                    const rrect = makeRect(rcx, rcy, pl.width, pl.height);
                    if (canPlace(rrect)) {
                        placedRects.push(rrect);
                        pl.cx = rcx;
                        pl.cy = rcy;
                        pl.tl = rrect;
                        placed = true;
                        break;
                    }
                }
                if (placed) break;
            }
            if (!placed) {
                // last resort: ignore collision (should be very rare)
                pl.cx = cx;
                pl.cy = cy;
                pl.tl = rect;
                placedRects.push(rect);
            }
        } else {
            placedRects.push(rect);
            pl.cx = cx;
            pl.cy = cy;
            pl.tl = rect;
        }

        delete pl.willGrid;
    }

    // Apply transforms and event handlers
    placements.forEach((p) => {
        const roll = p.roll;

        // Smaller rotation range + capped scale for more reliable separation.
        const angle = (Math.random() - 0.5) * 18;
        const scale = 0.94 + Math.random() * 0.10;

        roll.style.left = (p.cx) + 'px';
        roll.style.top = (p.cy) + 'px';
        roll.style.transform = `translate(-50%, -50%) rotate(${angle}deg) scale(${scale})`;
        roll.style.zIndex = String(40 + Math.floor(Math.random() * 60));
        roll.style.position = 'absolute';

        if (p.tl) placedRects.push(p.tl);

        roll.style.animationDelay = (Math.random() * 2.4) + 's';

        roll.addEventListener('mouseenter', () => roll.classList.add('roll-hover'));
        roll.addEventListener('mouseleave', () => roll.classList.remove('roll-hover'));

        roll.addEventListener('keydown', (ev) => {
            if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); roll.click(); }
        });

        roll.addEventListener('click', async () => {
            const idx = Number(roll.dataset.noteIndex);
            if (roll.classList.contains('opened')) return;
            await animatePullAndUnroll(roll, item.notes[idx], idx + 1);
            roll.classList.add('opened');
            roll.style.opacity = '0.45';
        });
    });

    // place rolls inside the jar while avoiding heavy overlap
    closeButton?.addEventListener('click', () => {
        popup.classList.add('hidden');
        popup.setAttribute('aria-hidden', 'true');
    });

    popup?.addEventListener('click', event => {
        if (event.target === popup) {
            popup.classList.add('hidden');
            popup.setAttribute('aria-hidden', 'true');
        }
    });

    // animation flow: pull -> untie ribbon -> unroll -> show content
    function animatePullAndUnroll(rollEl, noteText, displayIndex) {
        return new Promise(resolve => {
            const rect = rollEl.getBoundingClientRect();
            const clone = rollEl.cloneNode(true);
            clone.classList.add('roll-clone');
            document.body.appendChild(clone);
            clone.style.position = 'fixed';
            clone.style.left = rect.left + 'px';
            clone.style.top = rect.top + 'px';
            clone.style.width = rect.width + 'px';
            clone.style.height = rect.height + 'px';
            clone.style.transform = 'translate3d(0,0,0) rotate(0deg) scale(1)';
            clone.style.transition = 'transform 520ms cubic-bezier(.2,.9,.2,1), left 520ms ease, top 520ms ease, opacity 300ms ease';
            clone.style.willChange = 'transform, left, top, opacity';

            // temporarily disable interactions to avoid weird state while animating
            openSurpriseModal?.classList.add('animating');
            const prevPointer = jarInner.style.pointerEvents;
            jarInner.style.pointerEvents = 'none';

            // force reflow then move to center
            requestAnimationFrame(() => {
                const cx = Math.round((window.innerWidth - rect.width) / 2);
                const cy = Math.round((window.innerHeight - rect.height) / 2);
                // use left/top and transform for best GPU performance
                clone.style.left = cx + 'px';
                clone.style.top = cy + 'px';
                clone.style.transform = 'translate3d(0,0,0) rotate(0deg) scale(1.04)';
                clone.style.zIndex = 11000;
            });

            // after move, untie ribbon
            setTimeout(() => {
                clone.classList.add('untie');
            }, 500);

            // after untie, unroll paper (show popup with animation)
            setTimeout(() => {
                popupTitle.textContent = `Reason ${displayIndex}`;
                popupText.textContent = '';
                popup.classList.remove('hidden');
                popup.setAttribute('aria-hidden', 'false');
                // animate typed reveal
                let i = 0;
                const text = noteText;
                const interval = setInterval(() => {
                    popupText.textContent += text.charAt(i);
                    i++;
                    if (i >= text.length) clearInterval(interval);
                }, 12);

                // cleanup clone after content revealed
                setTimeout(() => {
                    clone.style.opacity = '0';
                    setTimeout(() => {
                        clone.remove();
                        // re-enable interactions
                        openSurpriseModal?.classList.remove('animating');
                        jarInner.style.pointerEvents = prevPointer || '';
                        resolve();
                    }, 420);
                }, 900);
            }, 980);
        });
    }
}

function buildFinalContent(item) {
    return `
        <div class="final-surprise-glow"></div>
        <div class="final-surprise-text">
            <p>${item.content}</p>
            <ul>
                <li>Confetti explosion</li>
                <li>Fireworks sparkle</li>
                <li>Happy Birthday music</li>
                <li>Floating hearts everywhere</li>
            </ul>
        </div>
        <div class="final-video-reveal">
            <div class="final-video-placeholder">
                <div>🎥 Final video reveal</div>
                <small>Replace this with your final video or add a video file named <code>final-surprise.mp4</code>.</small>
            </div>
        </div>
    `;
}

function buildGenericContent(item) {
    return `<p>${item.content}</p>`;
}

// -------------------------------------------------
// 19 June: Girlfriend Mode Wheel (Spin Wheel)
// -------------------------------------------------
const GIRLFRIEND_MODE_WHEEL_SECTIONS = [
    {
        key: 'soft',
        emoji: '🧸',
        title: 'Soft Baby Mode',
        color: '#ff9fd3',
        description: 'Extra cute texts, clingy energy, lots of emojis and baby mode activated.'
    },

    {
        key: 'flirty',

        emoji: '🌶️',
        title: 'Flirty Mode',
        color: '#ff5b8a',
        description: 'Teasing, playful flirting, and dangerous charm levels.'
    },
    {
        key: 'princess',
        emoji: '👑',
        title: 'Princess Mode',
        color: '#b86bff',
        description: 'Spoiled but adorable. You must treat me like royalty today.'
    },
    {
        key: 'romantic',
        emoji: '💌',
        title: 'Romantic Mode',
        color: '#ff77c8',
        description: 'Heartfelt messages, emotional texts, and love overload.'
    },
    {
        key: 'nakhralu',
        emoji: '😤',
        title: 'Nakhralu Mode',
        color: '#ff9a4d',
        description: 'Cute tantrums, playful nakhre, and extra attention demand.'
    },
    {
        key: 'talkative',
        emoji: '🎙️',
        title: 'Talkative Mode',
        color: '#56d7ff',
        description: 'Unlimited yapping, random stories, gossip, and nonstop texting.'
    },
    {
        key: 'shy',
        emoji: '🤭',
        title: 'Shy Mode',
        color: '#7ee7b7',
        description: 'Soft replies, blush energy, and adorable awkwardness.'
    },
    {
        key: 'menace',
        emoji: '😈',
        title: 'Menace Mode',
        color: '#ff3f6e',
        description: 'Chaotic energy, roasts, mischief, and troublemaker mode.'
    }
];

function buildGirlfriendModeWheelContent() {
    return `
        <div class="gf-wheel-wrap" data-wheel-context="gfWheel">
            <div class="gf-wheel-heading">
                <div class="gf-wheel-title">🎡 Girlfriend Mode Wheel</div>
                <div class="gf-wheel-sub">“Spin the wheel to choose which version of me you want texting you today 😏”</div>
            </div>
            <div class="gf-wheel-note">“Whatever the wheel chooses will be your girlfriend mode reward for today. Choose wisely… or let fate decide ❤️”</div>

            <div class="gf-wheel-ui" role="group" aria-label="Girlfriend mode wheel">
                <div class="gf-wheel-pointer" aria-hidden="true"></div>
                <div class="gf-wheel" id="gfWheel" aria-hidden="false">
                    ${GIRLFRIEND_MODE_WHEEL_SECTIONS.map((s) => `
                        <div class="gf-slice" data-slice-key="${s.key}" style="--slice-color:${s.color}">
                            <div class="gf-slice-inner">
                                <div class="gf-slice-emoji">${s.emoji}</div>
                                <div class="gf-slice-label">${s.title}</div>
                            </div>
                        </div>
                    `).join('')}
                    <div class="gf-wheel-gloss" aria-hidden="true"></div>
                </div>

                <div class="gf-wheel-center">
                    <button class="gf-spin-btn" id="gfSpinBtn" type="button" aria-label="Spin the wheel">SPIN ❤️</button>
                </div>
            </div>

            <div class="gf-result hidden" id="gfWheelResult" aria-live="polite"></div>

            <div class="gf-share-row hidden" id="gfWheelShareRow">
                <button class="gf-share-btn" id="gfShareBtn" type="button">Share My Result 💚</button>
            </div>
        </div>
    `;
}

function initGirlfriendModeWheel() {
    const wheelEl = document.getElementById('gfWheel');
    const spinBtn = document.getElementById('gfSpinBtn');
    const resultEl = document.getElementById('gfWheelResult');
    const shareRow = document.getElementById('gfWheelShareRow');
    const shareBtn = document.getElementById('gfShareBtn');

    if (!wheelEl || !spinBtn || !resultEl || !shareRow) return;

    // prevent double init
    spinBtn.onclick = null;
    shareBtn && (shareBtn.onclick = null);

    // layout slices precisely
    const slices = Array.from(wheelEl.querySelectorAll('.gf-slice'));
    const count = GIRLFRIEND_MODE_WHEEL_SECTIONS.length;
    const sliceAngle = 360 / count;

    slices.forEach((sliceEl, i) => {
        sliceEl.style.transform = `rotate(${i * sliceAngle}deg) skewY(${(90 - sliceAngle)}deg)`;
        const inner = sliceEl.querySelector('.gf-slice-inner');
        if (inner) {
            inner.style.transform = `skewY(${(sliceAngle - 90)}deg) rotate(${sliceAngle / 2}deg)`;
        }
    });

    let isSpinning = false;
    let lastResult = null;

    function setResult(result) {
        lastResult = result;
        resultEl.classList.remove('hidden');
        shareRow.classList.remove('hidden');

        resultEl.innerHTML = `
            <div class="gf-result-card">
                <div class="gf-result-top">Today you unlocked:</div>
                <div class="gf-result-mode">${result.emoji} ${result.title}</div>
                <div class="gf-result-desc">${result.description}</div>
                <div class="gf-result-congr">“Congratulations 😏 Your girlfriend mode for today has been selected.”</div>
            </div>
        `;

        // confetti
        try {
            runConfetti(3200);
        } catch (e) {}
    }

    function spin() {
        if (isSpinning) return;
        isSpinning = true;

        spinBtn.disabled = true;
        spinBtn.classList.add('is-disabled');
        resultEl.classList.add('hidden');
        shareRow.classList.add('hidden');
        resultEl.innerHTML = '';

        // pick random section
        const resultIndex = Math.floor(Math.random() * count);
        const result = GIRLFRIEND_MODE_WHEEL_SECTIONS[resultIndex];

        // pointer is at top (0deg). With wheel rotated by angle, determine alignment.
        // Our slice i starts at 0deg and goes clockwise, so choose a final rotation where slice center aligns with 0deg.
        const sliceCenterOffset = resultIndex * sliceAngle + sliceAngle / 2;
        const spins = 6 + Math.floor(Math.random() * 4); // total rotations 6-9
        const baseRotation = spins * 360;
        // rotate such that selected slice center ends at pointer (top). Clockwise rotation uses negative.
        const finalRotation = baseRotation - sliceCenterOffset;
        // small additional randomness for realism
        const jitter = (Math.random() - 0.5) * (sliceAngle * 0.06);

        const durationMs = 4600; // 4-5 sec
        const ease = 'cubic-bezier(0.12, 0.92, 0.18, 1)';


        // apply spin transform (ensure wheel starts from a clean state)
        wheelEl.style.transition = `transform ${durationMs}ms ${ease}`;
        wheelEl.style.transform = 'rotate(0deg)';

        wheelEl.style.willChange = 'transform';

        // first set to current rotation baseline
        const computed = window.getComputedStyle(wheelEl);
        const matrix = computed.transform;
        let currentRotation = 0;
        if (matrix && matrix !== 'none') {
            // matrix(a,b,c,d,tx,ty) => rotation = atan2(b,a)
            const match = matrix.match(/matrix\(([^)]+)\)/);
            if (match && match[1]) {
                const parts = match[1].split(',').map(s => parseFloat(s));
                const a = parts[0];
                const b = parts[1];
                currentRotation = Math.atan2(b, a) * (180 / Math.PI);
            }
        }

        const target = currentRotation + finalRotation + jitter;
        wheelEl.style.transform = `rotate(${target}deg)`;

        setTimeout(() => {
            wheelEl.style.transition = 'none';
            // normalize rotation to keep values stable
            wheelEl.style.transform = wheelEl.style.transform;
            setResult(result);
            isSpinning = false;
            spinBtn.disabled = false;
            spinBtn.classList.remove('is-disabled');
        }, durationMs + 40);
    }

    spinBtn.addEventListener('click', () => spin());

    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            if (!lastResult) return;
            const message = `I spun the Girlfriend Mode Wheel ❤️\nToday I unlocked:\n${lastResult.emoji} ${lastResult.title}\n\nI’m ready for today’s reward 😏`;
            window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
        });
    }
}

// -----------------------------
// 18 June: Jumbled Words + Reward Menu
// -----------------------------

const JUMBLED_WORDS_GAME = {
    heading: "Today’s challenge ❤️",
    subtext: "Solve all jumbled words to unlock your reward menu.",
    levels: [
        { level: 1, label: 'Level 1 → Easy', startWordIndex: 0, endWordIndex: 1 },
        { level: 2, label: 'Level 2 → Medium', startWordIndex: 2, endWordIndex: 3 },
        { level: 3, label: 'Level 3 → Final Challenge', startWordIndex: 4, endWordIndex: 5 },
    ],
    wordsInOrder: [
        { jumbled: 'EVOL', answer: 'LOVE' },
        { jumbled: 'TRAEH', answer: 'HEART' },
        { jumbled: 'YADHTRIB', answer: 'BIRTHDAY' },
        { jumbled: 'INVAS', answer: 'SAVNI' },
        { jumbled: 'UKNAS', answer: 'SANKU' },
        { jumbled: 'UOYEVOLI', answer: 'ILOVEYOU' },
    ],
};

function buildJumbledWordsGameContent() {
    return `
        <div class="jumbled-game-wrap">
            <div class="jumbled-game-header">
                <h2>${JUMBLED_WORDS_GAME.heading}</h2>
                <p class="jumbled-game-sub">${JUMBLED_WORDS_GAME.subtext}</p>
            </div>

            <div class="jumbled-game-meta">
                <div id="jumbledLevelIndicator" class="jumbled-level-indicator">${JUMBLED_WORDS_GAME.levels[0].label}</div>
                <div id="jumbledProgress" class="jumbled-progress" aria-live="polite">Solved: 0 / 6</div>
            </div>

            <div class="jumbled-word-card" aria-live="polite">
                <div class="jumbled-word-label">Your jumbled word</div>
                <div id="jumbledWordDisplay" class="jumbled-word-display">EVOL</div>
                <div id="jumbledFeedback" class="jumbled-feedback" aria-live="polite"></div>
            </div>

            <form id="jumbledForm" class="jumbled-form" autocomplete="off">
                <label for="jumbledAnswerInput" class="jumbled-input-label">Type the correct word</label>
                <input id="jumbledAnswerInput" class="jumbled-input" type="text" inputmode="text" spellcheck="false" />
                <button id="jumbledSubmitBtn" class="primary-button jumbled-submit" type="submit">Submit</button>
            </form>

            <div class="jumbled-success-stage hidden" id="jumbledSuccessStage">
                <div class="jumbled-success-anim" aria-hidden="true">✨</div>
                <div class="jumbled-success-text">
                    <div id="jumbledSuccessLine1" class="jumbled-success-line">ACCESS GRANTED ❤️</div>
                    <div id="jumbledSuccessLine2" class="jumbled-success-line">Reward Menu Unlocked</div>
                </div>
            </div>
        </div>
    `;
}

let jumbledWordsState = {
    wordIndex: 0,
    solvedCount: 0,
    isComplete: false,
    formSubmitted: false,
};

function normalizeAnswer(s) {
    return String(s || '').trim().toUpperCase();
}

function updateJumbledLevelIndicator(index) {
    const el = document.getElementById('jumbledLevelIndicator');
    if (!el) return;
    // index is current wordIndex, map by solved/next word
    // level rules in setup are based on word indices.
    const levels = JUMBLED_WORDS_GAME.levels;
    const matched = levels.find(l => index >= l.startWordIndex && index <= l.endWordIndex) || levels[0];
    el.textContent = matched.label;
}

function updateJumbledProgress() {
    const el = document.getElementById('jumbledProgress');
    if (!el) return;
    el.textContent = `Solved: ${jumbledWordsState.solvedCount} / 6`;
}

function showJumbledFeedback(text, type) {
    const el = document.getElementById('jumbledFeedback');
    if (!el) return;
    el.textContent = text;
    el.classList.remove('is-correct', 'is-wrong');
    if (type === 'correct') el.classList.add('is-correct');
    if (type === 'wrong') el.classList.add('is-wrong');
}

function setJumbledWord(word) {
    const display = document.getElementById('jumbledWordDisplay');
    if (!display) return;
    display.textContent = word;
}

function initJumbledWordsGame() {
    // reset state
    jumbledWordsState = { wordIndex: 0, solvedCount: 0, isComplete: false, formSubmitted: false };

    const input = document.getElementById('jumbledAnswerInput');
    const form = document.getElementById('jumbledForm');
    const submitBtn = document.getElementById('jumbledSubmitBtn');
    const successStage = document.getElementById('jumbledSuccessStage');

    if (!input || !form) return;

    input.value = '';
    setJumbledWord(JUMBLED_WORDS_GAME.wordsInOrder[0].jumbled);
    updateJumbledLevelIndicator(0);
    updateJumbledProgress();
    showJumbledFeedback('', null);
    successStage?.classList.add('hidden');

    // level indicator on initial

    input.focus();

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (jumbledWordsState.isComplete) return;
        if (submitBtn) submitBtn.disabled = true;

        const current = JUMBLED_WORDS_GAME.wordsInOrder[jumbledWordsState.wordIndex];
        const guess = normalizeAnswer(input.value);
        const correct = normalizeAnswer(current.answer);

        if (guess === correct) {
            jumbledWordsState.solvedCount++;
            jumbledWordsState.wordIndex++;
            updateJumbledProgress();
            showJumbledFeedback('Nice! ❤️', 'correct');

            // success animation: small flash then next word
            setTimeout(() => {
                if (jumbledWordsState.wordIndex >= JUMBLED_WORDS_GAME.wordsInOrder.length) {
                    completeJumbledWordsGame();
                    return;
                }
                const next = JUMBLED_WORDS_GAME.wordsInOrder[jumbledWordsState.wordIndex];
                setJumbledWord(next.jumbled);
                updateJumbledLevelIndicator(jumbledWordsState.wordIndex);
                input.value = '';
                showJumbledFeedback('', null);
                submitBtn && (submitBtn.disabled = false);
                input.focus();
            }, 520);
        } else {
            // wrong answer
            showJumbledFeedback('Try again ❤️', 'wrong');
            input.value = '';
            submitBtn && (submitBtn.disabled = false);
            input.focus();
        }
    });
}

function completeJumbledWordsGame() {
    const successStage = document.getElementById('jumbledSuccessStage');
    const stageLine1 = document.getElementById('jumbledSuccessLine1');
    const stageLine2 = document.getElementById('jumbledSuccessLine2');
    const form = document.getElementById('jumbledForm');
    const input = document.getElementById('jumbledAnswerInput');

    jumbledWordsState.isComplete = true;

    if (form) form.reset?.();
    if (input) input.value = '';

    if (stageLine1) stageLine1.textContent = 'ACCESS GRANTED ❤️';
    if (stageLine2) stageLine2.textContent = 'Reward Menu Unlocked';

    successStage?.classList.remove('hidden');
    form?.classList.add('hidden');

    // wait 1.5 seconds then open reward menu
    setTimeout(() => {
        openRewardMenu();
    }, 1500);
}

let couponSelectionState = {
    cute: null,
    spicy: null,
    vip: null,
};

const COUPONS = {
    cute: [
        'Cute Selfie Coupon',
        'Baby Voice Note Coupon',
        'Good Morning Spam Coupon',
        'Virtual Cuddle Coupon',
        '10 Random Pics Coupon',
    ],
    spicy: [
        'Spicy Pic Coupon',
        'Mirror Selfie Coupon',
        'Outfit Choice Coupon',
        'Secret Content Coupon',
        'Flirty Text Session Coupon',
    ],
    vip: [
        'Premium Girlfriend Mode',
        'No Fight Pass',
        'You Plan the Date',
        'Steal My Time',
        'Unlimited Compliments',
    ],
};

let lastRedeemMessage = '';

function buildRewardMenuContent() {
    return `
        <div class="reward-menu-wrap">
            <div class="reward-menu-header">
                <h2>🎁 Coupon Reward Menu</h2>
                <p class="reward-menu-sub">Choose 1 from this section</p>
            </div>

            <div class="reward-sections">
                ${renderCouponSection('cute', 'Cute Coupons', COUPONS.cute)}
                ${renderCouponSection('spicy', 'Spicy Coupons', COUPONS.spicy)}
                ${renderCouponSection('vip', 'VIP Treatment', COUPONS.vip)}
            </div>

            <div class="reward-actions">
                <button id="redeemBtn" class="primary-button reward-redeem disabled" type="button" disabled>
                    Redeem My Rewards 🎁
                </button>
                <button id="whatsAppShareBtn" class="primary-button reward-whatsapp" type="button">
                    Share on WhatsApp 💚
                </button>
            </div>

            <div id="redeemStatus" class="reward-status" aria-live="polite"></div>
        </div>
    `;
}

function renderCouponSection(key, title, items) {
    const safeKey = String(key);
    return `
        <section class="reward-section" data-section-key="${safeKey}">
            <div class="reward-section-title">${title}</div>
            <div class="reward-coupons-grid">
                ${items.map((coupon) => `
                    <button type="button" class="reward-coupon" data-coupon-value="${escapeHtmlAttr(coupon)}" data-section-key="${safeKey}">
                        ${escapeHtml(coupon)}
                    </button>
                `).join('')}
            </div>
        </section>
    `;
}

function escapeHtml(str) {
    return String(str)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '<')
        .replaceAll('>', '>')
        .replaceAll('"', '"')
        .replaceAll("'", '&#039;');
}

function escapeHtmlAttr(str) {
    return escapeHtml(str).replaceAll('`', '&#096;');
}

function applyCouponSelectionUI() {
    const all = document.querySelectorAll('.reward-coupon[data-section-key]');
    all.forEach(btn => {
        const section = btn.getAttribute('data-section-key');
        const val = btn.getAttribute('data-coupon-value');
        const selected = (section === 'cute' && couponSelectionState.cute === val) ||
            (section === 'spicy' && couponSelectionState.spicy === val) ||
            (section === 'vip' && couponSelectionState.vip === val);
        btn.classList.toggle('selected-glow', selected);
    });
}

function updateRedeemButtonState() {
    const redeemBtn = document.getElementById('redeemBtn');
    if (!redeemBtn) return;
    const ready = !!(couponSelectionState.cute && couponSelectionState.spicy && couponSelectionState.vip);
    redeemBtn.disabled = !ready;
    redeemBtn.classList.toggle('disabled', !ready);
    redeemBtn.textContent = 'Redeem My Rewards 🎁';
}

function openRewardMenu() {
    couponSelectionState = { cute: null, spicy: null, vip: null };
    lastRedeemMessage = '';

    openSurpriseContent.innerHTML = buildRewardMenuContent();

    // ensure top
    try {
        openSurpriseModal?.scrollTo({ top: 0 });
    } catch (e) {}

    // attach coupon click handlers (only ONE per section)
    document.querySelectorAll('.reward-coupon').forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.getAttribute('data-section-key');
            const value = btn.getAttribute('data-coupon-value');

            if (section === 'cute') couponSelectionState.cute = value;
            if (section === 'spicy') couponSelectionState.spicy = value;
            if (section === 'vip') couponSelectionState.vip = value;

            applyCouponSelectionUI();
            updateRedeemButtonState();

            const statusEl = document.getElementById('redeemStatus');
            if (statusEl) statusEl.textContent = '';
        });
    });

    const redeemBtn = document.getElementById('redeemBtn');
    const shareBtn = document.getElementById('whatsAppShareBtn');

    redeemBtn?.addEventListener('click', () => {
        const message = buildRedeemMessage();
        lastRedeemMessage = message;
        const statusEl = document.getElementById('redeemStatus');
        if (statusEl) statusEl.textContent = message;

        // allow share after redeem
        shareBtn?.classList.add('ready');
    });

    shareBtn?.addEventListener('click', () => {
        if (!lastRedeemMessage) {
            const statusEl = document.getElementById('redeemStatus');
            if (statusEl) statusEl.textContent = 'Select coupons and redeem first ❤️';
            return;
        }
        window.open(`https://wa.me/?text=${encodeURIComponent(lastRedeemMessage)}`, '_blank');
    });

    // initial UI state
    applyCouponSelectionUI();
    updateRedeemButtonState();
}

function buildRedeemMessage() {
    return `I completed today’s birthday challenge ❤️\n\nI choose:\n🧸 ${couponSelectionState.cute}\n🌶️ ${couponSelectionState.spicy}\n👑 ${couponSelectionState.vip}\n\nReady to redeem 😏`;
}

function handleSurpriseCardClick(event) {

    let card = event.target;
    if (card && card.nodeType !== Node.ELEMENT_NODE) {
        card = card.parentElement;
    }
    while (card && !card.classList?.contains('surprise-card')) {
        card = card.parentElement;
    }
    if (!card || !card.dataset.surpriseKey) return;
    const item = surpriseSchedule.find(entry => entry.key === card.dataset.surpriseKey);
    if (!item) return;
    if (!isCardUnlocked(item.key)) {
        alert(`This surprise unlocks on ${item.display} ❤️`);
        return;
    }
    openSurprise(item.key);
}

surpriseCardGrid?.addEventListener('click', handleSurpriseCardClick);
surpriseCardGrid?.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleSurpriseCardClick(event);
    }
});

closeOpenSurpriseModal?.addEventListener('click', () => {
    openSurpriseModal?.classList.add('hidden');
});

openSurpriseModal?.addEventListener('click', event => {
    if (event.target === openSurpriseModal) {
        openSurpriseModal.classList.add('hidden');
    }
});

function checkSurpriseAvailability() {
    if (surpriseBtn) {
        surpriseBtn.disabled = false;
        surpriseBtn.classList.remove('disabled');
    }
    refreshSurpriseCards();
}
let puzzleTiles = [];
let emptyIndex = 8;
let moveCount = 0;

function buildPuzzleContent() {
    return `
        <div class="puzzle-wrapper">
            <h3>Before today’s surprise unlocks, solve a harder puzzle ❤️</h3>
            <p>Arrange the pieces correctly. Fewer moves = more love ✨</p>


            <div id="moveCounter">Moves: 0</div>
            <div id="puzzleBoard" class="puzzle-board" aria-label="Sliding puzzle board" role="grid"></div>

            <button id="shufflePuzzleBtn" type="button">Shuffle (Hard)</button>

            <div id="puzzleResult" aria-live="polite"></div>
        </div>
    `;
}

function initializePuzzle() {
    const board = document.getElementById('puzzleBoard');
    const shuffleBtn = document.getElementById('shufflePuzzleBtn');

// 4x4 (16-piece) puzzle: tiles 0..14 and null is the empty slot.
    // Solved state would be [0..14, null].
    puzzleTiles = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,null];
    emptyIndex = 15;
    moveCount = 0;


    renderPuzzle();

    shufflePuzzle();

    shuffleBtn.addEventListener('click', shufflePuzzle);
}

function renderPuzzle() {
    const board = document.getElementById('puzzleBoard');
    const counter = document.getElementById('moveCounter');
    if (!board) return;

    // Enforce invariant: exactly one empty tile (null)
    if (!Array.isArray(puzzleTiles) || puzzleTiles.length !== 16) {
        puzzleTiles = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, null];
        emptyIndex = 15;
        moveCount = 0;
    }

    const nullCount = puzzleTiles.reduce((acc, t) => acc + (t === null ? 1 : 0), 0);
    if (nullCount !== 1) {
        puzzleTiles = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, null];
        emptyIndex = 15;
    } else {
        emptyIndex = puzzleTiles.indexOf(null);
    }

    board.innerHTML = '';
    counter.textContent = `Moves: ${moveCount}`;

    const gridSize = 4;

    puzzleTiles.forEach((tile, index) => {
        const div = document.createElement('div');
        div.className = 'tile';

        if (tile === null) {
            div.classList.add('empty');
            // no onclick for empty
        } else {
            const row = Math.floor(tile / gridSize);
            const col = tile % gridSize;

            div.dataset.index = String(index);
            div.onclick = () => moveTile(index);

            // Correct slicing for a 4x4 grid (15 tiles + 1 empty)
            div.style.backgroundImage = "url('puzzle.jpeg')";
            div.style.backgroundRepeat = 'no-repeat';
            div.style.backgroundSize = '400% 400%';
            div.style.backgroundPosition = `${(col * 33.33)}% ${(row * 33.33)}%`;
        }

        board.appendChild(div);
    });
}

function moveTile(index) {
    const gridSize = 4;

    // tile at `index` can move only if adjacent to the empty tile
    const tileRow = Math.floor(index / gridSize);
    const tileCol = index % gridSize;

    const emptyRow = Math.floor(emptyIndex / gridSize);
    const emptyCol = emptyIndex % gridSize;

    const isAdjacent =
        (tileRow === emptyRow && Math.abs(tileCol - emptyCol) === 1) ||
        (tileCol === emptyCol && Math.abs(tileRow - emptyRow) === 1);

    if (!isAdjacent) return;
    if (puzzleTiles[index] === null) return;

    // swap tile with empty
    [puzzleTiles[index], puzzleTiles[emptyIndex]] = [puzzleTiles[emptyIndex], puzzleTiles[index]];
    emptyIndex = index;
    moveCount++;

    renderPuzzle();
    checkPuzzleSolved();
}

function shufflePuzzle() {
    const gridSize = 4;

    // Start from solved state every time so it's guaranteed solvable.
    puzzleTiles = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, null];
    emptyIndex = 15;
    moveCount = 0;

    // Perform exactly 300 random valid moves from the empty tile.
    // Each step: choose one of the tiles adjacent to the empty and swap.
    for (let i = 0; i < 300; i++) {
        const emptyRow = Math.floor(emptyIndex / gridSize);
        const emptyCol = emptyIndex % gridSize;

        const candidates = [];

        // left/right (same row)
        if (emptyCol > 0) candidates.push(emptyIndex - 1);
        if (emptyCol < gridSize - 1) candidates.push(emptyIndex + 1);
        // up/down (adjacent rows)
        if (emptyRow > 0) candidates.push(emptyIndex - gridSize);
        if (emptyRow < gridSize - 1) candidates.push(emptyIndex + gridSize);

        const chosen = candidates[Math.floor(Math.random() * candidates.length)];

        [puzzleTiles[chosen], puzzleTiles[emptyIndex]] = [puzzleTiles[emptyIndex], puzzleTiles[chosen]];
        emptyIndex = chosen;
    }

    // sanity: must still be exactly one null
    if (puzzleTiles.filter(t => t === null).length !== 1) {
        puzzleTiles = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, null];
        emptyIndex = 15;
    }

    renderPuzzle();
    checkPuzzleSolved();
}



function checkPuzzleSolved() {
    const solved =
        puzzleTiles.slice(0,8).every((tile, i) => tile === i) &&
        puzzleTiles[8] === null;

    if (!solved) return;

    runConfetti(5000);
    createFloatingEmojis();

    setTimeout(() => {
        document.getElementById('puzzleResult').innerHTML = `
            <img src="surprise.png" class="surprise-reveal-img">
            <div class="puzzle-love-note">
                <p>You solved it ❤️</p>
                <p>Every piece of this puzzle had its place…</p>
                <p>Just like every moment with you has slowly become a beautiful part of my life.</p>
                <p>Somewhere between our conversations, laughter, silly fights, and patch-ups, you became my comfort, my peace, and one of the most special people in my life.</p>
                <p><strong>Our future family picture 📸</strong></p>
                <p>Your future family moments are coming soon…</p>
                <p>And now… I have your surprise waiting for you ✨</p>
            </div>
        `;
    }, 1000);
}
updateCountdown();
renderSurpriseCards();
setInterval(() => {
    updateCountdown();
    checkSurpriseAvailability();
}, 1000);

