document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    document.getElementById('mobile-menu-btn')?.addEventListener('click', function() {
        document.getElementById('nav-menu').classList.toggle('show');
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

    // Project Modal and Filtering Functionality
    const projectCards = document.querySelectorAll('.project-card');
    const modal = document.getElementById('projectModal');
    const closeBtn = document.querySelector('.close');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Project data with categories
    const projects = [
        {
            id: 1,
            title: "3D Loader",
            subtitle: "VR Project",
            description: "A 3D loading animation created for VR applications with smooth transitions and visual effects.",
            media: [
                { type: "image", url: "images/loader.png" },
                { type: "video", url: "https://www.youtube.com/embed/example1" }
            ],
            technologies: ["Unity", "C#", "Shader Graph"],
            projectLink: "#",
            codeLink: "#",
            codeLink2: "#",
            category: "vr"
        },
          {
            id: 2,
            title: "Terraced House",
            subtitle: "3d floor Plan",
            description: "This 3D floor plan is designed from the client’s provided 2D layout, converted into a realistic one-to-one scale model. The purpose is to help potential buyers or residents visualize the internal structure of the terraced house, making it easier for them to assess if the space meets their needs.",
            media: [
                { type: "image", url: "images/TerracedHouse/BasementLeft.png" },
                { type: "image", url: "images/TerracedHouse/GroundLeft.png" }, 
                   { type: "image", url: "images/TerracedHouse/1srtLeft.png" },          
                { type: "image", url: "images/TerracedHouse/TopLeft.png" },
               // { type: "video", url: "https://www.youtube.com/embed/zjCXtcusnGc?si=ChhSWXtrArr0D2RJ" }
            ],
            technologies: ["Blender",],
            codeLink2: "https://www.behance.net/gallery/161902367/3d-floor-plan",
            category: "3d"
        },
        // ... other projects ...
    ];

    // Function to open modal with project data
    function openProjectModal(project) {
        if (!project) return;
        
        // Reset modal scroll position
        document.querySelector('.modal-content').scrollTop = 0;
        
        // Set basic info
        document.getElementById('modalTitle').textContent = project.title;
        document.getElementById('modalSubtitle').textContent = project.subtitle;
        document.getElementById('modalDescription').textContent = project.description;
        //document.getElementById('modalLink').href = project.projectLink || "#";
        
        // Set code link if available
        const codeLink = document.getElementById('modalCodeLink');
        if (project.codeLink) {
            codeLink.href = project.codeLink;
            codeLink.style.display = 'inline-block';
        } else {
            codeLink.style.display = 'none';
        }

         // Set code link if available
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
        project.technologies.forEach(tech => {
            const li = document.createElement('li');
            li.textContent = tech;
            techList.appendChild(li);
        });
        
        // Handle media
        const mainImg = document.getElementById('modalMainImg');
        const videoFrame = document.getElementById('modalVideo');
        const thumbnailsContainer = document.getElementById('mediaThumbnails');
        
        // Clear previous media
        mainImg.style.display = 'none';
        videoFrame.style.display = 'none';
        thumbnailsContainer.innerHTML = '';
        
        // Load first media item if available
        if (project.media?.length > 0) {
            const firstMedia = project.media[0];
            showMedia(firstMedia);
            
            // Create thumbnails
            project.media.forEach((media, index) => {
                const thumb = document.createElement('img');
                thumb.src = media.type === 'video' 
                    ? `https://img.youtube.com/vi/${media.url.split('/').pop()}/default.jpg`
                    : media.url;
                thumb.alt = `Thumbnail ${index + 1}`;
                thumb.classList.add('media-thumb');
                if (media.type === 'video') thumb.classList.add('video-thumb');
                thumb.dataset.index = index;
                
                // Add touch events for mobile
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
        
        if (media.type === 'image') {
            mainImg.src = media.url;
            mainImg.alt = media.url.split('/').pop().split('.')[0];
            mainImg.style.display = 'block';
            videoFrame.style.display = 'none';
        } else if (media.type === 'video') {
            videoFrame.src = media.url;
            mainImg.style.display = 'none';
            videoFrame.style.display = 'block';
        }
    }

    // Add click and touch events to project cards
    projectCards.forEach(card => {
        card.addEventListener('click', function() {
            const projectId = parseInt(this.getAttribute('data-project-id'));
            const project = projects.find(p => p.id === projectId);
            openProjectModal(project);
        });
        
        // Touch feedback for mobile
        card.addEventListener('touchstart', function() {
            this.classList.add('active-touch');
        });
        card.addEventListener('touchend', function() {
            this.classList.remove('active-touch');
        });
    });

    // Filter projects when button is clicked
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            // Filter projects
            projectCards.forEach(card => {
                card.style.display = filterValue === 'all' || 
                    card.getAttribute('data-category') === filterValue ? 'block' : 'none';
            });
        });
    });

    // Close modal functions
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        // Reset video iframe
        document.getElementById('modalVideo').src = '';
        // Remove touch event listeners
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchmove', handleTouchMove);
    }

    closeBtn?.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => e.target === modal && closeModal());
    document.addEventListener('keydown', (e) => 
        e.key === 'Escape' && modal.style.display === 'block' && closeModal());

    // Initialize - show all projects by default
    document.querySelector('.filter-btn[data-filter="all"]')?.classList.add('active');

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