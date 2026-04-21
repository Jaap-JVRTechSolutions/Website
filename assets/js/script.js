let translations = {};
let siteData = {};
let siteDataNl = {};

function getDataPath() {
    return isNestedPage() ? '../data/' : 'assets/data/';
}

function setLanguage(lang) {
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;

    const t = translations[lang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (t && t[key] !== undefined) {
            el.textContent = t[key];
        }
    });

    document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.dataset.i18nHtml;
        if (t && t[key] !== undefined) {
            el.innerHTML = t[key];
        }
    });

    document.querySelectorAll('[data-lang]').forEach(btn => {
        btn.classList.toggle('terms-lang-link-active', btn.dataset.lang === lang);
    });

    const titleEl = document.querySelector('[data-i18n-title]');
    if (titleEl && t && t[titleEl.dataset.i18nTitle] !== undefined) {
        document.title = t[titleEl.dataset.i18nTitle];
    }

    const skillsContainer = document.getElementById('skillsContainer');
    if (skillsContainer) {
        skillsContainer.innerHTML = '';
        loadSkills(lang === 'nl' ? siteDataNl : siteData);
        skillsContainer.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    }
}

function isNestedPage() {
    return window.location.pathname.replace(/\\/g, '/').includes('/assets/pages/');
}

function getIncludePath(fileName) {
    return isNestedPage() ? `../includes/${fileName}` : `assets/includes/${fileName}`;
}

function getHomeSectionHref(anchor) {
    return isNestedPage() ? `../../index.html${anchor}` : anchor;
}

function getTermsHref() {
    return isNestedPage() ? 'terms.html' : 'assets/pages/terms.html';
}

function loadSkills(data) {
    const container = document.getElementById('skillsContainer');
    if (!container) return;
    data.skills.forEach(skillGroup => {
        const group = document.createElement('div');
        group.className = 'skill-group reveal';
        const items = skillGroup.items.map(item => `<li>${item}</li>`).join('');
        group.innerHTML = `
            <h3>${skillGroup.category}</h3>
            <ul class="skill-list">${items}</ul>
        `;
        container.appendChild(group);
    });
}

function setupReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function setupNav() {
    const nav = document.getElementById('navbar');
    const hamburger = document.querySelector('.hamburger');
    const navUl = document.querySelector('nav ul');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navUl.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target)) {
                hamburger.classList.remove('active');
                navUl.classList.remove('active');
            }
        });
    }
}

function updateSharedLinks() {
    if (isNestedPage()) {
        document.querySelectorAll('#navbar a[href^="#"]').forEach((link) => {
            link.setAttribute('href', getHomeSectionHref(link.getAttribute('href')));
        });
    }

    const termsLink = document.querySelector('[data-terms-link]');
    if (termsLink) {
        termsLink.setAttribute('href', getTermsHref());
    }
}

async function loadHeader() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        try {
            const response = await fetch(getIncludePath('header-main.html'));
            const html = await response.text();
            headerPlaceholder.innerHTML = html;
            updateSharedLinks();
            setupNav();
        } catch (error) {
            console.error('Failed to load header:', error);
        }
    }
}

async function loadFooter() {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        try {
            const response = await fetch(getIncludePath('footer.html'));
            const html = await response.text();
            footerPlaceholder.innerHTML = html;
            updateSharedLinks();
        } catch (error) {
            console.error('Failed to load footer:', error);
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const dataPath = getDataPath();
    const [enTrans, nlTrans, skillsEn, skillsNl] = await Promise.all([
        fetch(`${dataPath}translations.en.json`).then(r => r.json()),
        fetch(`${dataPath}translations.nl.json`).then(r => r.json()),
        fetch(`${dataPath}skills.en.json`).then(r => r.json()),
        fetch(`${dataPath}skills.nl.json`).then(r => r.json()),
    ]);
    translations = { en: enTrans, nl: nlTrans };
    siteData = skillsEn;
    siteDataNl = skillsNl;

    await loadHeader();
    await loadFooter();
    const lang = localStorage.getItem('lang') || 'nl';
    loadSkills(lang === 'nl' ? siteDataNl : siteData);
    setLanguage(lang);
    setupReveal();
});