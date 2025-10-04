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

// Smooth scroll for contact buttons (only on same page)
document.querySelectorAll('a[href="#contact"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      e.preventDefault();
      contactSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
    // If no #contact section exists, allow default navigation
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

    // Calculate opacity: max (.25) when centered, 0 when far away
    let opacity = Math.max(0, 1 - (distanceFromCenter / maxDistance)) * 0.25;

    img.style.opacity = opacity;
    console.log('Image opacity:', opacity, 'Distance:', distanceFromCenter, 'Rect:', rect.top);
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

// Testimonial Carousel
function initCarousel(carouselElement) {
  const track = carouselElement.querySelector('.carousel-track');
  const slides = Array.from(carouselElement.querySelectorAll('.testimonial-slide'));
  const prevBtn = carouselElement.querySelector('.carousel-btn.prev');
  const nextBtn = carouselElement.querySelector('.carousel-btn.next');
  const dotsContainer = carouselElement.querySelector('.carousel-dots');

  let currentIndex = 0;

  // Create dots
  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.classList.add('carousel-dot');
    if (index === 0) dot.classList.add('active');
    dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  const dots = Array.from(dotsContainer.querySelectorAll('.carousel-dot'));

  function updateCarousel() {
    // Update slides
    slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === currentIndex);
    });

    // Update dots
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });

    // Move track
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
  }

  function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel();
  }

  // Event listeners
  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);

  // Auto-advance every 8 seconds
  let autoAdvance = setInterval(nextSlide, 8000);

  // Pause auto-advance on hover
  carouselElement.addEventListener('mouseenter', () => {
    clearInterval(autoAdvance);
  });

  carouselElement.addEventListener('mouseleave', () => {
    autoAdvance = setInterval(nextSlide, 8000);
  });

  // Keyboard navigation
  carouselElement.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });
}

// Initialize all carousels on page
document.querySelectorAll('.testimonial-carousel').forEach(initCarousel);

