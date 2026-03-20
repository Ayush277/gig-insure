// ============ VIEW MANAGEMENT ============
function showView(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const view = document.getElementById(viewId);
  if (view) { view.classList.add('active'); window.scrollTo(0, 0); }
  // Update navbar visibility
  const navbar = document.getElementById('landing-nav');
  if (navbar) navbar.style.display = viewId === 'landing-view' ? 'flex' : 'none';
}

// ============ TOAST NOTIFICATIONS ============
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = 'toast show ' + type;
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ============ AUTH HANDLERS ============
function goToLogin() { showView('login-view'); }
function goToSignup() { showView('signup-view'); }
function goToLanding() { showView('landing-view'); }

function handleLogin(e) {
  e.preventDefault();
  const phone = document.getElementById('login-phone').value;
  if (!phone) { showToast('Please enter phone number', 'info'); return; }
  showToast('✓ OTP Verified — Logging in...', 'success');
  setTimeout(() => {
    showView('user-dash-view');
    initDashboard('user');
  }, 800);
}

function handleSignup(e) {
  e.preventDefault();
  const name = document.getElementById('signup-name').value;
  if (!name) { showToast('Please fill all fields', 'info'); return; }
  showToast('✓ Account Created — Welcome to GigInsure!', 'success');
  setTimeout(() => {
    showView('user-dash-view');
    initDashboard('user');
  }, 800);
}

function skipToDemo(role) {
  showToast('⚡ Demo Mode — Loading ' + (role === 'admin' ? 'Admin' : 'Worker') + ' Dashboard', 'info');
  setTimeout(() => {
    if (role === 'admin') {
      showView('admin-dash-view');
      initDashboard('admin');
    } else {
      showView('user-dash-view');
      initDashboard('user');
    }
  }, 600);
}

function logout() {
  showToast('Logged out successfully', 'info');
  setTimeout(() => showView('landing-view'), 500);
}

// ============ DASHBOARD TAB SWITCHING ============
function switchTab(dashType, tabName) {
  const prefix = dashType === 'admin' ? 'admin' : 'user';
  // Update nav
  document.querySelectorAll('#' + prefix + '-nav li[data-tab]').forEach(li => {
    li.classList.toggle('active', li.dataset.tab === tabName);
  });
  // Update content
  document.querySelectorAll('#' + prefix + '-tabs .dash-tab').forEach(tab => {
    tab.classList.toggle('active', tab.id === prefix + '-' + tabName);
  });
  // Update topbar title
  const titles = {
    overview: 'Overview', claims: dashType === 'admin' ? 'All Claims' : 'My Claims',
    plans: 'Insurance Plans', trust: 'Trust Score', fraud: 'Fraud Detection',
    workers: 'Workers', analytics: 'Analytics', settings: 'Settings'
  };
  const topTitle = document.getElementById(prefix + '-topbar-title');
  if (topTitle) topTitle.textContent = titles[tabName] || tabName;
}

// ============ VIEW SWITCH (User ↔ Admin) ============
function switchDashView(target) {
  document.querySelectorAll('.view-switch button').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  if (target === 'admin') {
    showView('admin-dash-view');
    initDashboard('admin');
  } else {
    showView('user-dash-view');
    initDashboard('user');
  }
}

// ============ INIT DASHBOARD ============
function initDashboard(type) {
  // Animate bars
  setTimeout(() => {
    document.querySelectorAll('.view.active .bar').forEach((bar, i) => {
      setTimeout(() => { bar.style.height = bar.dataset.height; }, i * 80);
    });
  }, 300);
  // Animate trust ring
  setTimeout(() => {
    document.querySelectorAll('.view.active .trust-circle').forEach(c => {
      c.style.strokeDashoffset = c.dataset.offset;
    });
  }, 500);
  updateClock();
}

// ============ CLOCK ============
function updateClock() {
  document.querySelectorAll('.live-clock').forEach(el => {
    el.textContent = new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit', second:'2-digit' });
  });
}
setInterval(updateClock, 1000);

// ============ LIVE FRAUD SCORE SIMULATION ============
setInterval(() => {
  document.querySelectorAll('.fraud-live').forEach(el => {
    const base = parseFloat(el.dataset.base || '0.12');
    const val = (base + (Math.random() * 0.04 - 0.02)).toFixed(3);
    el.textContent = val;
  });
}, 3000);

// ============ NAVBAR SCROLL ============
window.addEventListener('scroll', () => {
  const nav = document.getElementById('landing-nav');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
});

// ============ SCROLL ANIMATIONS ============
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.animate-in').forEach(el => observer.observe(el));

// ============ SMOOTH SCROLL ============
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    e.preventDefault();
    const t = document.querySelector(this.getAttribute('href'));
    if (t) t.scrollIntoView({ behavior:'smooth', block:'start' });
  });
});

// ============ CLAIM ACTION BUTTONS ============
function approveClaim(id) {
  showToast('✓ Claim ' + id + ' approved — payout initiated', 'success');
  const btn = event.target;
  btn.textContent = 'Approved';
  btn.disabled = true;
  btn.style.opacity = '0.5';
  // Update status badge in same row
  const row = btn.closest('tr');
  if (row) {
    const badge = row.querySelector('.status-badge');
    if (badge) { badge.className = 'status-badge approved'; badge.textContent = 'Approved'; }
  }
}

function flagClaim(id) {
  showToast('⚠ Claim ' + id + ' flagged for manual review', 'info');
  const btn = event.target;
  btn.textContent = 'Flagged';
  btn.disabled = true;
  btn.style.opacity = '0.5';
  const row = btn.closest('tr');
  if (row) {
    const badge = row.querySelector('.status-badge');
    if (badge) { badge.className = 'status-badge review'; badge.textContent = 'In Review'; }
  }
}

// ============ INIT ON LOAD ============
window.addEventListener('DOMContentLoaded', () => {
  showView('landing-view');
});
