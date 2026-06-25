const BIRTHDAY_TARGET = new Date('2026-06-26T00:00:00+05:30').getTime();

const birthdayMessage = `Happy Birthday, my love. ❤️

First of all, I want to tell you something important.

Your Dadiji and Dadaji are so proud of you — in fact, everyone around you is proud of you. You are one of the strongest people I know. You’re respectful, hardworking, caring, and you carry so much responsibility with so much strength.

I know life hasn’t always been easy, but the way you keep moving forward makes me admire you even more.

Before opening everything I made for you, I want one small thing from you — please reply to your Dadiji and Dadaji’s birthday wishes. I can see how lovingly they’re wishing you, and I know it would make them happy.

Now… once you’ve done that—

You may continue. 🍿✨
Your SANFLIX birthday special is ready.

Enjoy the surprises, birthday boy. ❤️`;

const modal = document.getElementById('modal');
const modalPanel = document.getElementById('modalPanel');
const modalContent = document.getElementById('modalContent');
const siteShell = document.getElementById('siteShell');
const music = document.getElementById('birthdayMusic');
const musicButton = document.getElementById('musicButton');
const musicButtonText = document.getElementById('musicButtonText');

let typewriterTimer = null;
let musicWasPlaying = false;

function updateCountdown() {
    const remaining = Math.max(0, BIRTHDAY_TARGET - Date.now());
    const values = {
        days: Math.floor(remaining / 86400000),
        hours: Math.floor((remaining % 86400000) / 3600000),
        minutes: Math.floor((remaining % 3600000) / 60000),
        seconds: Math.floor((remaining % 60000) / 1000)
    };

    Object.entries(values).forEach(([id, value]) => {
        document.getElementById(id).textContent = String(value).padStart(2, '0');
    });

    if (remaining === 0) {
        document.getElementById('countdownHeading').innerHTML = 'The big day is finally here <span>♥</span>';
    }
}

function createEmojiRain() {
    const layer = document.getElementById('emojiRain');
    const emojis = ['🎉', '🎂', '✨', '🍰', '🥳', '💕'];
    const fragment = document.createDocumentFragment();

    for (let index = 0; index < 28; index += 1) {
        const emoji = document.createElement('span');
        emoji.textContent = emojis[index % emojis.length];
        emoji.style.setProperty('--x', `${Math.random() * 100}vw`);
        emoji.style.setProperty('--delay', `${-Math.random() * 14}s`);
        emoji.style.setProperty('--duration', `${10 + Math.random() * 8}s`);
        emoji.style.setProperty('--drift', `${-45 + Math.random() * 90}px`);
        emoji.style.setProperty('--size', `${0.7 + Math.random() * 0.85}rem`);
        fragment.appendChild(emoji);
    }

    layer.appendChild(fragment);
}

function setMusicButton() {
    const playing = !music.paused;
    musicButton.classList.toggle('playing', playing);
    musicButtonText.textContent = playing ? 'Pause Music' : 'Play Music';
    musicButton.setAttribute('aria-label', playing ? 'Pause music' : 'Play music');
}

async function toggleMusic() {
    if (music.paused) {
        try {
            await music.play();
        } catch {
            return;
        }
    } else {
        music.pause();
    }
    setMusicButton();
}

function stopTypewriter() {
    if (typewriterTimer) {
        clearInterval(typewriterTimer);
        typewriterTimer = null;
    }
}

function openModal(markup, className = '') {
    closeModal(false);
    modalPanel.className = `modal-panel ${className}`.trim();
    modalContent.innerHTML = markup;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    siteShell.classList.add('blurred');
    document.body.classList.add('modal-open');
    modalPanel.querySelector('.modal-close')?.focus();
}

function closeModal(restoreMusic = true) {
    stopTypewriter();
    const video = modalContent.querySelector('video');
    if (video) {
        video.pause();
        video.removeAttribute('src');
        video.load();
    }

    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    siteShell.classList.remove('blurred');
    document.body.classList.remove('modal-open');
    modalContent.innerHTML = '';

    if (restoreMusic && musicWasPlaying && music.paused) {
        music.play().catch(() => {});
    }
    musicWasPlaying = false;
}

function typeMessage(element, text) {
    stopTypewriter();
    let index = 0;
    element.textContent = '';
    typewriterTimer = setInterval(() => {
        element.textContent += text[index] || '';
        index += 1;
        element.scrollTop = element.scrollHeight;
        if (index >= text.length) stopTypewriter();
    }, 16);
}

function openMessage() {
    openModal(`
        <div class="message-modal">
            <div class="message-icon" aria-hidden="true">✉</div>
            <p class="eyebrow">EPISODE 0 · A MESSAGE FROM ME</p>
            <h2 id="modalTitle">Before You Press Play</h2>
            <div id="typedMessage" class="typed-message" aria-live="polite"></div>
            <button id="continueButton" class="continue-button" type="button">Continue Watching <span>♥</span></button>
        </div>
    `, 'glass-panel');

    typeMessage(document.getElementById('typedMessage'), birthdayMessage);
    document.getElementById('continueButton').addEventListener('click', () => {
        closeModal();
        document.getElementById('episodes').scrollIntoView({ behavior: 'smooth' });
    });
}

