// ===== STARFIELD =====
const starCanvas = document.getElementById('starfield');
const sCtx = starCanvas.getContext('2d');
let stars = [];

function resizeStarfield() {
  starCanvas.width = window.innerWidth;
  starCanvas.height = window.innerHeight;
  stars = Array.from({ length: 200 }, () => ({
    x: Math.random() * starCanvas.width,
    y: Math.random() * starCanvas.height,
    r: Math.random() * 1.5 + 0.3,
    a: Math.random(),
    speed: Math.random() * 0.008 + 0.003,
    twinkle: Math.random() * Math.PI * 2
  }));
}
resizeStarfield();
window.addEventListener('resize', resizeStarfield);

function drawStars() {
  sCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
  stars.forEach(s => {
    s.twinkle += s.speed;
    const alpha = 0.4 + 0.6 * Math.abs(Math.sin(s.twinkle));
    sCtx.beginPath();
    sCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    sCtx.fillStyle = `rgba(255, 240, 180, ${alpha})`;
    sCtx.fill();
  });
  requestAnimationFrame(drawStars);
}
drawStars();

// ===== FIREWORKS =====
const fwCanvas = document.getElementById('fireworks');
const fCtx = fwCanvas.getContext('2d');
fwCanvas.width = window.innerWidth;
fwCanvas.height = window.innerHeight;
window.addEventListener('resize', () => {
  fwCanvas.width = window.innerWidth;
  fwCanvas.height = window.innerHeight;
});

const fwParticles = [];
const fwColors = ['#d4a017','#f0c040','#ffe082','#e91e8c','#ff6ec7','#fff','#ff9800','#ce93d8'];

class FWParticle {
  constructor(x, y, color) {
    this.x = x; this.y = y; this.color = color;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 5 + 1;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.alpha = 1;
    this.radius = Math.random() * 3 + 1;
    this.trail = [];
  }
  update() {
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 6) this.trail.shift();
    this.x += this.vx; this.y += this.vy;
    this.vy += 0.06; this.vx *= 0.99;
    this.alpha -= 0.018;
  }
  draw() {
    // Trail
    this.trail.forEach((pt, i) => {
      fCtx.save();
      fCtx.globalAlpha = (i / this.trail.length) * this.alpha * 0.4;
      fCtx.fillStyle = this.color;
      fCtx.beginPath();
      fCtx.arc(pt.x, pt.y, this.radius * 0.5, 0, Math.PI * 2);
      fCtx.fill();
      fCtx.restore();
    });
    fCtx.save();
    fCtx.globalAlpha = this.alpha;
    fCtx.fillStyle = this.color;
    fCtx.shadowColor = this.color;
    fCtx.shadowBlur = 8;
    fCtx.beginPath();
    fCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    fCtx.fill();
    fCtx.restore();
  }
}

function launchFirework() {
  const x = 80 + Math.random() * (fwCanvas.width - 160);
  const y = 60 + Math.random() * fwCanvas.height * 0.5;
  const color = fwColors[Math.floor(Math.random() * fwColors.length)];
  for (let i = 0; i < 80; i++) fwParticles.push(new FWParticle(x, y, color));
}

function animFW() {
  fCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);
  for (let i = fwParticles.length - 1; i >= 0; i--) {
    fwParticles[i].update();
    fwParticles[i].draw();
    if (fwParticles[i].alpha <= 0) fwParticles.splice(i, 1);
  }
  requestAnimationFrame(animFW);
}
animFW();
setInterval(launchFirework, 1600);

// ===== PETALS =====
const petalContainer = document.getElementById('petals');
const petalSet = ['🌸','🌺','🌹','🌷','🪷','✿','❀','🌼'];

function spawnPetal() {
  const el = document.createElement('div');
  el.className = 'petal';
  el.textContent = petalSet[Math.floor(Math.random() * petalSet.length)];
  const size = 0.9 + Math.random() * 1.4;
  el.style.cssText = `
    left: ${Math.random() * 100}vw;
    font-size: ${size}rem;
    animation-duration: ${5 + Math.random() * 7}s;
    animation-delay: ${Math.random() * 3}s;
  `;
  petalContainer.appendChild(el);
  setTimeout(() => el.remove(), 14000);
}
setInterval(spawnPetal, 350);

// ===== MOUSE SPARKLE =====
document.addEventListener('mousemove', (e) => {
  if (Math.random() > 0.7) {
    const spark = document.createElement('div');
    spark.style.cssText = `
      position:fixed; left:${e.clientX}px; top:${e.clientY}px;
      width:6px; height:6px; border-radius:50%;
      background: radial-gradient(circle, #ffe082, #d4a017);
      pointer-events:none; z-index:9999;
      animation: sparkFade 0.6s ease forwards;
      transform: translate(-50%,-50%);
    `;
    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), 600);
  }
});

// Inject sparkFade keyframe
const sparkStyle = document.createElement('style');
sparkStyle.textContent = `@keyframes sparkFade { 0%{opacity:1;transform:translate(-50%,-50%) scale(1);} 100%{opacity:0;transform:translate(-50%,-200%) scale(0.2);} }`;
document.head.appendChild(sparkStyle);

// ===== PAGE NAVIGATION =====
function showPage(num) {
  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
  const page = document.getElementById('page' + num);
  page.classList.remove('hidden');
  // Re-trigger entry animations
  page.querySelectorAll('[class*="anim-"]').forEach(el => {
    const cls = [...el.classList].filter(c => c.startsWith('anim-'));
    cls.forEach(c => { el.classList.remove(c); void el.offsetWidth; el.classList.add(c); });
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // Extra fireworks on page change
  for (let i = 0; i < 3; i++) setTimeout(launchFirework, i * 300);
}

function openInvitation() { showPage(2); }

// ===== COUNTDOWN =====
function tick() {
  const target = new Date('2026-04-21T15:00:00');
  const diff = target - new Date();
  if (diff <= 0) {
    ['days','hours','minutes','seconds'].forEach(id => document.getElementById(id).textContent = '00');
    return;
  }
  document.getElementById('days').textContent    = String(Math.floor(diff / 86400000)).padStart(2,'0');
  document.getElementById('hours').textContent   = String(Math.floor((diff % 86400000) / 3600000)).padStart(2,'0');
  document.getElementById('minutes').textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2,'0');
  document.getElementById('seconds').textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2,'0');
}
setInterval(tick, 1000);
tick();
