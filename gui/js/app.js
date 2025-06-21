// Configuration
const CONFIG = {
  updateDuration: 500,
  baseline: 5,
  maxBlinks: 250,
  chartColors: {
    primary: '#6366f1',
    secondary: '#10b981',
    accent: '#f59e0b',
    background: 'rgba(30, 41, 59, 0.8)',
    border: '#4d5175'
  }
};

// Global variables
let charts = [];
let maxBlinks = CONFIG.maxBlinks;
let isLoading = false;

// Initialize the application
function init() {
  console.log('Initializing AEYE Health Dashboard...');
  
  // Show loading overlay
  showLoading();
  
  try {
    // Initialize charts
    charts = [
      initHealthTrendsChart(),
      initScreenTimeChart(),
      initAnalyticsChart()
    ];
    
    // Start data updates
    startDataUpdates();
    
    // Initialize smooth scrolling for navigation
    initSmoothScrolling();
    
    // Initialize loading states
    initLoadingStates();
    
    // Initialize scroll effects
    initScrollEffects();
    
    // Initialize intersection observer for animations
    initIntersectionObserver();
    
    console.log('Dashboard initialized successfully');
  } catch (error) {
    console.error('Failed to initialize dashboard:', error);
    showError('Failed to initialize dashboard', error.message);
  } finally {
    hideLoading();
  }
}

// Initialize Health Trends Chart
function initHealthTrendsChart() {
  const ctx = document.getElementById("smoolchart").getContext("2d");
  
  return new Chart(ctx, {
    type: "line",
    data: {
      labels: ["7am", "8am", "9am", "10am", "11am", "12pm"],
      datasets: [{
        fill: "origin",
        lineTension: 0.4,
        label: "Average Blink Frequency",
        backgroundColor: `${CONFIG.chartColors.primary}20`,
        borderColor: CONFIG.chartColors.primary,
        borderWidth: 2,
        data: [38, 20, 42, 35, 46, 29],
        elements: {
          point: {
            radius: 0,
            hoverRadius: 6,
            backgroundColor: CONFIG.chartColors.primary
          },
        },
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
          backgroundColor: CONFIG.chartColors.background,
          titleColor: '#f8fafc',
          bodyColor: '#cbd5e1',
          borderColor: CONFIG.chartColors.border,
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: false
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 60,
          grid: {
            display: false,
            drawBorder: false,
          },
          ticks: {
            display: false,
          },
        },
        x: {
          grid: {
            display: false,
            drawBorder: false,
          },
          ticks: {
            color: '#64748b',
            font: {
              size: 12
            }
          },
        },
      },
      interaction: {
        intersect: false,
        mode: 'index'
      }
    },
  });
}

// Initialize Screen Time Chart
function initScreenTimeChart() {
  const ctx = document.getElementById("piChart").getContext("2d");
  
  const pieData = {
    labels: ["Elapsed screen time", "Remaining recommended screen time"],
    datasets: [{
      data: [30, 70],
      backgroundColor: [CONFIG.chartColors.primary, `${CONFIG.chartColors.primary}40`],
      borderColor: CONFIG.chartColors.border,
      borderWidth: 1,
    }],
  };

  return new Chart(ctx, {
    type: "doughnut",
    data: pieData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
          backgroundColor: CONFIG.chartColors.background,
          titleColor: '#f8fafc',
          bodyColor: '#cbd5e1',
          borderColor: CONFIG.chartColors.border,
          borderWidth: 1,
          cornerRadius: 8
        },
      },
      cutout: '70%',
    },
  });
}