function openVideo(card) {
    const wasPlaying = !music.paused;
    if (wasPlaying) music.pause();
    setMusicButton();

    const title = card.dataset.title;
    const landscape = card.dataset.landscape === 'true';
    const videoPath = encodeURI(card.dataset.video);

    openModal(`
        <div class="video-modal">
            <p class="eyebrow">NOW PLAYING · SANFLIX ORIGINAL</p>
            <h2 id="modalTitle">${title}</h2>
            <div class="video-frame ${landscape ? 'landscape' : ''}">
                <video id="episodeVideo" controls autoplay playsinline preload="metadata" src="${videoPath}"></video>
            </div>
            <p id="nextEpisodeMessage" class="next-episode" aria-live="polite">Next episode available <span>♥</span></p>
        </div>
    `, 'video-panel');

    musicWasPlaying = wasPlaying;
    const video = document.getElementById('episodeVideo');
    video.addEventListener('ended', () => {
        document.getElementById('nextEpisodeMessage').classList.add('visible');
    });
    video.play().catch(() => {});
}

function openLetter() {
    // Finale opens the pre-rendered final letter image.
    openModal(`

        <div class="sanflix-finale-overlay" role="dialog" aria-modal="true">
            <div class="sanflix-finale-sparkles" aria-hidden="true"></div>
            <div class="sanflix-finale-hearts" aria-hidden="true">
                <span>♥</span><span>♥</span><span>♥</span><span>♥</span><span>♥</span><span>♥</span>
            </div>

            <button class="sanflix-finale-close" type="button" data-close-modal aria-label="Close">×</button>

            <div class="sanflix-finale-content">
                <div class="sanflix-finale-header">
                    <div class="sanflix-finale-eyebrow">SANFLIX FINALE</div>
                    <h2 class="sanflix-finale-title">A Letter I Wrote For You</h2>
                </div>

                <div class="sanflix-finale-ui">
                    <div class="sanflix-finale-letter-card" role="article" aria-label="Final letter">
                        <img src="./letter.png" alt="Final Love Letter" class="final-letter-image" />
                    </div>


                    <div class="sanflix-finale-envelope" aria-hidden="true">
                        <div class="envelope-bottom"></div>
                        <div class="envelope-paper"></div>
                        <div class="envelope-front"></div>
                        <div class="envelope-flap"></div>
                    </div>
                </div>

                <div class="sanflix-finale-footer">Forever yours ∞ ♡</div>
            </div>
        </div>
    `, 'sanflix-finale-modal-panel');
}



document.querySelectorAll('[data-surprise]').forEach(card => {
    card.addEventListener('click', () => {
        const type = card.dataset.surprise;
        if (type === 'message') openMessage();
        if (type === 'video') openVideo(card);
        if (type === 'letter') openLetter();
    });
});

document.querySelectorAll('[data-close-modal]').forEach(button => {
    button.addEventListener('click', () => closeModal());
});

document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modal.classList.contains('open')) closeModal();
});

document.getElementById('playNowButton').addEventListener('click', openMessage);
document.getElementById('myListButton').addEventListener('click', () => {
    document.getElementById('finale').scrollIntoView({ behavior: 'smooth' });
});

// Finale WhatsApp CTA: no redirect; show manual hint text only.
const waBtn = document.getElementById('wa-btn');
const manualWaHint = document.getElementById('manual-wa-hint');
if (waBtn && manualWaHint) {
    waBtn.addEventListener('click', () => {
        manualWaHint.textContent = 'Please open WhatsApp manually ❤️';
        manualWaHint.classList.add('visible');
    });
}

musicButton.addEventListener('click', toggleMusic);
music.addEventListener('play', setMusicButton);
music.addEventListener('pause', setMusicButton);


createEmojiRain();
updateCountdown();
setInterval(updateCountdown, 1000);

// Confetti after 12:00 AM (local time)
function maybeStartConfetti() {
    // Trigger once per page load, not repeatedly.
    if (window.__confettiStarted) return;

    const now = new Date();
    const afterMidnight = now.getHours() === 0 && now.getMinutes() >= 0;

    if (afterMidnight) {
        window.__confettiStarted = true;

        const make = (count) => {
            const frag = document.createDocumentFragment();
            for (let i = 0; i < count; i += 1) {
                const d = document.createElement('span');
                d.textContent = ['🎉', '✨', '🎂', '🥳', '💕'][Math.floor(Math.random() * 5)];
                d.style.position = 'fixed';
                d.style.top = '-10vh';
                d.style.left = `${Math.random() * 100}vw`;
                d.style.fontSize = `${14 + Math.random() * 18}px`;
                d.style.zIndex = '2000';
                d.style.pointerEvents = 'none';
                d.style.opacity = '0.95';
                d.style.filter = 'drop-shadow(0 0 10px rgba(255, 80, 160, 0.45))';
                d.style.transition = 'transform 1.8s ease, opacity 1.8s ease';

                // animate
                requestAnimationFrame(() => {
                    d.style.transform = `translateY(${120 + Math.random() * 60}vh) rotate(${Math.random() * 720}deg)`;
                    d.style.opacity = '0';
                });

                setTimeout(() => d.remove(), 1900 + Math.random() * 400);
                frag.appendChild(d);
            }
            document.body.appendChild(frag);
        };

        make(60);
    }
}

maybeStartConfetti();

