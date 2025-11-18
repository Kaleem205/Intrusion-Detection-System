// Data and Configuration
const sampleData = {
  attackTypes: [
    { name: 'Normal', color: '#00ff88', count: 85234 },
    { name: 'DoS', color: '#ff3366', count: 1523 },
    { name: 'Probe', color: '#ff9900', count: 892 },
    { name: 'R2L', color: '#9933ff', count: 234 },
    { name: 'U2R', color: '#ffcc00', count: 67 }
  ],
  protocols: ['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS', 'FTP', 'SSH'],
  services: ['http', 'smtp', 'ftp', 'ssh', 'telnet', 'dns', 'pop3'],
  flags: ['SF', 'S0', 'REJ', 'RSTO', 'SH', 'S1'],
  recentAlerts: [
    {
      timestamp: '2025-10-30 02:04:23',
      source_ip: '192.168.1.105',
      dest_ip: '10.0.0.50',
      attack_type: 'DoS',
      severity: 'Critical',
      action: 'Blocked'
    },
    {
      timestamp: '2025-10-30 02:03:45',
      source_ip: '172.16.0.88',
      dest_ip: '10.0.0.50',
      attack_type: 'Port Scan',
      severity: 'High',
      action: 'Monitored'
    },
    {
      timestamp: '2025-10-30 02:02:12',
      source_ip: '192.168.1.200',
      dest_ip: '10.0.0.25',
      attack_type: 'Probe',
      severity: 'Medium',
      action: 'Logged'
    },
    {
      timestamp: '2025-10-30 02:01:35',
      source_ip: '10.0.0.100',
      dest_ip: '192.168.1.50',
      attack_type: 'R2L',
      severity: 'High',
      action: 'Blocked'
    },
    {
      timestamp: '2025-10-30 02:00:58',
      source_ip: '172.16.0.120',
      dest_ip: '10.0.0.25',
      attack_type: 'DoS',
      severity: 'Critical',
      action: 'Blocked'
    }
  ],
  systemStats: {
    total_packets: 87950,
    threats_detected: 2716,
    normal_traffic: 85234,
    system_health: 94
  }
};

let threatChart = null;
let attackTypeChart = null;
let liveUpdateInterval = null;
let trafficFeedInterval = null;

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initializeNavigation();
  updateDateTime();
  setInterval(updateDateTime, 1000);
  
  // Initialize Dashboard
  animateCounters();
  initializeThreatChart();
  initializeAttackTypeChart();
  populateAlertsTable();
  
  // Initialize Real-Time Monitor
  updateThreatLevel();
  updateQuickStats();
  startLiveUpdates();
  startTrafficFeed();
  
  // Initialize Predict Page
  initializePredictionForm();
  
  // Notification button
  document.getElementById('notificationBtn').addEventListener('click', () => {
    showToast('You have 3 new security alerts');
  });
});

// Navigation
function initializeNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const pages = document.querySelectorAll('.page');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetPage = link.getAttribute('data-page');
      
      // Update active link
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      
      // Update active page
      pages.forEach(p => p.classList.remove('active'));
      document.getElementById(targetPage).classList.add('active');
      
      // Stop/start intervals based on page
      if (targetPage === 'realtime') {
        if (!liveUpdateInterval) startLiveUpdates();
        if (!trafficFeedInterval) startTrafficFeed();
      }
    });
  });
}

// Date and Time
function updateDateTime() {
  const now = new Date();
  const options = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };
  document.getElementById('datetime').textContent = now.toLocaleDateString('en-US', options);
}

// Counter Animation
function animateCounters() {
  animateCounter('totalPackets', 0, sampleData.systemStats.total_packets, 2000);
  animateCounter('threatsDetected', 0, sampleData.systemStats.threats_detected, 2000);
  animateCounter('normalTraffic', 0, sampleData.systemStats.normal_traffic, 2000);
  animateCounter('systemHealth', 0, sampleData.systemStats.system_health, 2000);
}

