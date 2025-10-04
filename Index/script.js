// Main JavaScript functionality for G&C Electric website

// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile navigation functionality
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  requestAnimationFrame(() => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  });
});

// Mobile dropdown toggle for Services
const navDropdown = document.querySelector('.nav-dropdown');
const dropdownMenu = document.querySelector('.dropdown-menu');
if (navDropdown && dropdownMenu) {
  const navLinkSpan = navDropdown.querySelector('.nav-link');
  if (navLinkSpan) {
    navLinkSpan.addEventListener('click', (e) => {
      if (window.innerWidth < 769 && navLinks.classList.contains('active')) {
        e.stopPropagation();
        dropdownMenu.style.display = dropdownMenu.style.display === 'flex' ? 'none' : 'flex';
      }
    });
  }
}

// Close mobile menu when clicking on links
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    if (navLinks.classList.contains('active')) {
      requestAnimationFrame(() => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.classList.remove('no-scroll');
        // Reset dropdown
        if (dropdownMenu) dropdownMenu.style.display = 'none';
      });
    }
  });
});

// Smooth scroll for contact buttons
document.querySelectorAll('a[href="#contact"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('contact').scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });
});

// Floating giggle button functionality
document.querySelectorAll('.giggle-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const contactSection = document.getElementById('contact') || 
                          document.querySelector('a[href="index.html#contact"]');
    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Intersection Observer for animations
const ioFade = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      ioFade.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '50px' });

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach(el => ioFade.observe(el));

// Scroll-based opacity for background images
function updateBackgroundImageOpacity() {
  const bgImages = document.querySelectorAll('.background-fade-image');
  bgImages.forEach(img => {
    const rect = img.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const imgCenter = rect.top + (rect.height / 2);
    const viewportCenter = viewportHeight / 2;

    // Calculate distance from image center to viewport center
    const distanceFromCenter = Math.abs(imgCenter - viewportCenter);
    const maxDistance = viewportHeight;

    // Calculate opacity: max (.08) when centered, 0 when far away
    let opacity = Math.max(0, 1 - (distanceFromCenter / maxDistance)) * 0.08;

    img.style.opacity = opacity;
  });
}

// Throttle scroll events for performance
let scrollTimeout;
window.addEventListener('scroll', () => {
  if (!scrollTimeout) {
    scrollTimeout = setTimeout(() => {
      updateBackgroundImageOpacity();
      scrollTimeout = null;
    }, 10);
  }
}, { passive: true });

// Initial update
updateBackgroundImageOpacity();

// Background loading for cards (if needed)
const ioBg = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('loaded');
      ioBg.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '50px' });

document.querySelectorAll('.card[data-bg]').forEach(c => ioBg.observe(c));

// Performance optimization: Preload critical images
function preloadCriticalImages() {
  const criticalImages = [
    '/images/hero.jpg',
    '/images/commercial.jpg',
    '/images/industrial.jpg',
    '/images/service.jpg'
  ];
  
  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', () => {
  preloadCriticalImages();
});

// Add loading states for better UX
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});

// Smooth scroll polyfill for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
  const smoothScrollPolyfill = () => {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          const targetPosition = target.offsetTop - 80;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  };
  smoothScrollPolyfill();
}