// Initialize Analytics Chart
function initAnalyticsChart() {
  const ctx = document.getElementById("myChart").getContext("2d");
  
  return new Chart(ctx, {
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    },
    type: "line",
    data: {
      labels: ["7am", "8am", "9am", "10am", "11am", "12pm"],
      datasets: [
        {
          label: "Average Blink Frequency",
          backgroundColor: CONFIG.chartColors.background,
          borderColor: CONFIG.chartColors.primary,
          borderWidth: 3,
          data: [3, 5, 8, 5, 6, 9],
          elements: {
            point: {
              radius: 6,
              borderWidth: 2,
              backgroundColor: CONFIG.chartColors.primary,
              borderColor: '#f8fafc'
            },
          },
          tension: 0.4
        },
        {
          label: "Baseline Blink Frequency",
          backgroundColor: 'transparent',
          borderColor: CONFIG.chartColors.secondary,
          borderWidth: 2,
          borderDash: [5, 5],
          data: Array(6).fill(CONFIG.baseline),
          elements: {
            point: {
              radius: 0,
            },
          },
          tension: 0
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: '#f8fafc',
            usePointStyle: true,
            padding: 20,
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          enabled: true,
          backgroundColor: CONFIG.chartColors.background,
          titleColor: '#f8fafc',
          bodyColor: '#cbd5e1',
          borderColor: CONFIG.chartColors.border,
          borderWidth: 1,
          cornerRadius: 8
        },
      },
      scales: {
        y: {
          beginAtZero: false,
          grid: {
            color: 'rgba(148, 163, 184, 0.1)',
            drawBorder: false,
          },
          ticks: {
            color: '#64748b',
            font: {
              size: 12
            }
          },
        },
        x: {
          grid: {
            color: 'rgba(148, 163, 184, 0.1)',
            drawBorder: false,
          },
          ticks: {
            color: '#64748b',
            font: {
              size: 12
            }
          },
        },
      },
      interaction: {
        intersect: false,
        mode: 'index'
      }
    },
  });
}

// Update data from storage
async function updateCount() {
  if (isLoading) return;
  
  try {
    isLoading = true;
    
    // Fetch data from storage
    const response = await fetch('./storage.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Data loaded:', data);
    
    const blinks = data?.blinkcounter || 0;
    maxBlinks = data?.maxblinks || CONFIG.maxBlinks;
    
    // Update progress indicator
    updateProgressIndicator(blinks, maxBlinks);
    
    // Update charts
    updateCharts(data);
    
    // Update suggestions
    updateSuggestions(blinks, maxBlinks);
    
  } catch (error) {
    console.error('Failed to update data:', error);
    showError('Failed to load health data', error.message);
  } finally {
    isLoading = false;
  }
}

// Update progress indicator
function updateProgressIndicator(blinks, maxBlinks) {
  const progressLabel = document.getElementById('progress-label');
  const progressFill = document.getElementById('progress-fill');
  
  if (progressLabel && progressFill) {
    // Animate the number
    animateNumber(progressLabel, blinks);
    
    // Update progress fill
    const percentage = Math.min(blinks / maxBlinks, 1);
    const topPosition = (1 - percentage) * 100;
    
    progressFill.style.top = `${topPosition}%`;
  }
}

// Animate number changes
function animateNumber(element, targetValue) {
  const startValue = parseInt(element.textContent) || 0;
  const duration = 500;
  const startTime = performance.now();
  
  function updateNumber(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const currentValue = Math.round(startValue + (targetValue - startValue) * easeOutQuart);
    
    element.textContent = currentValue;
    
    if (progress < 1) {
      requestAnimationFrame(updateNumber);
    }
  }
  
  requestAnimationFrame(updateNumber);
}

// Update charts with new data
function updateCharts(data) {
  if (charts.length >= 2) {
    // Update health trends chart
    const healthChart = charts[0];
    if (healthChart && data?.blinkhistory) {
      healthChart.data.datasets[0].data = data.blinkhistory;
      healthChart.update('none');
    }
    
    // Update screen time chart
    const screenChart = charts[1];
    if (screenChart) {
      const blinks = data?.blinkcounter || 0;
      const percentage = Math.min((blinks / maxBlinks) * 100, 100);
      const remaining = 100 - percentage;
      
      screenChart.data.datasets[0].data = [percentage, remaining];
      screenChart.update('none');
      
      // Update percentage display
      const piePercentage = document.getElementById('piePercentage');
      if (piePercentage) {
        piePercentage.textContent = `${Math.round(percentage)}%`;
      }
    }
  }
}