function animateCounter(id, start, end, duration) {
  const element = document.getElementById(id);
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = easeOutQuart(progress);
    const current = Math.floor(start + (end - start) * easeProgress);
    element.textContent = current.toLocaleString();
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

function easeOutQuart(x) {
  return 1 - Math.pow(1 - x, 4);
}

// Threat Chart
function initializeThreatChart() {
  const ctx = document.getElementById('threatChart').getContext('2d');
  
  const hours = [];
  const normalData = [];
  const dosData = [];
  const probeData = [];
  const r2lData = [];
  const u2rData = [];
  
  for (let i = 23; i >= 0; i--) {
    hours.push(`${i}:00`);
    normalData.push(Math.floor(Math.random() * 3000) + 2000);
    dosData.push(Math.floor(Math.random() * 100) + 20);
    probeData.push(Math.floor(Math.random() * 60) + 10);
    r2lData.push(Math.floor(Math.random() * 20) + 5);
    u2rData.push(Math.floor(Math.random() * 10) + 2);
  }
  
  threatChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: hours.reverse(),
      datasets: [
        {
          label: 'Normal',
          data: normalData.reverse(),
          borderColor: '#00ff88',
          backgroundColor: 'rgba(0, 255, 136, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'DoS',
          data: dosData.reverse(),
          borderColor: '#ff3366',
          backgroundColor: 'rgba(255, 51, 102, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Probe',
          data: probeData.reverse(),
          borderColor: '#ff9900',
          backgroundColor: 'rgba(255, 153, 0, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'R2L',
          data: r2lData.reverse(),
          borderColor: '#9933ff',
          backgroundColor: 'rgba(153, 51, 255, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'U2R',
          data: u2rData.reverse(),
          borderColor: '#ffcc00',
          backgroundColor: 'rgba(255, 204, 0, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: '#a7a9a9',
            padding: 15,
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(15, 20, 25, 0.95)',
          titleColor: '#f5f5f5',
          bodyColor: '#a7a9a9',
          borderColor: '#00d4ff',
          borderWidth: 1
        }
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.05)',
            drawBorder: false
          },
          ticks: {
            color: '#a7a9a9',
            font: {
              size: 11
            }
          }
        },
        y: {
          grid: {
            color: 'rgba(255, 255, 255, 0.05)',
            drawBorder: false
          },
          ticks: {
            color: '#a7a9a9',
            font: {
              size: 11
            }
          }
        }
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      }
    }
  });
}

