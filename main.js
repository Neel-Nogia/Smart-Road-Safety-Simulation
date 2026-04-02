/* =========================================
   SMARTGUARD – MAIN JAVASCRIPT
   Convergence 2026 | HT202603
   ========================================= */

'use strict';

// Polyfill for roundRect
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;
  };
}

/* ============================
   PARTICLE BACKGROUND
   ============================ */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animId;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.floor((W * H) / 14000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.5 + 0.3,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.5 + 0.1
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 212, 255, ${p.alpha})`;
      ctx.fill();
    });
    // Draw connecting lines for nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 212, 255, ${(1 - dist / 100) * 0.08})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    animId = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); createParticles(); });
  resize();
  createParticles();
  draw();
})();

/* ============================
   NAVBAR
   ============================ */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  document.getElementById('scrollTop').classList.toggle('visible', window.scrollY > 400);
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

document.getElementById('scrollTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================
   COUNTER ANIMATION
   ============================ */
function animateCounter(el, target, duration = 2000, suffix = '') {
  const start = performance.now();
  const isFloat = !Number.isInteger(target);
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const val = target * ease;
    el.textContent = isFloat ? val.toFixed(2) : Math.floor(val).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = isFloat ? target.toFixed(2) : target.toLocaleString();
  }
  requestAnimationFrame(update);
}

/* ============================
   SCROLL REVEAL
   ============================ */
function setupReveal() {
  const els = document.querySelectorAll(
    '.problem-card, .feature-card, .tech-item, .arch-node, .sol-feature, .impact-card, .timeline-item, .team-card, .chart-card'
  );
  els.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const delay = e.target.dataset.delay || 0;
        setTimeout(() => e.target.classList.add('visible'), parseInt(delay));
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  els.forEach(el => observer.observe(el));
}

/* ============================
   STAT COUNTERS
   ============================ */
function setupStatCounters() {
  const heroStats = document.querySelectorAll('.stat-num');
  const impactNums = document.querySelectorAll('.impact-num');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const target = parseFloat(e.target.dataset.target);
        animateCounter(e.target, target);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  [...heroStats, ...impactNums].forEach(el => observer.observe(el));
}

/* ============================
   BAR ANIMATIONS
   ============================ */
function setupBars() {
  const bars = document.querySelectorAll('.bar-fill, .metric-fill');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const w = e.target.dataset.width || e.target.style.width;
        e.target.style.width = w;
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(b => observer.observe(b));
}

/* ============================
   FLOW STEPS CYCLE
   ============================ */
function setupFlowCycle() {
  const steps = document.querySelectorAll('.flow-step');
  let current = 0;
  if (!steps.length) return;
  setInterval(() => {
    steps[current].classList.remove('active');
    current = (current + 1) % steps.length;
    steps[current].classList.add('active');
  }, 1200);
}

/* ============================
   CHARTS
   ============================ */
function setupCharts() {
  const chartDefaults = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#94a3b8', font: { size: 11 } } }
    },
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(30,58,95,0.5)' } },
      y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(30,58,95,0.5)' } }
    }
  };

  // Accident Reduction Chart
  new Chart(document.getElementById('reductionChart'), {
    type: 'bar',
    data: {
      labels: ['Without SG', 'Month 1', 'Month 3', 'Month 6', 'Year 1', 'Year 2'],
      datasets: [{
        label: 'Accidents per Month',
        data: [100, 75, 55, 42, 35, 32],
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 280);
          gradient.addColorStop(0, 'rgba(0,212,255,0.8)');
          gradient.addColorStop(1, 'rgba(0,212,255,0.1)');
          return gradient;
        },
        borderColor: '#00d4ff',
        borderWidth: 1,
        borderRadius: 4
      }]
    },
    options: {
      ...chartDefaults,
      plugins: {
        ...chartDefaults.plugins,
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.raw}% of baseline`
          }
        }
      }
    }
  });

  // Weather Performance Chart
  new Chart(document.getElementById('weatherChart'), {
    type: 'radar',
    data: {
      labels: ['Clear Day', 'Night', 'Fog', 'Rain', 'Dust', 'Snow'],
      datasets: [{
        label: 'SmartGuard',
        data: [98, 95, 90, 88, 92, 85],
        backgroundColor: 'rgba(0,212,255,0.15)',
        borderColor: '#00d4ff',
        pointBackgroundColor: '#00d4ff',
        pointRadius: 4
      }, {
        label: 'Static Signboards',
        data: [60, 20, 10, 25, 30, 15],
        backgroundColor: 'rgba(239,68,68,0.1)',
        borderColor: '#ef4444',
        pointBackgroundColor: '#ef4444',
        pointRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#94a3b8', font: { size: 11 } } } },
      scales: {
        r: {
          ticks: { color: '#94a3b8', backdropColor: 'transparent' },
          grid: { color: 'rgba(30,58,95,0.5)' },
          pointLabels: { color: '#94a3b8', font: { size: 10 } },
          min: 0, max: 100
        }
      }
    }
  });

  // Cost Comparison Chart
  new Chart(document.getElementById('costChart'), {
    type: 'doughnut',
    data: {
      labels: ['SmartGuard (₹3.5K)', 'CCTV System (₹25K)', 'Smart Signage (₹40K)', 'Highway IoT (₹80K)'],
      datasets: [{
        data: [3500, 25000, 40000, 80000],
        backgroundColor: ['#00d4ff', '#f59e0b', '#ef4444', '#a855f7'],
        borderColor: '#0a1628',
        borderWidth: 3,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#94a3b8', font: { size: 10 }, padding: 12 }
        }
      }
    }
  });
}

/* ============================
   TEAM CARDS
   ============================ */
function renderTeam() {
  const team = [
    { name: 'Team Lead', role: 'IoT Architect', skills: 'ESP32 · MQTT · Circuit Design', color: '#00d4ff', initial: 'TL' },
    { name: 'Dev Member', role: 'Embedded Dev', skills: 'Arduino · C/C++ · Sensors', color: '#f59e0b', initial: 'EM' },
    { name: 'AI Engineer', role: 'Edge AI / CV', skills: 'TensorFlow Lite · Python · OpenCV', color: '#a855f7', initial: 'AI' },
    { name: 'Cloud Dev', role: 'Cloud & Dashboard', skills: 'Firebase · Node-RED · Grafana', color: '#10b981', initial: 'CD' }
  ];

  const grid = document.getElementById('teamGrid');
  grid.innerHTML = team.map(m => `
    <div class="team-card reveal">
      <div class="team-avatar" style="background:${m.color}22; color:${m.color};">${m.initial}</div>
      <div class="team-name">${m.name}</div>
      <div class="team-role" style="color:${m.color}">${m.role}</div>
      <div class="team-skills">${m.skills}</div>
    </div>
  `).join('');
}

/* ============================
   SIMULATION ENGINE
   ============================ */
(function SimulationEngine() {
  const canvas = document.getElementById('simCanvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const startBtn = document.getElementById('startSim');
  const overlay = document.getElementById('simOverlay');
  const speedSlider = document.getElementById('speedSlider');
  const rangeSlider = document.getElementById('rangeSlider');
  const fogToggle = document.getElementById('fogToggle');
  const nightToggle = document.getElementById('nightToggle');
  const speedVal = document.getElementById('speedVal');
  const rangeVal = document.getElementById('rangeVal');
  const scenarioBtns = document.querySelectorAll('.scenario-btn');
  const logEntries = document.getElementById('logEntries');
  const eventCount = document.getElementById('eventCount');
  const responseTimeEl = document.getElementById('responseTime');

  // Status indicators
  const statusEls = {
    sensorA: document.getElementById('sensorAStatus'),
    sensorB: document.getElementById('sensorBStatus'),
    alertA: document.getElementById('alertAStatus'),
    alertB: document.getElementById('alertBStatus')
  };

  let running = false;
  let animFrame;
  let totalEvents = 0;
  let scenario = 'normal';
  let fogMode = false;
  let nightMode = false;

  // Road geometry
  const roadX = W / 2;
  const curveRadius = 80;
  const curveCenter = { x: W / 2, y: H / 2 };

  // Vehicles
  let vehicles = [];
  let sensorAAlert = false;
  let sensorBAlert = false;
  let lastAlertTime = 0;
  let alertActive = false;

  // Sensor positions
  const SENSOR_A = { x: 80, y: H / 2 - 60 };
  const SENSOR_B = { x: W - 80, y: H / 2 + 60 };

  // Alert LED positions
  const LED_A = { x: 120, y: 40 };
  const LED_B = { x: W - 120, y: 40 };

  class Vehicle {
    constructor(fromLeft, opts = {}) {
      this.fromLeft = fromLeft;
      this.speed = opts.speed || (Math.random() * 2 + 1.5);
      this.type = opts.type || 'car'; // car, truck, bike
      this.color = this.type === 'truck' ? '#f59e0b' : this.type === 'bike' ? '#a78bfa' : '#60a5fa';
      this.w = this.type === 'truck' ? 36 : this.type === 'bike' ? 14 : 22;
      this.h = this.type === 'truck' ? 60 : this.type === 'bike' ? 36 : 44;
      this.detected = false;
      this.x = fromLeft ? -this.w - 20 : W + this.w + 20;
      this.y = fromLeft ? H / 2 - 40 : H / 2 + 40;
      this.headlightOn = nightMode;
    }

    update() {
      if (this.fromLeft) {
        this.x += this.speed;
        this.y = H / 2 - 40 + Math.sin(this.x / 100) * 10;
      } else {
        this.x -= this.speed;
        this.y = H / 2 + 40 - Math.sin(this.x / 100) * 10;
      }
    }

    isOffScreen() {
      return this.fromLeft ? this.x > W + 60 : this.x < -60;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      if (!this.fromLeft) ctx.scale(-1, 1);

      // Body
      ctx.fillStyle = this.color;
      if (this.type === 'truck') {
        ctx.beginPath();
        ctx.roundRect(-this.w/2, -this.h/2, this.w, this.h, 3);
        ctx.fill();
        ctx.fillStyle = '#fff9'; ctx.fillRect(-this.w/2+4, -this.h/2+6, this.w-8, 14);
        // Wheels
        ctx.fillStyle = '#1a1a2e';
        [[-this.w/2+2, -this.h/2+2], [this.w/2-8, -this.h/2+2],
         [-this.w/2+2, this.h/2-10], [this.w/2-8, this.h/2-10]].forEach(([wx, wy]) => {
          ctx.beginPath(); ctx.roundRect(wx, wy, 6, 8, 1); ctx.fill();
        });
      } else if (this.type === 'bike') {
        ctx.beginPath(); ctx.roundRect(-this.w/2, -this.h/2, this.w, this.h, 2); ctx.fill();
        ctx.fillStyle = '#1a1a2e';
        ctx.beginPath(); ctx.ellipse(0, -this.h/2+5, 5, 3, 0, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(0, this.h/2-5, 5, 3, 0, 0, Math.PI*2); ctx.fill();
      } else {
        ctx.beginPath();
        ctx.roundRect(-this.w/2, -this.h/2, this.w, this.h, 4);
        ctx.fill();
        ctx.fillStyle = '#fff6';
        ctx.fillRect(-this.w/2+3, -this.h/2+5, this.w-6, 12);
        ctx.fillRect(-this.w/2+3, -this.h/2+22, this.w-6, 10);
        ctx.fillStyle = '#1a1a2e';
        [[-this.w/2, -this.h/2], [this.w/2-6, -this.h/2],
         [-this.w/2, this.h/2-8], [this.w/2-6, this.h/2-8]].forEach(([wx, wy]) => {
          ctx.beginPath(); ctx.roundRect(wx, wy, 6, 8, 1); ctx.fill();
        });
      }

      // Headlights
      if (this.headlightOn || nightMode) {
        ctx.fillStyle = '#fffbc0';
        ctx.beginPath(); ctx.arc(-this.w/2+2, -this.h/2+4, 3, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(this.w/2-2, -this.h/2+4, 3, 0, Math.PI*2); ctx.fill();
        ctx.save();
        ctx.globalAlpha = 0.12;
        ctx.fillStyle = '#fffbc0';
        ctx.beginPath(); ctx.ellipse(0, -this.h/2 - 30, 20, 60, 0, 0, Math.PI*2); ctx.fill();
        ctx.restore();
      }

      // Taillights
      ctx.fillStyle = '#ef4444';
      ctx.beginPath(); ctx.arc(-this.w/2+2, this.h/2-4, 3, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(this.w/2-2, this.h/2-4, 3, 0, Math.PI*2); ctx.fill();

      ctx.restore();
    }

    distanceTo(sensor) {
      const dx = this.x - sensor.x;
      const dy = this.y - sensor.y;
      return Math.sqrt(dx * dx + dy * dy);
    }
  }

  function spawnVehicle() {
    const fromLeft = vehicles.filter(v => v.fromLeft).length < 1;
    const fromRight = vehicles.filter(v => !v.fromLeft).length < 1;
    const speed = parseFloat(speedSlider.value) / 20;
    const types = scenario === 'heavy' ? ['truck'] : ['car', 'car', 'bike'];
    const type = types[Math.floor(Math.random() * types.length)];
    if (fromLeft || fromRight) {
      const dir = fromLeft ? true : (fromRight ? false : Math.random() > 0.5);
      vehicles.push(new Vehicle(dir, { speed, type }));
    }
  }

  let spawnTimer = 0;

  function updateSensors() {
    const range = parseFloat(rangeSlider.value) * 35;
    let newSensorA = false, newSensorB = false;

    vehicles.forEach(v => {
      const distA = v.distanceTo(SENSOR_A);
      const distB = v.distanceTo(SENSOR_B);
      if (distA < range) newSensorA = true;
      if (distB < range) newSensorB = true;
    });

    const wasAlertActive = alertActive;
    alertActive = newSensorA && newSensorB;
    const eitherDetected = newSensorA || newSensorB;

    // Update indicators
    setStatus(statusEls.sensorA, newSensorA ? 'DETECT' : 'IDLE', newSensorA ? 'active-status' : 'idle-status');
    setStatus(statusEls.sensorB, newSensorB ? 'DETECT' : 'IDLE', newSensorB ? 'active-status' : 'idle-status');
    setStatus(statusEls.alertA, alertActive ? 'ON' : 'OFF', alertActive ? 'alert-status' : 'idle-status');
    setStatus(statusEls.alertB, alertActive ? 'ON' : 'OFF', alertActive ? 'alert-status' : 'idle-status');

    if (!wasAlertActive && alertActive) {
      const responseMs = Math.floor(Math.random() * 80 + 200);
      responseTimeEl.textContent = responseMs + ' ms';
      responseTimeEl.className = 'status-indicator active-status';
      totalEvents++;
      eventCount.textContent = totalEvents;
      addLog(`COLLISION RISK DETECTED – Alert activated!`, 'alert');
      lastAlertTime = Date.now();
    }

    if (wasAlertActive && !alertActive) {
      addLog(`All clear – Vehicles passed safely`, 'clear');
      setStatus(responseTimeEl, '-- ms', 'idle-status');
    }

    if (!wasAlertActive && eitherDetected && !alertActive) {
      addLog(`Vehicle detected on ${newSensorA ? 'Sensor A' : 'Sensor B'}`, 'detect');
    }

    sensorAAlert = newSensorA;
    sensorBAlert = newSensorB;
  }

  function setStatus(el, text, cls) {
    if (!el) return;
    el.textContent = text;
    el.className = 'status-indicator ' + cls;
  }

  let logCount = 0;
  function addLog(msg, type) {
    const now = new Date();
    const time = `[${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}]`;
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = `${time} ${msg}`;
    logEntries.insertBefore(entry, logEntries.firstChild);
    logCount++;
    if (logCount > 50) logEntries.removeChild(logEntries.lastChild);
  }

  function drawRoad() {
    // Night sky
    if (nightMode) {
      ctx.fillStyle = '#030810';
      ctx.fillRect(0, 0, W, H);
    } else {
      ctx.fillStyle = '#0a1628';
      ctx.fillRect(0, 0, W, H);
      // Sky gradient
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, '#051020');
      sky.addColorStop(1, '#0a1830');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);
    }

    // Grid lines
    ctx.strokeStyle = 'rgba(30,58,95,0.3)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < W; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Road (S-curve)
    ctx.save();
    ctx.strokeStyle = '#1a1a2e';
    ctx.lineWidth = 80;
    ctx.beginPath();
    ctx.moveTo(0, H * 0.3);
    ctx.bezierCurveTo(W * 0.3, H * 0.3, W * 0.7, H * 0.7, W, H * 0.7);
    ctx.stroke();
    ctx.restore();

    // Road surface
    ctx.save();
    ctx.strokeStyle = '#222235';
    ctx.lineWidth = 76;
    ctx.beginPath();
    ctx.moveTo(0, H * 0.3);
    ctx.bezierCurveTo(W * 0.3, H * 0.3, W * 0.7, H * 0.7, W, H * 0.7);
    ctx.stroke();
    ctx.restore();

    // Center line
    ctx.save();
    ctx.setLineDash([20, 15]);
    ctx.strokeStyle = '#f59e0b66';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, H * 0.3);
    ctx.bezierCurveTo(W * 0.3, H * 0.3, W * 0.7, H * 0.7, W, H * 0.7);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // Blind curve warning zone
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(W / 2, H / 2, 90, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Blind curve text
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 11px Orbitron, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('⚠ BLIND CURVE', W / 2, H / 2 + 4);
    ctx.restore();
  }

  function drawSensor(pos, label, active, side) {
    const col = active ? '#00d4ff' : '#1e3a5f';
    // Pulse ring
    if (active) {
      const range = parseFloat(rangeSlider.value) * 35;
      const alpha = 0.5 + 0.5 * Math.sin(Date.now() / 200);
      ctx.save();
      ctx.globalAlpha = 0.15 * alpha;
      ctx.fillStyle = '#00d4ff';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, range, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      ctx.save();
      ctx.globalAlpha = 0.4 * alpha;
      ctx.strokeStyle = '#00d4ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, range, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Sensor body
    ctx.save();
    ctx.shadowBlur = active ? 20 : 5;
    ctx.shadowColor = col;
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#0a1628';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    // Icon-like symbol
    ctx.fillStyle = '#0a1628';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('S', pos.x, pos.y + 4);

    // Label
    ctx.fillStyle = active ? '#00d4ff' : '#94a3b8';
    ctx.font = '10px Orbitron, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(label, pos.x, pos.y - 20);
  }

  function drawLEDBoard(pos, active) {
    const col = active ? '#ef4444' : '#1e3a5f';
    const textCol = active ? '#fff' : '#475569';

    ctx.save();
    // Board background
    ctx.shadowBlur = active ? 30 : 5;
    ctx.shadowColor = col;
    ctx.fillStyle = active ? '#1a0000' : '#0a1628';
    ctx.strokeStyle = col;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(pos.x - 80, pos.y - 20, 160, 40, 6);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Blinking LED dots
    if (active) {
      const blink = Math.sin(Date.now() / 150) > 0;
      for (let i = 0; i < 5; i++) {
        ctx.fillStyle = blink ? '#ef4444' : '#7f1d1d';
        ctx.beginPath();
        ctx.arc(pos.x - 60 + i * 30, pos.y, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.fillStyle = textCol;
    ctx.font = `bold ${active ? 11 : 10}px Orbitron, monospace`;
    ctx.textAlign = 'center';
    ctx.fillText(active ? '⚠ VEHICLE AHEAD' : 'ALL CLEAR', pos.x, pos.y + 4);
  }

  function drawDataPacket(from, to, progress) {
    const x = from.x + (to.x - from.x) * progress;
    const y = from.y + (to.y - from.y) * progress;
    ctx.save();
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00d4ff';
    ctx.fillStyle = '#00d4ff';
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
    // Trail
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.arc(x - (to.x - from.x) * 0.05, y - (to.y - from.y) * 0.05, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  let packetProgress = -1;
  let packetTimer = 0;

  function drawFog() {
    if (!fogMode) return;
    ctx.save();
    const grad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.8);
    grad.addColorStop(0, 'rgba(200,220,255,0.55)');
    grad.addColorStop(1, 'rgba(200,220,255,0.15)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  function drawConnLine(a, b, active) {
    ctx.save();
    ctx.setLineDash([6, 4]);
    ctx.strokeStyle = active ? 'rgba(0,212,255,0.5)' : 'rgba(30,58,95,0.4)';
    ctx.lineWidth = active ? 2 : 1;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  function drawHUD() {
    // Top info bar
    ctx.fillStyle = 'rgba(5,10,20,0.85)';
    ctx.beginPath(); ctx.roundRect(10, 10, 200, 32, 6); ctx.fill();
    ctx.fillStyle = '#94a3b8'; ctx.font = '10px Orbitron, monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`SMARTGUARD v1.0 | Events: ${totalEvents}`, 20, 30);

    // Bottom speed bar
    const speed = parseInt(speedSlider.value);
    ctx.fillStyle = 'rgba(5,10,20,0.85)';
    ctx.beginPath(); ctx.roundRect(W - 160, H - 42, 150, 32, 6); ctx.fill();
    ctx.fillStyle = '#94a3b8'; ctx.font = '10px Orbitron, monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`Speed: ${speed} km/h`, W - 20, H - 22);

    // Weather indicator
    if (fogMode || nightMode) {
      ctx.fillStyle = 'rgba(5,10,20,0.85)';
      ctx.beginPath(); ctx.roundRect(10, H - 42, 150, 32, 6); ctx.fill();
      ctx.fillStyle = '#f59e0b'; ctx.font = '10px Orbitron, monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`${fogMode ? '🌫 FOG' : ''} ${nightMode ? '🌙 NIGHT' : ''}`, 20, H - 22);
    }
  }

  function animate(ts) {
    if (!running) return;

    // Spawn vehicles periodically
    spawnTimer++;
    const spawnRate = scenario === 'collision' ? 40 : scenario === 'heavy' ? 60 : 80;
    if (spawnTimer > spawnRate) {
      spawnTimer = 0;
      spawnVehicle();
    }

    // Update vehicles
    vehicles = vehicles.filter(v => !v.isOffScreen());
    vehicles.forEach(v => v.update());

    // Update sensors
    updateSensors();

    // Packet animation
    if (alertActive) {
      packetTimer++;
      if (packetTimer > 30) {
        packetTimer = 0;
        packetProgress = 0;
      }
    }
    if (packetProgress >= 0 && packetProgress <= 1) {
      packetProgress += 0.04;
    } else if (packetProgress > 1) {
      packetProgress = -1;
    }

    // DRAW
    drawRoad();
    drawFog();

    // Draw connection lines
    drawConnLine(SENSOR_A, SENSOR_B, alertActive);

    // Data packet
    if (packetProgress >= 0 && packetProgress <= 1) {
      drawDataPacket(SENSOR_A, SENSOR_B, packetProgress);
    }

    // Sensors
    drawSensor(SENSOR_A, 'SENSOR A', sensorAAlert, 'left');
    drawSensor(SENSOR_B, 'SENSOR B', sensorBAlert, 'right');

    // LED Boards
    drawLEDBoard(LED_A, alertActive);
    drawLEDBoard(LED_B, alertActive);

    // Vehicles
    vehicles.forEach(v => v.draw());

    // HUD
    drawHUD();

    animFrame = requestAnimationFrame(animate);
  }

  startBtn.addEventListener('click', () => {
    running = true;
    overlay.classList.add('hidden');
    addLog('SmartGuard system initialized', 'detect');
    addLog('Sensors calibrated – Monitoring active', 'clear');
    animate();
  });

  speedSlider.addEventListener('input', () => {
    speedVal.textContent = speedSlider.value;
    vehicles.forEach(v => { v.speed = parseInt(speedSlider.value) / 20; });
  });

  rangeSlider.addEventListener('input', () => { rangeVal.textContent = rangeSlider.value; });
  fogToggle.addEventListener('change', () => { fogMode = fogToggle.checked; });
  nightToggle.addEventListener('change', () => { nightMode = nightToggle.checked; });

  scenarioBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      scenarioBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      scenario = btn.dataset.scenario;
      vehicles = [];
      addLog(`Scenario changed: ${scenario.toUpperCase()}`, 'detect');
    });
  });
})();

/* ============================
   INIT ON DOM READY
   ============================ */
document.addEventListener('DOMContentLoaded', () => {
  setupReveal();
  setupStatCounters();
  setupBars();
  setupFlowCycle();
  renderTeam();

  // Charts need a slight delay for DOM
  setTimeout(setupCharts, 300);

  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // Active nav link highlighting
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navAnchors.forEach(a => {
      a.style.color = a.getAttribute('href') === '#' + current ? '#00d4ff' : '';
    });
  });
});
