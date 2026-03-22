let currentLang = 'pt';
let currentIndex = 0;
let currentLightboxIndex = 0;
const galleryItems = document.querySelectorAll('.gallery-item');
const galleryImages = Array.from(galleryItems).map(item => ({
    src: item.querySelector('img').src,
    alt: item.querySelector('img').alt
}));

// Language System
function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('preferredLanguage', lang);

    document.querySelectorAll('[data-pt]').forEach(el => {
        const text = lang === 'pt' ? el.getAttribute('data-pt') : el.getAttribute('data-en');
        if (text) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = text;
            } else {
                el.textContent = text;
            }
        }
    });

    document.querySelectorAll('.lang-option').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });

    const slider = document.querySelector('.lang-slider');
    if (lang === 'en') {
        slider.classList.add('slide-right');
    } else {
        slider.classList.remove('slide-right');
    }

    document.documentElement.setAttribute('lang', lang === 'pt' ? 'pt-BR' : 'en');
}

function initLanguage() {
    const savedLang = localStorage.getItem('preferredLanguage') || 'pt';
    changeLanguage(savedLang);
}

// Gallery Carousel with Loop
function scrollGallery(direction) {
    const track = document.querySelector('.gallery-track');
    const items = document.querySelectorAll('.gallery-item');
    const itemWidth = items[0].offsetWidth + 20;

    if (direction === 'next') {
        currentIndex++;
        if (currentIndex >= items.length) {
            currentIndex = 0; // Loop back to start
        }
    } else {
        currentIndex--;
        if (currentIndex < 0) {
            currentIndex = items.length - 1; // Loop to end
        }
    }

    track.scrollTo({
        left: currentIndex * itemWidth,
        behavior: 'smooth'
    });
}

// Lightbox Functions
function openLightbox(index) {
    currentLightboxIndex = index;
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    lightboxImage.src = galleryImages[index].src;
    lightboxImage.alt = galleryImages[index].alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function navigateLightbox(direction) {
    if (direction === 'next') {
        currentLightboxIndex = (currentLightboxIndex + 1) % galleryImages.length;
    } else {
        currentLightboxIndex = (currentLightboxIndex - 1 + galleryImages.length) % galleryImages.length;
    }
    const lightboxImage = document.getElementById('lightboxImage');
    lightboxImage.src = galleryImages[currentLightboxIndex].src;
    lightboxImage.alt = galleryImages[currentLightboxIndex].alt;
}

// Mobile Menu
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('active');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function () {
    initLanguage();

    // Language buttons
    document.querySelectorAll('.lang-option').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            changeLanguage(lang);
        });
    });

    // Carousel buttons
    document.getElementById('carouselPrev').addEventListener('click', () => scrollGallery('prev'));
    document.getElementById('carouselNext').addEventListener('click', () => scrollGallery('next'));

    // Gallery items click for lightbox
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    // Lightbox controls
    document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
    document.getElementById('lightboxPrev').addEventListener('click', () => navigateLightbox('prev'));
    document.getElementById('lightboxNext').addEventListener('click', () => navigateLightbox('next'));

    // Close lightbox on background click
    document.getElementById('lightbox').addEventListener('click', (e) => {
        if (e.target.id === 'lightbox') {
            closeLightbox();
        }
    });

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', (e) => {
        const lightbox = document.getElementById('lightbox');
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigateLightbox('prev');
            if (e.key === 'ArrowRight') navigateLightbox('next');
        }
    });

    // Mobile menu toggle
    document.getElementById('menuToggle').addEventListener('click', toggleMobileMenu);

    // Close mobile menu on link click
    document.querySelectorAll('.mobile-nav a').forEach(link => {
        link.addEventListener('click', () => {
            document.getElementById('mobileMenu').classList.remove('active');
        });
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const top = target.offsetTop - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });
});