// Attack Type Chart
function initializeAttackTypeChart() {
  const ctx = document.getElementById('attackTypeChart').getContext('2d');
  
  attackTypeChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: sampleData.attackTypes.map(a => a.name),
      datasets: [{
        data: sampleData.attackTypes.map(a => a.count),
        backgroundColor: sampleData.attackTypes.map(a => a.color),
        borderColor: '#0f1419',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#a7a9a9',
            padding: 15,
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(15, 20, 25, 0.95)',
          titleColor: '#f5f5f5',
          bodyColor: '#a7a9a9',
          borderColor: '#00d4ff',
          borderWidth: 1,
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${label}: ${value.toLocaleString()} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}

// Alerts Table
function populateAlertsTable() {
  const tbody = document.getElementById('alertsTableBody');
  tbody.innerHTML = '';
  
  sampleData.recentAlerts.forEach(alert => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${alert.timestamp}</td>
      <td>${alert.source_ip}</td>
      <td>${alert.dest_ip}</td>
      <td>${alert.attack_type}</td>
      <td><span class="severity-badge severity-${alert.severity.toLowerCase()}">${alert.severity}</span></td>
      <td><span class="action-badge">${alert.action}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

// Real-Time Monitor Updates
function updateThreatLevel() {
  const threatLevel = Math.floor(Math.random() * 100);
  const gauge = document.getElementById('gaugeFill');
  const number = document.getElementById('threatLevel');
  const status = document.getElementById('threatStatus');
  
  // Update gauge
  const offset = 251.2 - (threatLevel / 100) * 251.2;
  gauge.style.strokeDashoffset = offset;
  
  // Update color based on level
  let color, statusText;
  if (threatLevel <= 30) {
    color = '#00ff88';
    statusText = 'System Secure';
  } else if (threatLevel <= 60) {
    color = '#ffcc00';
    statusText = 'Elevated Risk';
  } else if (threatLevel <= 80) {
    color = '#ff9900';
    statusText = 'High Alert';
  } else {
    color = '#ff3366';
    statusText = 'Critical Threat';
  }
  
  gauge.style.stroke = color;
  number.textContent = threatLevel;
  status.textContent = statusText;
  status.style.color = color;
  status.style.borderColor = color;
  status.style.background = `${color}20`;
}

function updateQuickStats() {
  document.getElementById('packetsPerSec').textContent = Math.floor(Math.random() * 500) + 100;
  document.getElementById('bandwidth').textContent = (Math.random() * 100 + 20).toFixed(1) + ' MB/s';
  document.getElementById('activeConnections').textContent = Math.floor(Math.random() * 200) + 50;
  document.getElementById('blockedThreats').textContent = Math.floor(Math.random() * 50) + 10;
}

function startLiveUpdates() {
  updateThreatLevel();
  updateQuickStats();
  liveUpdateInterval = setInterval(() => {
    updateThreatLevel();
    updateQuickStats();
  }, 3000);
}

// Traffic Feed
function startTrafficFeed() {
  const feed = document.getElementById('trafficFeed');
  
  function addTrafficItem() {
    const protocols = ['TCP', 'UDP', 'ICMP', 'HTTP'];
    const sources = ['192.168.1.105', '172.16.0.88', '10.0.0.25', '192.168.1.200', '172.16.0.120'];
    const destinations = ['10.0.0.50', '10.0.0.25', '192.168.1.1', '172.16.0.1'];
    const flags = ['SF', 'S0', 'REJ', 'RSTO'];
    
    const isThreat = Math.random() < 0.2;
    const protocol = protocols[Math.floor(Math.random() * protocols.length)];
    const source = sources[Math.floor(Math.random() * sources.length)];
    const dest = destinations[Math.floor(Math.random() * destinations.length)];
    const flag = flags[Math.floor(Math.random() * flags.length)];
    
    const now = new Date();
    const time = now.toTimeString().split(' ')[0];
    
    const item = document.createElement('div');
    item.className = `traffic-item ${isThreat ? 'threat' : ''}`;
    item.innerHTML = `
      <span class="traffic-time">${time}</span>
      <span class="traffic-protocol">${protocol}</span>
      <span class="traffic-details">${source} → ${dest} [${flag}]${isThreat ? ' ⚠ THREAT DETECTED' : ''}</span>
    `;
    
    feed.insertBefore(item, feed.firstChild);
    
    // Keep only last 20 items
    while (feed.children.length > 20) {
      feed.removeChild(feed.lastChild);
    }
  }
  
  // Add initial items
  for (let i = 0; i < 10; i++) {
    addTrafficItem();
  }
  
  // Continue adding
  trafficFeedInterval = setInterval(addTrafficItem, 2000);
}

// Prediction Form
function initializePredictionForm() {
  const form = document.getElementById('predictionForm');
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const formData = {
      protocol: document.getElementById('protocol').value,
      service: document.getElementById('service').value,
      flag: document.getElementById('flag').value,
      srcBytes: parseInt(document.getElementById('srcBytes').value),
      dstBytes: parseInt(document.getElementById('dstBytes').value),
      count: parseInt(document.getElementById('count').value),
      srvCount: parseInt(document.getElementById('srvCount').value),
      duration: parseInt(document.getElementById('duration').value)
    };
    
    // Simulate prediction
    setTimeout(() => {
      showPredictionResult(formData);
    }, 500);
  });
}

function showPredictionResult(formData) {
  const resultCard = document.getElementById('resultCard');
  
  // Simple prediction logic for demo
  let isNormal = true;
  let attackType = 'Normal';
  let confidence = 95 + Math.random() * 4;
  
  // Simple heuristics
  if (formData.srcBytes > 10000 || formData.count > 400) {
    isNormal = false;
    attackType = 'DoS Attack';
    confidence = 92 + Math.random() * 6;
  } else if (formData.flag === 'REJ' || formData.flag === 'RSTO') {
    isNormal = false;
    attackType = 'Probe/Port Scan';
    confidence = 88 + Math.random() * 8;
  } else if (formData.count > 250) {
    isNormal = false;
    attackType = 'Suspicious Activity';
    confidence = 85 + Math.random() * 10;
  }
  
  resultCard.innerHTML = `
    <div class="result-content">
      <h3 class="result-status ${isNormal ? 'normal' : 'attack'}">
        ${isNormal ? '✓ Normal Traffic' : '⚠ ' + attackType}
      </h3>
      
      <div class="result-confidence">
        <p class="result-label">Confidence Score</p>
        <div class="confidence-bar">
          <div class="confidence-fill" style="width: ${confidence}%">
            ${confidence.toFixed(1)}%
          </div>
        </div>
      </div>
      
      <div class="result-details">
        <h4 style="color: #00d4ff; margin-bottom: 16px;">Analysis Details</h4>
        <div class="result-detail-item">
          <span class="result-detail-label">Protocol</span>
          <span class="result-detail-value">${formData.protocol}</span>
        </div>
        <div class="result-detail-item">
          <span class="result-detail-label">Service</span>
          <span class="result-detail-value">${formData.service}</span>
        </div>
        <div class="result-detail-item">
          <span class="result-detail-label">Connection Flag</span>
          <span class="result-detail-value">${formData.flag}</span>
        </div>
        <div class="result-detail-item">
          <span class="result-detail-label">Data Transfer</span>
          <span class="result-detail-value">${(formData.srcBytes + formData.dstBytes).toLocaleString()} bytes</span>
        </div>
        <div class="result-detail-item">
          <span class="result-detail-label">Connection Count</span>
          <span class="result-detail-value">${formData.count}</span>
        </div>
        <div class="result-detail-item">
          <span class="result-detail-label">Duration</span>
          <span class="result-detail-value">${formData.duration}s</span>
        </div>
      </div>
    </div>
  `;
  
  showToast(isNormal ? 'Analysis Complete: Normal Traffic' : `Threat Detected: ${attackType}`);
}

// Toast Notification
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}