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
                this.size = Math.random() * 1.8 + 0.3;
                this.speedX = (Math.random() - 0.5) * 0.4;
                this.speedY = (Math.random() - 0.5) * 0.4;
                this.opacity = Math.random() * 0.5 + 0.1;
                this.color = Math.random() > 0.6 ? '#c77dff' : '#ffffff';
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
        const particleCount = isMobile ? 40 : 90;
        for (let i = 0; i < particleCount; i++) particles.push(new Particle());

        let gridOffset = 0;

        function drawVRGrid() {
            const vp = { x: canvas.width / 2, y: canvas.height * 0.62 };
            const cols = 16;
            const rows = 10;

            ctx.save();
            for (let r = 0; r <= rows; r++) {
                const t = (r + gridOffset % 1) / rows;
                const perspective = t * t;
                const y = vp.y + (canvas.height - vp.y) * perspective;
                const xSpan = canvas.width * 0.5 + canvas.width * 0.5 * perspective;
                const alpha = perspective * 0.22;
                ctx.globalAlpha = alpha;
                ctx.strokeStyle = '#7b2cbf';
                ctx.lineWidth = 0.6;
                ctx.beginPath();
                ctx.moveTo(vp.x - xSpan / 2, y);
                ctx.lineTo(vp.x + xSpan / 2, y);
                ctx.stroke();
            }
            for (let c = 0; c <= cols; c++) {
                const t = c / cols;
                const xFar = vp.x - canvas.width * 0.5 + canvas.width * t;
                const nearSpread = (xFar - vp.x) * 1.0;
                ctx.globalAlpha = 0.10;
                ctx.strokeStyle = '#9d4edd';
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(vp.x + (xFar - vp.x) * 0.01, vp.y);
                ctx.lineTo(vp.x + nearSpread, canvas.height);
                ctx.stroke();
            }
            ctx.restore();
            gridOffset += 0.008;
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawVRGrid();
            particles.forEach(p => { p.update(); p.draw(); });
            particles.forEach((p, i) => {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = p.x - particles[j].x;
                    const dy = p.y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 90) {
                        ctx.save();
                        ctx.globalAlpha = (1 - dist / 90) * 0.10;
                        ctx.strokeStyle = '#7b2cbf';
                        ctx.lineWidth = 0.5;
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

    // ===== TYPING EFFECT =====
    const typedEl = document.getElementById('typed-text');
    if (typedEl) {
        const roles = ['Immersive VR Worlds', 'Photorealistic 3D Models', 'Real-time Environments', 'VR Training Simulations', 'Interactive 3D Experiences', 'Unity XR Applications'];
        let roleIdx = 0, charIdx = 0, deleting = false;

        function typeLoop() {
            const current = roles[roleIdx];
            if (!deleting) {
                typedEl.textContent = current.slice(0, ++charIdx);
                if (charIdx === current.length) {
                    deleting = true;
                    setTimeout(typeLoop, 1800);
                    return;
                }
                setTimeout(typeLoop, 80);
            } else {
                typedEl.textContent = current.slice(0, --charIdx);
                if (charIdx === 0) {
                    deleting = false;
                    roleIdx = (roleIdx + 1) % roles.length;
                    setTimeout(typeLoop, 400);
                    return;
                }
                setTimeout(typeLoop, 45);
            }
        }
        typeLoop();
    }

    // ===== STATS COUNTER =====
    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 1800;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = Math.floor(current);
            if (current >= target) clearInterval(timer);
        }, 16);
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.querySelectorAll('.stat-number').forEach(animateCounter);
                counterObserver.disconnect();
            }
        });
    }, { threshold: 0.5 });

    const statsEl = document.querySelector('.hero-stats');
    if (statsEl) counterObserver.observe(statsEl);

    // Mobile Menu Toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    mobileBtn?.addEventListener('click', function(e) {
        e.stopPropagation();
        navMenu.classList.toggle('show');
    });
    // Tap outside to close nav
    document.addEventListener('click', function(e) {
        if (navMenu?.classList.contains('show') && !navMenu.contains(e.target) && e.target !== mobileBtn) {
            navMenu.classList.remove('show');
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                document.getElementById('nav-menu').classList.remove('show');
            }
        });
    });

    const modal = document.getElementById('projectModal');
    const closeBtn = document.querySelector('.close');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectsGrid = document.querySelector('.projects-grid');
    
    let currentLightboxMedia = [];
    let currentLightboxIdx = 0;

    const lightboxOverlay = document.getElementById('lightboxOverlay');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');

    function openLightbox(index) {
        if (!currentLightboxMedia || currentLightboxMedia.length === 0) return;
        currentLightboxIdx = index;
        lightboxImg.src = currentLightboxMedia[currentLightboxIdx].url;
        lightboxOverlay.classList.add('active');
        
        if (currentLightboxMedia.length <= 1) {
            lightboxPrev.style.display = 'none';
            lightboxNext.style.display = 'none';
        } else {
            lightboxPrev.style.display = 'flex';
            lightboxNext.style.display = 'flex';
        }
    }

    function closeLightbox() {
        if (lightboxOverlay) lightboxOverlay.classList.remove('active');
        setTimeout(() => { if (lightboxImg) lightboxImg.src = ''; }, 300);
    }

    lightboxClose?.addEventListener('click', closeLightbox);
    
    lightboxNext?.addEventListener('click', (e) => {
        e.stopPropagation();
        currentLightboxIdx = (currentLightboxIdx + 1) % currentLightboxMedia.length;
        openLightbox(currentLightboxIdx);
    });

    lightboxPrev?.addEventListener('click', (e) => {
        e.stopPropagation();
        currentLightboxIdx = (currentLightboxIdx - 1 + currentLightboxMedia.length) % currentLightboxMedia.length;
        openLightbox(currentLightboxIdx);
    });

    lightboxOverlay?.addEventListener('click', (e) => {
        if (e.target === lightboxOverlay) {
            closeLightbox();
        }
    });

    const globalMainImg = document.getElementById('modalMainImg');
    if (globalMainImg) {
        globalMainImg.style.cursor = 'zoom-in';
        globalMainImg.title = 'Click to view full screen';
        globalMainImg.addEventListener('click', function() {
            if (currentLightboxMedia.length > 0) {
                let displayUrl = globalMainImg.src;
                let targetIdx = 0;
                currentLightboxMedia.forEach((media, idx) => {
                    if (displayUrl.includes(media.url)) targetIdx = idx;
                });
                openLightbox(targetIdx);
            }
        });
    }

    let projects = [];

    // Fetch projects from JSON
    fetch('data/projects.json')
        .then(response => response.json())
        .then(data => {
            projects = data;
            renderProjects(projects);
            // Set VR Projects as default
            document.querySelector('.filter-btn[data-filter="vr"]')?.click();
        })
        .catch(err => console.error("Error loading projects: ", err));

    function renderProjects(projectsToRender) {
        if (!projectsGrid) return;
        projectsGrid.innerHTML = ''; // clear grid

        projectsToRender.forEach(p => {
            let thumbUrl = '';
            if (p.media && p.media.length > 0) {
                let m = p.media[0];
                if (m.type === 'image') thumbUrl = m.url;
                else if (m.type === 'video') {
                    const videoId = m.url.split('/').pop().split('?')[0];
                    thumbUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
                }
                else if (m.type === 'sketchfab') thumbUrl = m.thumbnail;
            }

            const card = document.createElement('div');
            card.className = 'project-card';
            card.setAttribute('data-project-id', p.id);
            card.setAttribute('data-category', p.category || 'all');

            let categoryText = p.subtitle ? `<p>${p.subtitle}</p>` : '';
            if(!categoryText && p.category) categoryText = `<p>${p.category}</p>`;

            card.innerHTML = `
                <div class="project-image">
                    <img src="${thumbUrl}" alt="${p.title}" onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
                </div>
                <div class="project-info">
                    <h3>${p.title}</h3>
                    ${categoryText}
                </div>
            `;

            // Click event for modal
            card.addEventListener('click', function() {
                openProjectModal(p);
            });

            // Touch feedback for mobile
            card.addEventListener('touchstart', function() {
                this.classList.add('active-touch');
            });
            card.addEventListener('touchend', function() {
                this.classList.remove('active-touch');
            });

            projectsGrid.appendChild(card);
        });
    }

    // Function to open modal with project data
    function openProjectModal(project) {
        if (!project) return;
        
        // Populate lightbox media with only images
        currentLightboxMedia = project.media ? project.media.filter(m => m.type === 'image') : [];
        
        // Reset modal scroll position
        const modalContent = document.querySelector('.modal-content');
        if(modalContent) modalContent.scrollTop = 0;
        
        // Set basic info
        document.getElementById('modalTitle').textContent = project.title || '';
        document.getElementById('modalSubtitle').textContent = project.subtitle || '';
        document.getElementById('modalDescription').textContent = project.description || '';
        
        // Set code link if available
        const codeLink = document.getElementById('modalCodeLink');
        if (project.codeLink) {
            codeLink.href = project.codeLink;
            codeLink.style.display = 'inline-block';
        } else {
            codeLink.style.display = 'none';
        }

        const codeLink2 = document.getElementById('modalLink');
        if (project.codeLink2) {
            codeLink2.href = project.codeLink2;
            codeLink2.style.display = 'inline-block';
        } else {
            codeLink2.style.display = 'none';
        }
        
        // Set technologies
        const techList = document.getElementById('modalTechList');
        techList.innerHTML = '';
        if(project.technologies) {
            project.technologies.forEach(tech => {
                const li = document.createElement('li');
                li.textContent = tech;
                techList.appendChild(li);
            });
        }
        
        // Handle media
        const mainImg = document.getElementById('modalMainImg');
        const videoFrame = document.getElementById('modalVideo');
        const sketchfabFrame = document.getElementById('modalSketchfab');
        const thumbnailsContainer = document.getElementById('mediaThumbnails');
        
        // Clear previous media
        mainImg.style.display = 'none';
        videoFrame.style.display = 'none';
        thumbnailsContainer.innerHTML = '';
        sketchfabFrame.style.display = 'none';
        
        // Load first media item if available
        if (project.media && project.media.length > 0) {
            const firstMedia = project.media[0];
            showMedia(firstMedia);
            
            // Create thumbnails
            project.media.forEach((media, index) => {
                const thumb = document.createElement('img');
                if (media.type === 'video') {
                    const videoId = media.url.split('/').pop().split('?')[0];
                    thumb.src = `https://img.youtube.com/vi/${videoId}/default.jpg`;
                } else if (media.type === 'sketchfab') {
                    thumb.src = media.thumbnail || 'https://via.placeholder.com/150?text=3D';
                } else {
                    thumb.src = media.url;
                }
                thumb.alt = `Thumbnail ${index + 1}`;
                thumb.classList.add('media-thumb');
                if (media.type === 'video' || media.type === 'sketchfab') {
                    thumb.classList.add('video-thumb');
                }
                thumb.dataset.index = index;
                
                thumb.addEventListener('click', () => {
                    showMedia(media);
                    document.querySelectorAll('.media-thumb').forEach(t => 
                        t.classList.remove('active'));
                    thumb.classList.add('active');
                });
                
                thumbnailsContainer.appendChild(thumb);
            });
            
            // Activate first thumbnail
            thumbnailsContainer.firstChild?.classList.add('active');
        }
        
        // Show modal
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Add touch events for mobile closing
        document.addEventListener('touchstart', handleTouchStart, { passive: false });
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
    }

    // Touch handling for mobile swipe to close
    let touchStartY = 0;
    function handleTouchStart(e) {
        touchStartY = e.touches[0].clientY;
    }
    
    function handleTouchMove(e) {
        if (!touchStartY) return;
        const touchY = e.touches[0].clientY;
        const modalContent = document.querySelector('.modal-content');
        
        // If user is scrolling up at the top of modal, allow page scroll
        if (modalContent.scrollTop <= 0 && touchY > touchStartY) {
            e.preventDefault();
            closeModal();
        }
        touchStartY = 0;
    }

    function showMedia(media) {
        const mainImg = document.getElementById('modalMainImg');
        const videoFrame = document.getElementById('modalVideo');
        const sketchfabFrame = document.getElementById('modalSketchfab');
        
        if (media.type === 'image') {
            mainImg.src = media.url;
            mainImg.alt = 'Project Image';
            mainImg.style.display = 'block';
            videoFrame.style.display = 'none';
            sketchfabFrame.style.display = 'none';
        } else if (media.type === 'video') {
            videoFrame.src = media.url;
            mainImg.style.display = 'none';
            videoFrame.style.display = 'block';
            sketchfabFrame.style.display = 'none';
        } else if (media.type === 'sketchfab') {
           sketchfabFrame.src = media.url;
           mainImg.style.display = 'none';
           videoFrame.style.display = 'none';
           sketchfabFrame.style.display = 'block';
        }
    }

    // Filter projects when button is clicked
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            // Filter projects
            const cards = document.querySelectorAll('.project-card');
            cards.forEach(card => {
                const category = card.getAttribute('data-category');
                card.style.display = (filterValue === 'all' || 
                    category?.toLowerCase() === filterValue?.toLowerCase()) ? 'block' : 'none';
            });
        });
    });

    // Close modal functions
    function closeModal() {
        if(modal) modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        // Reset video iframe
        const videoFrame = document.getElementById('modalVideo');
        if(videoFrame) videoFrame.src = '';
        // Remove touch event listeners
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchmove', handleTouchMove);
    }

    closeBtn?.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => { if(e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => {
        if(e.key === 'Escape' && modal && modal.style.display === 'block') closeModal();
    });

    // Add CSS for touch feedback
    const style = document.createElement('style');
    style.textContent = `
        .project-card.active-touch {
            transform: scale(0.98);
            opacity: 0.9;
            transition: transform 0.1s ease, opacity 0.1s ease;
        }
        @media (max-width: 768px) {
            .modal-content {
                max-height: 90vh;
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;
            }
            .modal-body {
                flex-direction: column;
            }
            .main-media {
                height: 40vh;
            }
        }
    `;
    document.head.appendChild(style);
});