// Update suggestions based on data
function updateSuggestions(blinks, maxBlinks) {
  const suggestionsContainer = document.getElementById('suggestions_blank');
  if (!suggestionsContainer) return;
  
  const percentage = (blinks / maxBlinks) * 100;
  let suggestion = '';
  let icon = '💡';
  
  if (percentage < 20) {
    suggestion = 'Great start! Keep up the healthy blinking habits.';
    icon = '👍';
  } else if (percentage < 50) {
    suggestion = 'You\'re doing well! Consider taking a short break to rest your eyes.';
    icon = '👁️';
  } else if (percentage < 80) {
    suggestion = 'Time for a break! Look away from the screen for 20 seconds.';
    icon = '⏰';
  } else {
    suggestion = 'High screen time detected! Take a longer break and stretch.';
    icon = '🚨';
  }
  
  suggestionsContainer.innerHTML = `
    <div class="suggestion-icon">${icon}</div>
    <p>${suggestion}</p>
  `;
}

// Start periodic data updates
function startDataUpdates() {
  // Initial update
  updateCount();
  
  // Update every 500ms
  setInterval(updateCount, 500);
  
  // Update history every 10 seconds
  setInterval(updateHistory, 10000);
}

// Update history data
async function updateHistory() {
  try {
    const response = await fetch('./storage.json');
    const data = await response.json();
    
    if (data?.blinkhistory && charts.length >= 3) {
      const analyticsChart = charts[2];
      if (analyticsChart) {
        analyticsChart.data.datasets[0].data = data.blinkhistory;
        analyticsChart.update('none');
      }
    }
  } catch (error) {
    console.error('Failed to update history:', error);
  }
}

// Initialize smooth scrolling for navigation
function initSmoothScrolling() {
  const navLinks = document.querySelectorAll('.header_nav_link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        const headerHeight = 80; // Fixed header height
        const targetPosition = targetElement.offsetTop - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Update active navigation
        navLinks.forEach(l => l.removeAttribute('aria-current'));
        link.setAttribute('aria-current', 'page');
      }
    });
  });
}

// Initialize scroll effects
function initScrollEffects() {
  const header = document.querySelector('header');
  
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    // Add scrolled class to header
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Update active navigation based on scroll position
    updateActiveNavigation(scrollY);
  });
}

// Update active navigation based on scroll position
function updateActiveNavigation(scrollY) {
  const sections = ['dashboard', 'analytics', 'about', 'contact'];
  const navLinks = document.querySelectorAll('.header_nav_link');
  const headerHeight = 80;
  
  let activeSection = 'dashboard';
  
  sections.forEach(sectionId => {
    const section = document.getElementById(sectionId);
    if (section) {
      const sectionTop = section.offsetTop - headerHeight - 100;
      const sectionBottom = sectionTop + section.offsetHeight;
      
      if (scrollY >= sectionTop && scrollY < sectionBottom) {
        activeSection = sectionId;
      }
    }
  });
  
  // Update navigation
  navLinks.forEach(link => {
    const href = link.getAttribute('href').substring(1);
    if (href === activeSection) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

// Initialize intersection observer for animations
function initIntersectionObserver() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observe elements for animation
  const animateElements = document.querySelectorAll('.feature-card, .team-member, .info-box');
  animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// Initialize loading states
function initLoadingStates() {
  // Add loading class to elements that might need it
  const boxes = document.querySelectorAll('.box');
  boxes.forEach(box => {
    box.addEventListener('mouseenter', () => {
      box.classList.add('loading');
    });
    
    box.addEventListener('mouseleave', () => {
      box.classList.remove('loading');
    });
  });
}

// Show loading overlay
function showLoading() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) {
    overlay.classList.add('active');
  }
}

// Hide loading overlay
function hideLoading() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) {
    setTimeout(() => {
      overlay.classList.remove('active');
    }, 500);
  }
}

// Show error message
function showError(title, message) {
  console.error(`${title}: ${message}`);
  showNotification(`${title}: ${message}`, 'error');
}

// Show notification
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6'};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 300px;
    word-wrap: break-word;
  `;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Add keyboard navigation support
function initKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    // Escape key to close any open modals or overlays
    if (e.key === 'Escape') {
      const overlay = document.getElementById('loading-overlay');
      if (overlay && overlay.classList.contains('active')) {
        hideLoading();
      }
    }
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  init();
  initKeyboardNavigation();
});

// Export functions for potential use in other modules
export {
  init,
  updateCount,
  showNotification,
  showError
};
