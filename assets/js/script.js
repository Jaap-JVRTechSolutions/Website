let translations = {};

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
        loadSkills(t);
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
    const lang = localStorage.getItem('lang') || 'nl';
    const fileName = lang === 'en' ? 'terms-en.html' : 'terms-nl.html';
    return isNestedPage() ? fileName : `assets/pages/${fileName}`;
}

function loadSkills(translations) {
    const container = document.getElementById('skillsContainer');
    if (!container) return;
    
    // Load structure from skills-structure.json
    fetch(isNestedPage() ? '../data/skills-structure.json' : 'assets/data/skills-structure.json')
        .then(r => r.json())
        .then(structure => {
            container.innerHTML = '';
            structure.skills.forEach(skillGroup => {
                const group = document.createElement('div');
                group.className = 'skill-group reveal';
                const categoryLabel = translations[skillGroup.categoryKey] || skillGroup.categoryKey;
                const items = skillGroup.items.map(itemKey => {
                    const label = translations[itemKey] || itemKey;
                    return `<li>${label}</li>`;
                }).join('');
                group.innerHTML = `
                    <h3>${categoryLabel}</h3>
                    <ul class="skill-list">${items}</ul>
                `;
                container.appendChild(group);
            });
            container.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
        })
        .catch(error => console.error('Failed to load skills:', error));
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
    const navLinks = navUl ? navUl.querySelectorAll('a') : [];

    if (!nav || !navUl) return;

    function closeNavMenu() {
        if (!hamburger) return;
        hamburger.classList.remove('active');
        navUl.classList.remove('active');
    }

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

        navLinks.forEach((link) => {
            link.addEventListener('click', () => {
                closeNavMenu();
            });
        });

        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target)) {
                closeNavMenu();
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
    const [enTrans, nlTrans] = await Promise.all([
        fetch(`${dataPath}translations.en.json`).then(r => r.json()),
        fetch(`${dataPath}translations.nl.json`).then(r => r.json()),
    ]);
    translations = { en: enTrans, nl: nlTrans };

    await loadHeader();
    await loadFooter();
    const lang = localStorage.getItem('lang') || 'nl';
    loadSkills(translations[lang]);
    setLanguage(lang);
    setupReveal();
});