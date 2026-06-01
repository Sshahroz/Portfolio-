document.addEventListener('DOMContentLoaded', function() {

    // ===== PARTICLE CANVAS =====
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];

        function resizeCanvas() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 1.5 + 0.3;
                this.speedX = (Math.random() - 0.5) * 0.35;
                this.speedY = (Math.random() - 0.5) * 0.35;
                this.opacity = Math.random() * 0.4 + 0.06;
                const r = Math.random();
                this.color = r > 0.7 ? '#FF1F8F' : r > 0.45 ? '#22E3FF' : '#ffffff';
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
            }
            draw() {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        const isMobile = window.innerWidth < 768;
        const particleCount = isMobile ? 35 : 75;
        for (let i = 0; i < particleCount; i++) particles.push(new Particle());

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            particles.forEach((p, i) => {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = p.x - particles[j].x;
                    const dy = p.y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        ctx.save();
                        ctx.globalAlpha = (1 - dist / 100) * 0.07;
                        ctx.strokeStyle = '#FF1F8F';
                        ctx.lineWidth = 0.4;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                        ctx.restore();
                    }
                }
            });
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // ===== SCROLL PROGRESS BAR =====
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    document.body.appendChild(progressBar);

    // ===== SCROLL HANDLER =====
    const nav = document.getElementById('main-nav');
    function onScroll() {
        const scrollY = window.scrollY;
        const docH = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docH > 0 ? (scrollY / docH) * 100 : 0;
        progressBar.style.width = pct + '%';

        // Nav scrolled state
        if (nav) nav.classList.toggle('scrolled', scrollY > 40);

        // Active nav link tracking
        const sections = document.querySelectorAll('section[id]');
        let current = '';
        sections.forEach(sec => {
            if (scrollY >= sec.offsetTop - 140) current = sec.getAttribute('id');
        });
        document.querySelectorAll('nav.top ul li a').forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === '#' + current) a.classList.add('active');
        });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ===== HERO PARALLAX =====
    const heroLeft = document.querySelector('.hero-left');
    const heroArt  = document.querySelector('.hero-art');
    window.addEventListener('scroll', function() {
        const y = window.scrollY;
        if (heroLeft) heroLeft.style.transform = `translateY(${y * 0.18}px)`;
        if (heroArt)  heroArt.style.transform  = `translateY(${y * 0.10}px)`;
    }, { passive: true });

    // ===== SCROLL REVEAL =====
    const revealMap = [
        { sel: '.hero-meta',        cls: 'reveal-down', delay: 0 },
        { sel: '.eyebrow',          cls: 'reveal-up',   delay: 0 },
        { sel: '.hero-title',       cls: 'reveal-up',   delay: 100 },
        { sel: '.hero-sub',         cls: 'reveal-up',   delay: 220 },
        { sel: '.hero-cta',         cls: 'reveal-up',   delay: 340 },
        { sel: '.hero-art',         cls: 'reveal-up',   delay: 180 },
        { sel: '.sec-head',         cls: 'reveal-up',   delay: 0 },
        { sel: '.about-portrait',   cls: 'reveal-up',   delay: 0 },
        { sel: '.about-text',       cls: 'reveal-up',   delay: 120 },
        { sel: '.stat',             cls: 'reveal-up',   delay: 0, stagger: 80 },
        { sel: '.cap',              cls: 'reveal-up',   delay: 0, stagger: 60 },
        { sel: '.reel-wrap > div',  cls: 'reveal-up',   delay: 0, stagger: 120 },
        { sel: '.contact-grid > div', cls: 'reveal-up', delay: 0, stagger: 120 },
        { sel: '.contact h2',       cls: 'reveal-up',   delay: 0 },
        { sel: '.contact-lead',     cls: 'reveal-up',   delay: 80 },
        { sel: '.filters',          cls: 'reveal-up',   delay: 0 },
    ];

    revealMap.forEach(({ sel, cls, delay, stagger }) => {
        document.querySelectorAll(sel).forEach((el, i) => {
            el.classList.add('reveal', cls);
            el.style.transitionDelay = ((delay || 0) + (stagger ? i * stagger : 0)) + 'ms';
        });
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.07, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // Observe dynamically added project cards
    const gridObserver = new MutationObserver(mutations => {
        mutations.forEach(m => {
            m.addedNodes.forEach(node => {
                if (node.nodeType === 1 && node.classList.contains('project-card')) {
                    node.classList.add('reveal', 'reveal-up');
                    revealObserver.observe(node);
                    setTimeout(() => {
                        const rect = node.getBoundingClientRect();
                        if (rect.top < window.innerHeight) node.classList.add('revealed');
                    }, 50);
                }
            });
        });
    });
    const grid = document.querySelector('.projects-grid');
    if (grid) gridObserver.observe(grid, { childList: true });

    // ===== MOBILE MENU =====
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navMenu   = document.getElementById('nav-menu');
    mobileBtn?.addEventListener('click', function(e) {
        e.stopPropagation();
        navMenu.classList.toggle('show');
    });
    document.addEventListener('click', function(e) {
        if (navMenu?.classList.contains('show') && !navMenu.contains(e.target) && e.target !== mobileBtn) {
            navMenu.classList.remove('show');
        }
    });

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                navMenu?.classList.remove('show');
            }
        });
    });

    // ===== PROJECT GRID =====
    const modal        = document.getElementById('projectModal');
    const closeBtn     = document.querySelector('.close');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectsGrid  = document.querySelector('.projects-grid');

    let currentLightboxMedia = [];
    let currentLightboxIdx   = 0;

    const lightboxOverlay = document.getElementById('lightboxOverlay');
    const lightboxImg     = document.getElementById('lightboxImg');
    const lightboxClose   = document.querySelector('.lightbox-close');
    const lightboxPrev    = document.querySelector('.lightbox-prev');
    const lightboxNext    = document.querySelector('.lightbox-next');

    function renderProjects(projectsToRender) {
        if (!projectsGrid) return;
        projectsGrid.innerHTML = '';

        projectsToRender.forEach((p, i) => {
            let thumbUrl = p.thumbnail || '';
            if (!thumbUrl && p.media && p.media.length > 0) {
                const m = p.media[0];
                if (m.type === 'image') thumbUrl = m.url;
                else if (m.type === 'video') {
                    const vid = m.url.split('/').pop().split('?')[0];
                    thumbUrl = `https://img.youtube.com/vi/${vid}/maxresdefault.jpg`;
                } else if (m.type === 'sketchfab') thumbUrl = m.thumbnail || '';
            }

            const num    = String(i + 1).padStart(2, '0');
            const catTxt = (p.subtitle || p.category || '').toUpperCase();

            const card = document.createElement('article');
            card.className = 'project-card card h-tall';
            card.setAttribute('data-category', p.category || 'all');
            card.setAttribute('data-project-id', p.id);

            card.innerHTML = `
                <div class="card-thumb">
                    ${thumbUrl
                        ? `<img src="${thumbUrl}" alt="${p.title}" loading="lazy">`
                        : ''
                    }
                </div>
                <div class="meta">
                    <div>
                        <div class="cat">${catTxt}</div>
                        <div class="ttl">${p.title}</div>
                    </div>
                    <div class="card-num">N° ${num}</div>
                </div>
            `;

            card.addEventListener('click', () => openProjectModal(p));
            projectsGrid.appendChild(card);
        });
    }

    // Fetch projects
    fetch('data/projects.json')
        .then(r => r.json())
        .then(data => {
            renderProjects(data);
            // Default: show VR projects
            document.querySelector('.filter-btn[data-filter="vr"]')?.click();
        })
        .catch(err => console.error('Error loading projects:', err));

    // Filter
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const val = btn.getAttribute('data-filter');
            document.querySelectorAll('.project-card').forEach(card => {
                const cat = card.getAttribute('data-category') || '';
                const show = val === 'all' || cat.toLowerCase() === val.toLowerCase();
                card.style.display = show ? '' : 'none';
            });
        });
    });

    // ===== LIGHTBOX =====
    function openLightbox(index) {
        if (!currentLightboxMedia.length) return;
        currentLightboxIdx = index;
        lightboxImg.src = currentLightboxMedia[currentLightboxIdx].url;
        lightboxOverlay.classList.add('active');
        const multi = currentLightboxMedia.length > 1;
        if (lightboxPrev) lightboxPrev.style.display = multi ? 'flex' : 'none';
        if (lightboxNext) lightboxNext.style.display = multi ? 'flex' : 'none';
    }

    function closeLightbox() {
        lightboxOverlay?.classList.remove('active');
        setTimeout(() => { if (lightboxImg) lightboxImg.src = ''; }, 300);
    }

    lightboxClose?.addEventListener('click', closeLightbox);
    lightboxNext?.addEventListener('click', e => {
        e.stopPropagation();
        openLightbox((currentLightboxIdx + 1) % currentLightboxMedia.length);
    });
    lightboxPrev?.addEventListener('click', e => {
        e.stopPropagation();
        openLightbox((currentLightboxIdx - 1 + currentLightboxMedia.length) % currentLightboxMedia.length);
    });
    lightboxOverlay?.addEventListener('click', e => { if (e.target === lightboxOverlay) closeLightbox(); });

    const globalMainImg = document.getElementById('modalMainImg');
    if (globalMainImg) {
        globalMainImg.style.cursor = 'zoom-in';
        globalMainImg.addEventListener('click', function() {
            if (currentLightboxMedia.length > 0) {
                const url = globalMainImg.src;
                let idx = 0;
                currentLightboxMedia.forEach((m, i) => { if (url.includes(m.url)) idx = i; });
                openLightbox(idx);
            }
        });
    }

    // ===== MODAL =====
    function openProjectModal(project) {
        if (!project) return;
        currentLightboxMedia = project.media ? project.media.filter(m => m.type === 'image') : [];

        const mc = document.querySelector('.modal-content');
        if (mc) mc.scrollTop = 0;

        document.getElementById('modalTitle').textContent       = project.title || '';
        document.getElementById('modalSubtitle').textContent    = project.subtitle || '';
        document.getElementById('modalDescription').textContent = project.description || '';

        const codeLink = document.getElementById('modalCodeLink');
        codeLink.href         = project.codeLink || '#';
        codeLink.style.display = project.codeLink ? 'inline-flex' : 'none';

        const projLink = document.getElementById('modalLink');
        projLink.href         = project.codeLink2 || '#';
        projLink.style.display = project.codeLink2 ? 'inline-flex' : 'none';

        const techList = document.getElementById('modalTechList');
        techList.innerHTML = '';
        (project.technologies || []).forEach(tech => {
            const li = document.createElement('li');
            li.textContent = tech;
            techList.appendChild(li);
        });

        const mainImg        = document.getElementById('modalMainImg');
        const videoFrame     = document.getElementById('modalVideo');
        const sketchfabFrame = document.getElementById('modalSketchfab');
        const thumbsContainer = document.getElementById('mediaThumbnails');

        mainImg.style.display        = 'none';
        videoFrame.style.display     = 'none';
        sketchfabFrame.style.display = 'none';
        thumbsContainer.innerHTML    = '';

        if (project.media && project.media.length > 0) {
            showMedia(project.media[0]);
            project.media.forEach((media, idx) => {
                const thumb = document.createElement('img');
                if (media.type === 'video') {
                    const vid = media.url.split('/').pop().split('?')[0];
                    thumb.src = `https://img.youtube.com/vi/${vid}/default.jpg`;
                } else if (media.type === 'sketchfab') {
                    thumb.src = media.thumbnail || '';
                } else {
                    thumb.src = media.url;
                }
                thumb.alt = `Thumbnail ${idx + 1}`;
                thumb.className = 'media-thumb' + (media.type !== 'image' ? ' video-thumb' : '');
                thumb.addEventListener('click', () => {
                    showMedia(media);
                    document.querySelectorAll('.media-thumb').forEach(t => t.classList.remove('active'));
                    thumb.classList.add('active');
                });
                thumbsContainer.appendChild(thumb);
            });
            thumbsContainer.firstChild?.classList.add('active');
        }

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    function showMedia(media) {
        const mainImg        = document.getElementById('modalMainImg');
        const videoFrame     = document.getElementById('modalVideo');
        const sketchfabFrame = document.getElementById('modalSketchfab');
        if (media.type === 'image') {
            mainImg.src = media.url; mainImg.style.display = 'block';
            videoFrame.style.display = 'none'; sketchfabFrame.style.display = 'none';
        } else if (media.type === 'video') {
            videoFrame.src = media.url; videoFrame.style.display = 'block';
            mainImg.style.display = 'none'; sketchfabFrame.style.display = 'none';
        } else if (media.type === 'sketchfab') {
            sketchfabFrame.src = media.url; sketchfabFrame.style.display = 'block';
            mainImg.style.display = 'none'; videoFrame.style.display = 'none';
        }
    }

    function closeModal() {
        if (modal) modal.style.display = 'none';
        document.body.style.overflow = '';
        const vf = document.getElementById('modalVideo');
        if (vf) vf.src = '';
    }

    closeBtn?.addEventListener('click', closeModal);
    window.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            if (modal?.style.display === 'block') closeModal();
            if (lightboxOverlay?.classList.contains('active')) closeLightbox();
        }
    });
});
