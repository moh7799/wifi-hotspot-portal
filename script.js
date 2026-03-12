// ===== THEME MANAGEMENT =====
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

function setTheme(theme) {
    body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeToggle.textContent = theme === 'dark' ? '☀️ Light mode' : '🌙 Night mode';
}

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);

themeToggle.addEventListener('click', () => {
    const current = body.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
});

// ===== PARTICLES BACKGROUND =====
function createParticles() {
    const container = document.getElementById('particles');
    const count = 40; // Reduced for performance
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (Math.random() * 6 + 8) + 's';
        particle.style.width = (Math.random() * 6 + 2) + 'px';
        particle.style.height = particle.style.width;
        container.appendChild(particle);
    }
}
createParticles();

// ===== PASSWORD HISTORY (LocalStorage) =====
function loadHistory() {
    return JSON.parse(localStorage.getItem('passwordHistory') || '[]');
}

function saveHistory(username, password) {
    const history = loadHistory();
    history.unshift({
        username,
        password,
        time: new Date().toLocaleString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        })
    });
    if (history.length > 10) history.length = 10;
    localStorage.setItem('passwordHistory', JSON.stringify(history));
}

function renderHistory() {
    const history = loadHistory();
    const container = document.getElementById('historyContent');
    if (history.length === 0) {
        container.innerHTML = '<p class="empty-history">No records yet</p>';
        return;
    }
    container.innerHTML = history.map(item => `
        <div class="history-item">
            <div style="font-weight:600; color:var(--accent); margin-bottom:4px;">${item.username}</div>
            <div style="font-size:0.9rem; margin-bottom:4px;">🔑 ${item.password}</div>
            <div style="font-size:0.75rem; opacity:0.8;">${item.time}</div>
        </div>
    `).join('');
}

// Modal controls
const modal = document.getElementById('passwordModal');
const showHistoryBtn = document.getElementById('showHistoryBtn');
const closeModalBtn = document.getElementById('closeModalBtn');

showHistoryBtn.addEventListener('click', () => {
    renderHistory();
    modal.classList.add('active');
});

closeModalBtn.addEventListener('click', () => {
    modal.classList.remove('active');
});

window.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
});

// ===== LOGIN FORM =====
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const speedSelect = document.getElementById('speed');
const statusDiv = document.getElementById('connectionStatus');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    const speed = speedSelect.value;

    if (!username || !password) return;

    saveHistory(username, password);

    statusDiv.textContent = `Connecting at ${speed} Mbps...`;
    statusDiv.className = 'status';

    setTimeout(() => {
        statusDiv.textContent = 'Connected successfully!';
        statusDiv.className = 'status connected';

        setTimeout(() => {
            alert(`Login successful!\n\nUser: ${username}\nSpeed: ${speed} Mbps`);
        }, 300);
    }, 2000);
});

// ===== SUPPORT FUNCTIONS =====
document.getElementById('smsBtn').addEventListener('click', () => {
    window.open('sms:?body=Help needed with 4G connection');
});

document.getElementById('callBtn').addEventListener('click', () => {
    window.open('tel:+967712345678');
});

document.getElementById('unlimitedToggle').addEventListener('click', () => {
    speedSelect.value = speedSelect.value === 'unlimited' ? '10' : 'unlimited';
});

document.getElementById('adBanner').addEventListener('click', () => {
    alert('Special offer: 20 Mbps for the price of 5 Mbps!\n\nContact via WhatsApp to book now.');
});

// ===== PERSIST LAST USERNAME =====
usernameInput.addEventListener('blur', () => {
    localStorage.setItem('lastUsername', usernameInput.value);
});

window.addEventListener('load', () => {
    const last = localStorage.getItem('lastUsername');
    if (last) usernameInput.value = last;
});