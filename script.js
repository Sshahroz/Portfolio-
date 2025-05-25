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
            title: "Wheel Loader Komatsu WA1200",
            subtitle: "3d model",
            description: "This 3D low-poly model of the Komatsu WA1200 wheel loader is a simplified yet recognizable representation of the heavy-duty construction vehicle. Designed with efficiency and minimalism in mind, this model is perfect for applications such as real-time simulations, games, and visualizations where performance is key.",
            media: [
               // { type: "video", url: "https://www.youtube.com/embed/example1" },
                {type: "sketchfab",  url: "https://sketchfab.com/models/f766a86176354721a06a333f6903aad7/embed",
                thumbnail: "images/3DModel/WheelLoaderKomatsuWA1200/thumbnailSkechfab.png" }
            ],
            technologies: ["Blender","Substance Painter"],
            category: "3d"
        },
        
          {
            id: 2,
            title: "Terraced House",
            subtitle: "3d floor Plan",
            description: "This 3D floor plan is designed from the client’s provided 2D layout, converted into a realistic one-to-one scale model. The purpose is to help potential buyers or residents visualize the internal structure of the terraced house, making it easier for them to assess if the space meets their needs.",
            media: [
                { type: "image", url: "images/3DModel/TerracedHouse/BasementLeft.png" },
                { type: "image", url: "images/3DModel/TerracedHouse/GroundLeft.png" }, 
                { type: "image", url: "images/3DModel/TerracedHouse/1srtLeft.png" },          
                { type: "image", url: "images/3DModel/TerracedHouse/TopLeft.png" },
            
               // { type: "video", url: "https://www.youtube.com/embed/zjCXtcusnGc?si=ChhWXtrArr0D2RJ" }
            ],
            technologies: ["Blender",],
            codeLink2: "https://www.behance.net/gallery/161902367/3d-floor-plan",
            category: "3d"
        },
         {
            id: 3,
            title: "Wheel Loader Komatsu WA1200",
            subtitle: "3d model",
            description: "This 3D low-poly model of the Komatsu WA1200 wheel loader is a simplified yet recognizable representation of the heavy-duty construction vehicle. Designed with efficiency and minimalism in mind, this model is perfect for applications such as real-time simulations, games, and visualizations where performance is key.",
            media: [
                { type: "image", url: "https://mir-s3-cdn-cf.behance.net/projects/max_808/ae0919164750399.Y3JvcCwxMzgwLDEwODAsMjcwLDA.png" },
                {type: "sketchfab",  url: "https://sketchfab.com/models/f766a86176354721a06a333f6903aad7/embed",
                thumbnail: "https://media.sketchfab.com/models/f766a86176354721a06a333f6903aad7/thumbnails/28cd7c1e20a347a794941652041fd803/51efbdb0d4d54d02a1f8554ad1728c6b.jpeg" }
            ],
            technologies: ["Blender","Substance Painter"],
            projectLink: "#",
            codeLink: "#",
            codeLink2: "#",
            category: "vr"
        },

         {
            id: 4,
            title: "Build Apartment",
            subtitle: "3d Floor plan",
            description: "builder provides a 2D floor plan for an apartment,I convert it into a realistic 3D model which helps buyers and investors visualize the final space before construction is complete.",
            media: [
                { type: "image", url: "images/3DModel/Build Apartment/10.png" },
                { type: "image", url: "images/3DModel/Build Apartment/11.png" },
                { type: "image", url: "images/3DModel/Build Apartment/12.png" },
                { type: "image", url: "images/3DModel/Build Apartment/13.png" },
                
            ],
            technologies: ["Blender"],
            category: "3d"
        },

          {
            id: 5,
            title: "Family house 3D animation",
            subtitle: "Modern high tech 1700 Square Foot House",
            description: "In this project, I transformed a 1,700 sq. ft. house floor plan into a realistic 3D model to showcase the final living space before construction. Using advanced design tools, I created detailed visualizations of the interior and exterior, including: Accurate room layouts (bedrooms, kitchen, living areas). Modern interior styling (furniture, lighting, textures). Realistic materials & finishes (flooring, wall colors, cabinetry). Interactive walkthroughs for a virtual tour experience",
            media: [
                { type: "image", url: "images/VideoAnimation/Familyhouse/1.jpg" },
                { type: "image", url: "images/VideoAnimation/Familyhouse/2.jpg" },
                { type: "image", url: "images/VideoAnimation/Familyhouse/3.jpg" },
                { type: "video", url: "https://www.youtube.com/embed/DRhrJCblzKs?si=ZLK8y655suLtI3Wu" },
              
                
            
            ],
            technologies: ["Blender","Twinmotion"],
            category: "3d"
        },

         {
            id: 6,
            title: "Immersive VR House Tour",
            subtitle: "A Photorealistic 3D Interior Walkthrough Built in Unity for Virtual Reality",
            description: "Step inside a fully immersive 3D house tour designed for Oculus VR! This Unity-built experience lets you explore a photorealistic home in virtual reality, with natural movement, interactive objects, and dynamic lighting for maximum realism.",
            media: [
                { type: "video", url: "https://www.youtube.com/embed/45NTGu7zKZ8?si=M1psvM9M9EmVkujU" },
                { type: "image", url: "images/VRProject/VRHouseTour/1.png" },
                { type: "image", url: "images/VRProject/VRHouseTour/2.png" },
              
                
            
            ],
            technologies: ["Blender","Twinmotion"],
            category: "3d"
        },

        {
            id: 7,
            title: "Indian buses",
            subtitle: "Explore iconic Indian buses in a lightweight, mobile-optimized 3D world!",
            description: "Step into a hyper-realistic 3D simulation of iconic Indian buses, meticulously designed for mobile gaming! This lightweight, highly optimized experience lets you explore detailed bus interiors and vibrant streets with smooth performance on any device. Enjoy authentic textures, interactive elements, and dynamic environments that bring the chaos and charm of Indian travel to life—without lag or high-end hardware demands.",
            media: [
                { type: "image", url: "images/3DModel/Indian buses/1.png" },
                { type: "image", url: "images/3DModel/Indian buses/2.png" },
                { type: "image", url: "images/3DModel/Indian buses/3.png" },
                { type: "image", url: "images/3DModel/Indian buses/4.png" },

                
            
            ],
            technologies: ["Blender","Substance Painter "],
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
         const sketchfabFrame = document.getElementById('modalSketchfab'); // Add this
        const thumbnailsContainer = document.getElementById('mediaThumbnails');
        
        // Clear previous media
        mainImg.style.display = 'none';
        videoFrame.style.display = 'none';
        thumbnailsContainer.innerHTML = '';
         sketchfabFrame.style.display = 'none'; // Add this
        
          // Load first media item if available
    if (project.media?.length > 0) {
        const firstMedia = project.media[0];
        showMedia(firstMedia);
        
        // Create thumbnails
        project.media.forEach((media, index) => {
            const thumb = document.createElement('img');
            if (media.type === 'video') {
                thumb.src = `https://img.youtube.com/vi/${media.url.split('/').pop()}/default.jpg`;
            } else if (media.type === 'sketchfab') {
                // For Sketchfab, you might want to use a placeholder image or the Sketchfab thumbnail
                thumb.src = media.thumbnail || 'path/to/default-sketchfab-thumbnail.jpg';
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
         const sketchfabFrame = document.getElementById('modalSketchfab'); // Add this
        
        if (media.type === 'image') {
            mainImg.src = media.url;
            mainImg.alt = media.url.split('/').pop().split('.')[0];
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