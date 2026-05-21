(function () {
    let projectsSlideNumber = 0;
    const numSlides = 2;
    const titles = [
        'Discovering Nanohertz Frequency Gravitational Waves Using Pulsar Timing Arrays',
        'Exacting Solar Magnitude Measurements using Solar Twin Data from Gaia Data Release 3'
    ];
    const projectLinks = ['projects/meerkat-pta.html', 'projects/solar-twin.html'];

    function displaySlides() {
        const slideshow = document.querySelector('.projects-slideshow');
        if (!slideshow) return;

        if (projectsSlideNumber < 0) {
            projectsSlideNumber = (projectsSlideNumber * -1) % numSlides;
            if (projectsSlideNumber !== 0) projectsSlideNumber = numSlides - projectsSlideNumber;
        } else {
            projectsSlideNumber %= numSlides;
        }

        slideshow.querySelectorAll('.projects-container .project').forEach((slide, counter) => {
            if (counter !== projectsSlideNumber) return;

            slide.classList.add('active');

            const h1 = slideshow.querySelector('.text-container h1');
            const link = slideshow.querySelector('.text .underline-button');
            if (h1) {
                h1.innerHTML = titles[counter];
                h1.style.transform = 'translateY(0)';
            }
            if (link) link.href = projectLinks[counter];
        });
    }

    function hideText() {
        const slideshow = document.querySelector('.projects-slideshow');
        if (!slideshow) return;

        const h1 = slideshow.querySelector('.text-container h1');
        const active = slideshow.querySelector('.projects-container .active');
        if (h1) h1.style.transform = 'translateY(100%)';
        if (active) active.classList.remove('active');
    }

    window.goToUrl = function (url) {
        window.location.href = url;
    };

    window.nextSlide = function () {
        projectsSlideNumber += 1;
        hideText();
        setTimeout(displaySlides, 500);
    };

    window.previousSlide = function () {
        projectsSlideNumber -= 1;
        hideText();
        setTimeout(displaySlides, 500);
    };

    function initProjectsSlideshow() {
        projectsSlideNumber = 0;
        displaySlides();
    }

    window.AstralProjectsSlideshow = {
        init: initProjectsSlideshow
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProjectsSlideshow, { once: true });
    } else {
        initProjectsSlideshow();
    }
})();
