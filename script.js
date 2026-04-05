// Embedded site data
const siteData = {
    "services": [
        {
            "id": 1,
            "title": "Enterprise Backend Development",
            "description": "Design and build scalable, maintainable backend systems using .NET. Following SOLID principles and clean architecture patterns for long-term success."
        },
        {
            "id": 2,
            "title": "Cloud Architecture & Azure",
            "description": "Design and implement cloud-native solutions on Microsoft Azure. Including app services, functions, databases, and integration patterns."
        },
        {
            "id": 3,
            "title": "API Development & Integration",
            "description": "Build robust RESTful and modern APIs. Design secure, scalable connectors that integrate your systems seamlessly with external services."
        },
        {
            "id": 4,
            "title": "CI/CD & DevOps Automation",
            "description": "Establish automated deployment pipelines and infrastructure as code. Reduce manual work and improve deployment reliability and frequency."
        },
        {
            "id": 5,
            "title": "System Architecture & Design",
            "description": "Strategic architecture decisions for scalability, resilience, and maintainability. Building systems that grow with your business."
        },
        {
            "id": 6,
            "title": "Performance & Security Optimization",
            "description": "Identify and eliminate bottlenecks. Implement security hardening, threat modeling, and compliance controls across your applications."
        }
    ],
    "skills": [
        {
            "id": 1,
            "category": "Languages & Frameworks",
            "items": [
                "C# & .NET (8+ years)",
                ".NET Core / .NET 5+",
                "ASP.NET Core",
                "Entity Framework",
                "SQL Server"
            ]
        },
        {
            "id": 2,
            "category": "Cloud & DevOps",
            "items": [
                "Microsoft Azure",
                "Azure App Service",
                "Azure Functions",
                "Azure SQL Database",
                "CI/CD Pipelines"
            ]
        },
        {
            "id": 3,
            "category": "Architecture & Practices",
            "items": [
                "Microservices",
                "API Design",
                "Security & Compliance",
                "System Design",
                "Scalability Patterns"
            ]
        }
    ]
};

// Populate services
function loadServices(data) {
    const grid = document.getElementById('servicesGrid');
    if (!grid) return;
    data.services.forEach((service, i) => {
        const card = document.createElement('div');
        card.className = 'service-card reveal';
        card.innerHTML = `
            <div class="service-number">0${i + 1}</div>
            <h3>${service.title}</h3>
            <p>${service.description}</p>
        `;
        grid.appendChild(card);
    });
}

// Populate skills
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

// Scroll reveal
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

// Nav scroll shadow
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
    }
}

// Load header
function loadHeader() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        const isMainPage = window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname === '';
        const headerHTML = isMainPage ? `<!-- Navigation -->
<nav id="navbar">
    <div class="container">
        <div class="logo">
            <span class="nav-brand">JVR Tech Solutions</span>
        </div>
        <ul>
            <li><a href="#about">About</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#skills">Skills</a></li>
            <li><a href="#experience">Experience</a></li>
            <li><a href="#contact" class="nav-cta">Contact</a></li>
        </ul>
        <button class="hamburger" aria-label="Toggle menu">
            <span></span>
            <span></span>
            <span></span>
        </button>
    </div>
</nav>` : `<!-- Navigation -->
<nav id="navbar">
    <div class="container">
        <div class="logo">
            <span class="nav-brand">JVR Tech Solutions</span>
        </div>
        <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="index.html#contact">Contact</a></li>
        </ul>
        <button class="hamburger" aria-label="Toggle menu">
            <span></span>
            <span></span>
            <span></span>
        </button>
    </div>
</nav>`;
        headerPlaceholder.innerHTML = headerHTML;
        setupNav(); // Call setupNav after header is loaded
    }
}

// Load footer
function loadFooter() {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        const footerHTML = `<footer>
    <p>© 2026 JVR Tech Solutions | KVK: 42016921 | BTW: [Your BTW Number]</p>
    <p><a href="terms.html">Terms of Service</a> | <a href="cookies.html">Cookie Policy</a></p>
    <p>Designed and built by Jaap van Rooijen</p>
</footer>`;
        footerPlaceholder.innerHTML = footerHTML;
    }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
    loadServices(siteData);
    loadSkills(siteData);
    loadFooter();
    // Wait a tick for dynamic elements to be in the DOM
    setTimeout(() => {
        setupReveal();
    }, 50);
});
