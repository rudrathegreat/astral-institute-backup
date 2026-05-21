let menuTimeline;
let lastNavbarUpdate = 0;
const NAVBAR_THROTTLE = 100;

function styleNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    if (navbar.classList.contains('activated')) {
        navbar.style.background = 'white';
        navbar.style.backdropFilter = 'none';
    } else {
        if (window.scrollY > 20) {
            navbar.style.background = 'rgba(255,255,255,0.4)';
            navbar.style.backdropFilter = 'blur(40px)';
        } else {
            if (navbar.classList.contains('bg-nav')) {
                navbar.style.background = 'rgba(255,255,255,0.4)';
                navbar.style.backdropFilter = 'blur(40px)';
            } else {
                navbar.style.background = 'none';
                navbar.style.backdropFilter = 'none';
            }
        }
    }
}

window.addEventListener('scroll', function() {
    const now = Date.now();
    if (now - lastNavbarUpdate < NAVBAR_THROTTLE) return;
    lastNavbarUpdate = now;
    styleNavbar();
}, { passive: true });

function initNavbarAnimations() {
    const categories = document.querySelectorAll('.categories .reveal-text, .categories .reveal-text-single');
    const socials = document.querySelectorAll('.social-media-section .reveal-image');
    
    if (!categories.length && !socials.length) return;

    const categoryUnits = [];
    categories.forEach(cat => {
        categoryUnits.push(...cat.querySelectorAll('.line-content, .word-content'));
    });

    menuTimeline = gsap.timeline({ paused: true });

    gsap.set(categoryUnits, { y: '130%', opacity: 0 });
    gsap.set(socials, { y: 10, opacity: 0 });

    menuTimeline
        .to(categoryUnits, {
            y: '0%',
            opacity: 1,
            duration: 0.8,
            stagger: 0.05,
            ease: "power3.out"
        }, 0.35)
        .to(socials, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: "power2.out"
        }, 0.6);
}

window.addEventListener('load', () => {
    setTimeout(initNavbarAnimations, 200);
});

function toggleMenu() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    navbar.classList.toggle('activated');
    styleNavbar();

    if (navbar.classList.contains('activated')) {
        if (menuTimeline) {
            menuTimeline.timeScale(1).restart();
        }
    } else {
        if (menuTimeline) {
            menuTimeline.timeScale(2).reverse();
        }
        
        const subOptions = document.querySelectorAll('.nav-options');
        const subUnits = document.querySelectorAll('.nav-options .line-content, .nav-options .word-content');
        
        subOptions.forEach(opt => opt.classList.remove('options-activated'));
        gsap.set(subUnits, { y: '130%', opacity: 0 });
        changeImage('');
    }
}

function goTo(section_name) {
    if (typeof lenis !== 'undefined') {
        lenis.scrollTo(section_name);
    }
    setTimeout(() => {
        toggleMenu();
    }, 300);
}

function toggleOptions(optionsClass) {
    const optionsDiv = document.querySelector(`.${optionsClass}`);
    const allOptions = document.querySelectorAll('.nav-options');
    
    if (optionsDiv && optionsDiv.classList.contains('options-activated')) {
        const units = optionsDiv.querySelectorAll('.line-content, .word-content');
        gsap.to(units, {
            y: '130%',
            opacity: 0,
            duration: 0.4,
            ease: "power3.in",
            onComplete: () => {
                optionsDiv.classList.remove('options-activated');
            }
        });
        changeImage('');
        return;
    }

    allOptions.forEach(opt => {
        if (opt.classList.contains('options-activated')) {
            const units = opt.querySelectorAll('.line-content, .word-content');
            gsap.set(units, { y: '130%', opacity: 0 });
            opt.classList.remove('options-activated');
        }
    });
    
    changeImage('');
    
    if (optionsDiv) {
        optionsDiv.classList.add('options-activated');
        const units = optionsDiv.querySelectorAll('.line-content, .word-content');
        gsap.set(units, { y: '130%', opacity: 0 });
        
        gsap.to(units, {
            y: '0%',
            opacity: 1,
            duration: 0.6,
            stagger: 0.04,
            ease: "power3.out"
        });
    }
}

function changeImage(imageUrl) {
    const imageDisplay = document.querySelector('.options-image');
    if (!imageDisplay) return;

    imageDisplay.classList.remove('active');

    setTimeout(() => {
        if (imageUrl) {
            const tempImg = new Image();
            tempImg.onload = function() {
                imageDisplay.src = imageUrl;
                imageDisplay.classList.add('active');
            };
            tempImg.src = imageUrl;
        } else {
            imageDisplay.src = '';
        }
    }, 200);
}

// Global listener for nav-options hover (since navbar is injected via layout.js)
document.addEventListener('mouseenter', (e) => {
    if (e.target.matches('.nav-options a')) {
        const imageUrl = e.target.getAttribute('data-image');
        changeImage(imageUrl);
        e.target.classList.add('hovered');
    }
}, true);

document.addEventListener('mouseleave', (e) => {
    if (e.target.matches('.nav-options a')) {
        e.target.classList.remove('hovered');
    }
}, true);


