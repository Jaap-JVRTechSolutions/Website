const siteData = {
    "skills": [
        {
            "id": 1,
            "category": "Core Engineering Stack",
            "items": [
                "C# & .NET (8+ years)",
                "ASP.NET Core",
                "Entity Framework Core",
                "SQL Server"
            ]
        },
        {
            "id": 2,
            "category": "Azure Cloud Delivery",
            "items": [
                "Azure App Service",
                "Azure Functions",
                "Azure SQL Database",
                "Azure DevOps",
                "IaC: Bicep & ARM Templates"
            ]
        },
        {
            "id": 3,
            "category": "Architecture & Practices",
            "items": [
                "Microservices",
                "RESTful API Design",
                "CI/CD Pipelines",
                "Clean Code",
                "System Design & Scalability"
            ]
        }
    ]
};

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
    return isNestedPage() ? 'terms-nl.html' : 'assets/pages/terms-nl.html';
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
                // Stagger children in a grid
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
            setupNav(); // Call setupNav after header is loaded
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
    await loadHeader();
    await loadFooter();
    loadSkills(siteData);
    setupReveal();
});
