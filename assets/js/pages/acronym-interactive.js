// Interactive acronym buttons with smooth animations

function buildInteractiveLineFragment(element, text) {
    const cleanText = text.trim();
    if (!cleanText) return { fragment: document.createDocumentFragment(), contents: [], text: '' };

    const computedStyle = window.getComputedStyle(element);
    const width = element.offsetWidth || element.parentElement.offsetWidth;
    const measureContainer = document.createElement('div');
    const words = cleanText.split(/\s+/);

    measureContainer.style.cssText = `
        position: absolute;
        visibility: hidden;
        width: ${width}px;
        font: ${computedStyle.font};
        letter-spacing: ${computedStyle.letterSpacing};
        text-transform: ${computedStyle.textTransform};
        line-height: ${computedStyle.lineHeight};
        padding: ${computedStyle.padding};
        pointer-events: none;
        white-space: normal;
        word-break: normal;
    `;

    words.forEach((word, index) => {
        const span = document.createElement('span');
        span.textContent = word;
        measureContainer.appendChild(span);

        if (index < words.length - 1) {
            measureContainer.appendChild(document.createTextNode(' '));
        }
    });

    document.body.appendChild(measureContainer);

    const lines = [];
    let currentLine = [];
    let lastTop = -1;

    measureContainer.querySelectorAll('span').forEach(span => {
        const top = span.offsetTop;

        if (lastTop !== -1 && Math.abs(top - lastTop) > 5) {
            lines.push(currentLine);
            currentLine = [];
        }

        currentLine.push(span.textContent);
        lastTop = top;
    });

    lines.push(currentLine);
    document.body.removeChild(measureContainer);

    const fragment = document.createDocumentFragment();
    const contents = [];

    lines.forEach(lineWords => {
        const mask = document.createElement('span');
        const content = document.createElement('span');

        mask.className = 'interactive-line-mask';
        content.className = 'interactive-line-content';
        content.textContent = lineWords.join(' ');

        mask.appendChild(content);
        fragment.appendChild(mask);
        contents.push(content);
    });

    return { fragment, contents, text: cleanText };
}

function splitInteractiveTextIntoLines(element, text) {
    const lineData = buildInteractiveLineFragment(element, text);

    element.innerHTML = '';
    element.dataset.currentText = lineData.text;
    element.appendChild(lineData.fragment);

    return lineData.contents;
}

function getInteractiveLines(element) {
    let lines = Array.from(element.querySelectorAll('.interactive-line-content, .line-content, .word-content'));

    if (!lines.length) {
        lines = splitInteractiveTextIntoLines(element, element.dataset.currentText || element.textContent);
    }

    return lines;
}

function animateLineTextSwap(element, nextText) {
    const currentLines = getInteractiveLines(element);
    const nextLineData = buildInteractiveLineFragment(element, nextText);
    const tl = gsap.timeline();

    tl.to([...currentLines].reverse(), {
        opacity: 0,
        y: 22,
        duration: 0.32,
        stagger: 0.045,
        ease: 'power2.inOut'
    })
    .add(() => {
        element.innerHTML = '';
        element.dataset.currentText = nextLineData.text;
        element.appendChild(nextLineData.fragment);
        gsap.set(nextLineData.contents, { opacity: 0, y: 24 });
    })
    .to(nextLineData.contents, {
        opacity: 1,
        y: 0,
        duration: 0.48,
        stagger: 0.055,
        ease: 'power3.out'
    });

    return tl;
}

function initAcronymButtons() {
    const buttons = document.querySelectorAll('.acronym-button');
    const acronymText = document.querySelector('.acronym-text');
    const acronymImage = document.querySelector('.acronym-image');
    const acronymCaption = document.querySelector('.acronym-content .image-caption');
    const leftColumn = document.querySelector('.acronym-content .left-column');
    const rightColumn = document.querySelector('.acronym-content .right-column');

    if (!buttons.length || !acronymText || !acronymImage || !acronymCaption || !window.gsap) return;
    if (acronymText.dataset.astralAcronymInit === 'true') return;
    acronymText.dataset.astralAcronymInit = 'true';

    const activeButton = document.querySelector('.acronym-button.active') || buttons[0];
    activeButton.classList.add('active');
    splitInteractiveTextIntoLines(acronymCaption, activeButton.dataset.caption || acronymCaption.textContent);

    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();

            // Get data from clicked button
            const text = button.dataset.text;
            const image = button.dataset.image;
            const caption = button.dataset.caption || acronymCaption.dataset.currentText || acronymCaption.textContent;

            // Remove active class from all buttons
            buttons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            button.classList.add('active');

            // Animate out
            const tl = gsap.timeline();

            tl.add(animateLineTextSwap(acronymText, text), 0)
            .add(animateLineTextSwap(acronymCaption, caption), 0.04)
            .to(acronymImage, {
                opacity: 0,
                y: 16,
                duration: 0.35,
                ease: 'power2.inOut'
            }, 0.05)
            .add(() => {
                acronymImage.src = image;
            })
            .to(acronymImage, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: 'power2.out'
            }, '-=0.35');
        });
    });
}

function initStudentReviews() {
    const students = document.querySelectorAll('.student-reviews .student');
    const reviewText = document.querySelector('.student-reviews div.review > p.review');
    const reviewImage = document.querySelector('.student-reviews img.review');

    if (!students.length || !reviewText || !reviewImage || !window.gsap) return;
    if (reviewText.dataset.astralReviewInit === 'true') return;
    reviewText.dataset.astralReviewInit = 'true';

    const setReviewContent = (student) => {
        splitInteractiveTextIntoLines(reviewText, student.dataset.text);
        reviewImage.src = student.dataset.image;
        reviewImage.alt = `${student.querySelector('.name').textContent} review`;
    };

    const activeStudent = document.querySelector('.student-reviews .student.active') || students[0];
    activeStudent.classList.add('active');
    setReviewContent(activeStudent);

    const selectStudent = (student) => {
        if (student.classList.contains('active')) return;

        students.forEach(item => item.classList.remove('active'));
        student.classList.add('active');

        const tl = gsap.timeline();

        tl.add(animateLineTextSwap(reviewText, student.dataset.text), 0)
        .to(reviewImage, {
            opacity: 0,
            y: 18,
            duration: 0.35,
            ease: 'power2.inOut'
        }, 0)
        .add(() => {
            gsap.set(reviewImage, { opacity: 0 });
            reviewImage.src = student.dataset.image;
            reviewImage.alt = `${student.querySelector('.name').textContent} review`;
        })
        .to(reviewImage, {
            opacity: 1,
            y: 0,
            duration: 0.52,
            ease: 'power2.out'
        });
    };

    students.forEach(student => {
        student.addEventListener('click', () => selectStudent(student));
        student.addEventListener('keydown', (e) => {
            if (e.key !== 'Enter' && e.key !== ' ') return;

            e.preventDefault();
            selectStudent(student);
        });
    });
}

function initInteractiveSections() {
    initAcronymButtons();
    initStudentReviews();
}

window.AstralAcronymInteractive = {
    init: initInteractiveSections
};

// Initialize on load or when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInteractiveSections, { once: true });
} else {
    initInteractiveSections();
}