// Homepage 3-card random testimonial rotation
const testimonialPool = [
  // Commercial Electric
  {content: "G&C Electric rewired our entire office building in just two weeks. Professional, clean, and zero downtime. Highly recommend!", avatar: "MB", name: "Michael Bennett", title: "Property Manager"},
  {content: "After a power surge damaged our equipment, G&C came out same-day and had us back up and running in hours. True professionals.", avatar: "LC", name: "Linda Chen", title: "Restaurant Owner"},
  {content: "Their preventive maintenance program has saved us thousands. No more surprise electrical failures during business hours.", avatar: "SR", name: "Sarah Reynolds", title: "Facilities Director"},
  {content: "We needed a complete electrical upgrade for our new retail space. G&C delivered on time and under budget. Exceptional work.", avatar: "TW", name: "Tom Williams", title: "Retail Owner"},
  {content: "Professional, knowledgeable, and always responsive. G&C has been our go-to electrician for 5+ years.", avatar: "JP", name: "Jennifer Park", title: "Office Manager"},
  {content: "The team installed our EV charging stations flawlessly. They even helped us maximize utility rebates. Great service!", avatar: "DH", name: "David Harris", title: "Business Owner"},
  {content: "From permit to final inspection, G&C handled everything. Our new office electrical system is top-notch.", avatar: "KM", name: "Karen Martinez", title: "Building Contractor"},
  {content: "Emergency call on a Sunday morning. They answered, came out, and fixed our issue within 2 hours. Lifesavers!", avatar: "RA", name: "Robert Anderson", title: "Hotel Manager"},
  {content: "Clean, efficient, and incredibly professional. G&C upgraded our entire panel system without disrupting our business.", avatar: "NG", name: "Nancy Green", title: "Store Manager"},
  {content: "Best electrical contractor we've worked with. Fair pricing, quality work, and excellent communication throughout.", avatar: "CJ", name: "Chris Johnson", title: "Property Developer"},
  {content: "They completely rewired our warehouse. Project finished ahead of schedule and the team was fantastic to work with.", avatar: "BT", name: "Brian Taylor", title: "Warehouse Manager"},
  {content: "G&C Electric saved us during a critical power outage. Fast response, expert diagnosis, and quick resolution.", avatar: "AL", name: "Amy Lopez", title: "Medical Office Manager"},
  {content: "Professional installation of our security system wiring. Everything works perfectly and looks great too.", avatar: "MR", name: "Mark Robinson", title: "Security Consultant"},
  {content: "Their team handled our complex three-phase installation with expertise. No issues, no delays, perfect execution.", avatar: "SK", name: "Susan King", title: "Manufacturing Supervisor"},
  {content: "We trust G&C with all our electrical needs. They're reliable, knowledgeable, and always deliver quality work.", avatar: "PB", name: "Paul Brooks", title: "Gym Owner"},
  {content: "Upgraded our entire electrical infrastructure for our growing business. G&C made it seamless and stress-free.", avatar: "EW", name: "Emily White", title: "Tech Startup CEO"},
  {content: "From initial quote to final walkthrough, G&C was professional and transparent. Will definitely use them again.", avatar: "JM", name: "James Moore", title: "Church Administrator"},
  {content: "They installed dedicated circuits for our commercial kitchen equipment. Perfect job, passed inspection first time.", avatar: "VD", name: "Victor Davis", title: "Chef & Owner"},
  {content: "G&C helped us design and install electrical for our new location. Their expertise saved us time and money.", avatar: "HN", name: "Helen Nelson", title: "Franchise Owner"},
  {content: "Fantastic service! They upgraded our outdated panel and fixed several code violations. Very thorough and professional.", avatar: "GC", name: "George Carter", title: "Building Owner"},
  // Commercial Lighting
  {content: "The LED retrofit G&C installed cut our energy bills by 60%. The lighting quality is incredible and the ROI was under 2 years!", avatar: "TM", name: "Tom Martinez", title: "Warehouse Owner"},
  {content: "Our retail space looks amazing with the new lighting design. Sales are up 15% since the upgrade. Best investment we've made!", avatar: "JK", name: "Jessica Kim", title: "Boutique Owner"},
  {content: "G&C designed a lighting system that perfectly showcases our products. Professional work from start to finish.", avatar: "RB", name: "Rachel Barnes", title: "Gallery Director"},
  {content: "They upgraded all 200+ fixtures in our office building. Zero downtime, zero complaints. Highly professional team.", avatar: "MS", name: "Mark Stevens", title: "Facilities Manager"},
  {content: "The parking lot lighting they installed is bright, efficient, and our customers feel much safer. Great job!", avatar: "LW", name: "Lisa Wong", title: "Shopping Center Manager"},
  {content: "Our new LED system pays for itself with the utility rebates alone. G&C handled all the paperwork. So easy!", avatar: "DP", name: "Daniel Peters", title: "Restaurant Owner"},
  {content: "The lighting controls they installed are brilliant. Lights adjust automatically and we're saving a fortune on electricity.", avatar: "AH", name: "Amanda Hill", title: "Office Manager"},
  {content: "G&C transformed our showroom lighting. Products look vibrant and our closing rate has improved noticeably.", avatar: "KC", name: "Kevin Cruz", title: "Auto Dealership GM"},
  {content: "Emergency lighting upgrade passed inspection with flying colors. G&C knows the codes inside and out.", avatar: "SG", name: "Sandra Garcia", title: "Building Inspector"},
  {content: "Our gym looks modern and inviting with the new lighting. Members love it and it's saving us money every month.", avatar: "BL", name: "Brian Lopez", title: "Fitness Center Owner"},
  {content: "The outdoor lighting G&C installed is stunning. Our building facade has never looked better. Fantastic work!", avatar: "NH", name: "Nancy Hughes", title: "Hotel Manager"},
  {content: "They retrofitted our entire production floor with high-bay LEDs. Visibility is better and energy costs are down 70%.", avatar: "PM", name: "Patrick Miller", title: "Plant Manager"},
  {content: "G&C designed task lighting for our workspace that eliminated glare and eye strain. Employees are much happier!", avatar: "EB", name: "Ellen Baker", title: "HR Director"},
  {content: "The motion sensors they installed save energy without compromising security. Smart solution that just works.", avatar: "GR", name: "Greg Ross", title: "Security Director"},
  {content: "Our church sanctuary looks beautiful with the new lighting design. It creates the perfect atmosphere for worship.", avatar: "MW", name: "Mary Wilson", title: "Church Administrator"},
  {content: "LED lighting upgrade was completed during our off-season. Perfect timing, perfect execution. Very impressed!", avatar: "JT", name: "John Thompson", title: "Country Club Manager"},
  {content: "The color temperature and brightness are perfect for our medical office. Patients and staff both appreciate it.", avatar: "CT", name: "Dr. Carol Turner", title: "Physician"},
  {content: "G&C retrofitted our entire campus with LEDs. The project was massive but they delivered on time and on budget.", avatar: "VN", name: "Victor Nguyen", title: "Facilities Director"},
  {content: "Their lighting design created zones in our open office that actually work. Productivity and morale are both up!", avatar: "FK", name: "Frank Kelly", title: "CEO"},
  {content: "We haven't changed a light bulb in 3 years since the LED upgrade. Maintenance savings alone justify the investment.", avatar: "HS", name: "Helen Scott", title: "Property Manager"},
  // Panel Upgrades
  {content: "Our 200-amp panel upgrade was seamless. G&C coordinated everything with the utility company. We never lost power!", avatar: "JW", name: "James Walker", title: "Business Owner"},
  {content: "They replaced our dangerous old fuse box with a modern breaker panel. Finally have the power we need without tripping breakers.", avatar: "MJ", name: "Maria Johnson", title: "Homeowner"},
  {content: "G&C installed a generator transfer switch that saved us during the last storm. Automatic switchover worked perfectly!", avatar: "RD", name: "Robert Davis", title: "Clinic Director"},
  {content: "Panel upgrade allowed us to add AC units without any issues. Professional work from permit to final inspection.", avatar: "CP", name: "Carol Phillips", title: "Restaurant Manager"},
  {content: "The smart panel they installed lets me monitor energy use from my phone. Great upgrade for our office building.", avatar: "DL", name: "David Lee", title: "Property Manager"},
  {content: "They upgraded our panel to 400 amps for our expansion. Project completed on schedule with zero delays.", avatar: "KT", name: "Karen Taylor", title: "Manufacturing Owner"},
  {content: "Fixed all our code violations during the panel upgrade. Inspection passed first time. G&C really knows their stuff.", avatar: "BH", name: "Bill Harris", title: "Landlord"},
  {content: "Our old panel was a fire hazard. G&C replaced it quickly and safely. Peace of mind is priceless!", avatar: "SW", name: "Susan White", title: "School Administrator"},
  {content: "They installed a sub-panel for our new workshop. Clean installation, properly labeled, and fully code-compliant.", avatar: "TA", name: "Tom Anderson", title: "Contractor"},
  {content: "Panel upgrade eliminated our flickering lights and frequent breaker trips. Should have done this years ago!", avatar: "LB", name: "Linda Brown", title: "Office Manager"},
  {content: "G&C added AFCI and GFCI breakers for safety. Explained everything clearly and the installation was perfect.", avatar: "MG", name: "Mike Green", title: "Building Inspector"},
  {content: "Our three-phase panel installation was complex but G&C handled it expertly. Powers our equipment flawlessly.", avatar: "PR", name: "Patricia Ross", title: "Plant Supervisor"},
  {content: "They replaced our entire distribution system. Major project completed with minimal business disruption. Impressive!", avatar: "JC", name: "John Carter", title: "Warehouse Manager"},
  {content: "Panel upgrade gave us capacity for future growth. Forward-thinking design that will serve us for decades.", avatar: "EH", name: "Emma Hill", title: "Startup CEO"},
  {content: "The surge protection they added to our panel has saved our computers multiple times. Best money we've spent!", avatar: "NK", name: "Nathan King", title: "IT Director"},
  {content: "G&C relocated and upgraded our panel for our remodel. Clean work, properly documented, and inspector loved it.", avatar: "AM", name: "Alice Miller", title: "Architect"},
  {content: "Emergency panel replacement after water damage. G&C responded fast and had us back up within a day. Heroes!", avatar: "GW", name: "Greg Wilson", title: "Store Owner"},
  {content: "Panel upgrade allowed us to add EV chargers and solar. G&C designed everything to work together perfectly.", avatar: "VL", name: "Veronica Lopez", title: "Sustainability Director"},
  {content: "They replaced all our old breakers with modern ones. No more nuisance tripping. System works beautifully now.", avatar: "FS", name: "Frank Scott", title: "Facilities Manager"},
  {content: "Our panel upgrade was part of a building sale requirement. G&C made it easy and the buyers were very impressed.", avatar: "HJ", name: "Helen Jackson", title: "Real Estate Agent"}
];

function getRandomTestimonials(count) {
  const shuffled = [...testimonialPool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function renderTestimonials() {
  const grid = document.getElementById('testimonials-grid');
  if (!grid) return;

  const testimonials = getRandomTestimonials(3);

  grid.innerHTML = testimonials.map(t => `
    <div class="testimonial">
      <div class="testimonial-content">"${t.content}"</div>
      <div class="testimonial-author">
        <div class="author-avatar">${t.avatar}</div>
        <div class="author-info">
          <h4>${t.name}</h4>
          <p>${t.title}</p>
        </div>
      </div>
    </div>
  `).join('');
}

// Initialize testimonials
renderTestimonials();

// Rotate testimonials every 10 seconds
setInterval(renderTestimonials, 10000);

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

// Hide navbar when contact section is visible
const contactSection = document.getElementById('contact');
const navbar = document.querySelector('.navbar');

if (contactSection && navbar) {
  const contactObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navbar.style.transform = 'translateY(-100%)';
      } else {
        navbar.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  contactObserver.observe(contactSection);
}

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