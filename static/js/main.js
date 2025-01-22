// Reusable materials and geometries
const materials = {
    wireframe: {
        green: new THREE.LineBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 1 }),
        pink: new THREE.LineBasicMaterial({ color: 0xff0088, transparent: true, opacity: 1 }),
        blue: new THREE.LineBasicMaterial({ color: 0x0088ff, transparent: true, opacity: 1 }),
        orange: new THREE.LineBasicMaterial({ color: 0xff8800, transparent: true, opacity: 1 })
    },
    glow: {
        green: new THREE.MeshBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.1, side: THREE.BackSide }),
        pink: new THREE.MeshBasicMaterial({ color: 0xff0088, transparent: true, opacity: 0.1, side: THREE.BackSide }),
        blue: new THREE.MeshBasicMaterial({ color: 0x0088ff, transparent: true, opacity: 0.1, side: THREE.BackSide }),
        orange: new THREE.MeshBasicMaterial({ color: 0xff8800, transparent: true, opacity: 0.1, side: THREE.BackSide })
    },
    fill: {
        green: new THREE.MeshBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.05 }),
        pink: new THREE.MeshBasicMaterial({ color: 0xff0088, transparent: true, opacity: 0.05 }),
        blue: new THREE.MeshBasicMaterial({ color: 0x0088ff, transparent: true, opacity: 0.05 }),
        orange: new THREE.MeshBasicMaterial({ color: 0xff8800, transparent: true, opacity: 0.05 })
    }
};

// Three.js setup with optimized settings
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for better performance
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

// Optimized star creation with geometry instancing
const starGeometry = new THREE.SphereGeometry(0.25, 24, 24);
const starMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 0.5
});

function addStar() {
    const star = new THREE.Mesh(starGeometry, starMaterial);
    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
    star.position.set(x, y, z);
    scene.add(star);
    return star;
}

const stars = Array(200).fill().map(addStar);

// Optimized lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(0, 1, 0);
scene.add(ambientLight, pointLight, dirLight);

// Optimized shape creation functions
function createShape(type, color, size = 3) {
    let geometry, glowSize, fillSize;
    
    switch(type) {
        case 'dodecahedron':
            geometry = new THREE.DodecahedronGeometry(size);
            glowSize = size * 1.067; // 3.2 / 3
            fillSize = size * 0.967; // 2.9 / 3
            break;
        case 'octahedron':
            geometry = new THREE.OctahedronGeometry(size);
            glowSize = size * 1.05;
            fillSize = size * 0.975;
            break;
        case 'torus':
            geometry = new THREE.TorusGeometry(size, size/3, 32, 100);
            glowSize = size * 1.067;
            fillSize = size * 0.967;
            break;
        case 'icosahedron':
            geometry = new THREE.IcosahedronGeometry(size);
            glowSize = size * 1.067;
            fillSize = size * 0.967;
            break;
    }

    const edges = new THREE.EdgesGeometry(geometry);
    const group = new THREE.Group();

    // Main wireframe
    const wireframe = new THREE.LineSegments(edges, materials.wireframe[color]);

    // Glow effect
    const glowGeometry = type === 'torus' 
        ? new THREE.TorusGeometry(glowSize, (glowSize)/3, 32, 100)
        : geometry.clone().scale(glowSize/size, glowSize/size, glowSize/size);
    const glow = new THREE.Mesh(glowGeometry, materials.glow[color]);

    // Inner fill
    const fillGeometry = type === 'torus'
        ? new THREE.TorusGeometry(fillSize, (fillSize)/3, 32, 100)
        : geometry.clone().scale(fillSize/size, fillSize/size, fillSize/size);
    const fill = new THREE.Mesh(fillGeometry, materials.fill[color]);

    group.add(wireframe, glow, fill);
    return group;
}

// Create geometric shapes with optimized creation
const shapes = {
    whoami: createShape('dodecahedron', 'green'),
    experience: createShape('octahedron', 'pink', 4),
    contact: createShape('torus', 'blue'),
    footer: createShape('icosahedron', 'orange')
};

// Position shapes
shapes.whoami.position.set(-5, 0, 15);
shapes.whoami.userData = {
    homePosition: { x: -5, y: 0, z: 15 },
    farPosition: { x: -5, y: 0, z: 50 }
};
scene.add(shapes.whoami);

shapes.experience.position.set(5, 0, 15);
shapes.experience.userData = {
    homePosition: { x: 5, y: 0, z: 15 },
    farPosition: { x: 5, y: 0, z: 50 }
};
scene.add(shapes.experience);

shapes.contact.position.set(0, 0, 15);
shapes.contact.userData = {
    homePosition: { x: 0, y: 0, z: 15 },
    farPosition: { x: 0, y: 0, z: 50 }
};
scene.add(shapes.contact);

shapes.footer.position.set(0, 0, 15);
shapes.footer.userData = {
    homePosition: { x: 0, y: 0, z: 15 },
    farPosition: { x: 0, y: 0, z: 50 }
};
scene.add(shapes.footer);

// Navigation dots and sections
const navDots = document.querySelectorAll('.nav-dot');
const sections = Array.from(document.querySelectorAll('section, footer'));
let currentSectionIndex = 0;
let isScrolling = false;

// Camera animation state
const cameraState = {
    posZ: 30,
    rotX: 0,
    rotY: 0
};

// Function to update shapes based on section
function updateShapes(sectionIndex) {
    const t = performance.now() * 0.001; // Get time in seconds

    Object.entries(shapes).forEach(([key, shape]) => {
        // Always rotate
        shape.rotation.x += 0.005;
        shape.rotation.y += 0.01;
        
        // Gentle floating animation
        const floatOffset = Math.sin(t) * 0.5;
        shape.position.y = shape.userData.homePosition.y + floatOffset;

        // Move shapes in and out based on section
        const isActive = (
            (key === 'whoami' && sectionIndex === 0) ||
            (key === 'experience' && sectionIndex === 1) ||
            (key === 'contact' && sectionIndex === 2) ||
            (key === 'footer' && sectionIndex === 3)
        );

        // Smoothly transition Z position
        const targetZ = isActive ? shape.userData.homePosition.z : shape.userData.farPosition.z;
        shape.position.z += (targetZ - shape.position.z) * 0.1;

        // Scale based on distance
        const scale = 1 - (shape.position.z - shape.userData.homePosition.z) / 50;
        shape.scale.set(scale, scale, scale);

        // Adjust opacity based on distance
        if (shape.children[0].material) {
            shape.children[0].material.opacity = scale;
            shape.children[0].material.transparent = true;
        }
    });
}

// Function to scroll to a specific section
function scrollToSection(index) {
    if (index >= 0 && index < sections.length && !isScrolling) {
        isScrolling = true;
        currentSectionIndex = index;
        
        // Update active dot
        navDots.forEach(dot => dot.classList.remove('active'));
        navDots[index].classList.add('active');
        
        // Update section visibility with GSAP
        sections.forEach((section, i) => {
            gsap.to(section, {
                opacity: i === index ? 1 : 0,
                visibility: i === index ? 'visible' : 'hidden',
                duration: 0.8,
                ease: 'power2.inOut'
            });
            
            if (i === index) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });

        // Animate camera with GSAP
        const targetZ = index * -5 + 30;
        const targetRotX = index * 0.1;
        const targetRotY = index * 0.1;

        gsap.to(cameraState, {
            posZ: targetZ,
            rotX: targetRotX,
            rotY: targetRotY,
            duration: 0.8,
            ease: 'power2.inOut',
            onComplete: () => {
                isScrolling = false;
            }
        });
    }
}

// Handle mouse wheel scrolling
function handleWheel(e) {
    e.preventDefault();
    
    if (!isScrolling) {
        if (e.deltaY > 0 && currentSectionIndex < sections.length - 1) {
            scrollToSection(currentSectionIndex + 1);
        } else if (e.deltaY < 0 && currentSectionIndex > 0) {
            scrollToSection(currentSectionIndex - 1);
        }
    }
}

// Handle dot click
navDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        scrollToSection(index);
    });
});

// Handle keyboard navigation
function handleKeydown(e) {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        if (currentSectionIndex < sections.length - 1) {
            scrollToSection(currentSectionIndex + 1);
        }
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        if (currentSectionIndex > 0) {
            scrollToSection(currentSectionIndex - 1);
        }
    }
}

// Optimized animation with requestAnimationFrame throttling
let lastRender = 0;
const FRAME_RATE = 60;
const FRAME_INTERVAL = 1000 / FRAME_RATE;

function animate(currentTime) {
    requestAnimationFrame(animate);

    // Throttle rendering
    if (currentTime - lastRender < FRAME_INTERVAL) return;
    lastRender = currentTime;

    // Animate stars
    stars.forEach(star => {
        star.rotation.x += 0.001;
        star.rotation.y += 0.001;
        star.position.z += 0.01;
        if (star.position.z > 50) star.position.z = -50;
    });

    // Update shapes
    updateShapes(currentSectionIndex);

    // Update camera position and rotation from animation state
    camera.position.z = cameraState.posZ;
    camera.rotation.x = cameraState.rotX;
    camera.rotation.y = cameraState.rotY;

    renderer.render(scene, camera);
}

animate();

// Optimized resize handler with debouncing
let resizeTimeout;
window.addEventListener('resize', () => {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    
    resizeTimeout = setTimeout(() => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }, 250);
});

// Add event listeners
window.addEventListener('wheel', handleWheel, { passive: false });
window.addEventListener('keydown', handleKeydown);

// Handle touch events for mobile
let touchStartY = 0;
window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
});

window.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (!isScrolling) {
        const touchEndY = e.touches[0].clientY;
        const deltaY = touchStartY - touchEndY;
        
        if (Math.abs(deltaY) > 50) {
            if (deltaY > 0 && currentSectionIndex < sections.length - 1) {
                scrollToSection(currentSectionIndex + 1);
            } else if (deltaY < 0 && currentSectionIndex > 0) {
                scrollToSection(currentSectionIndex - 1);
            }
            touchStartY = touchEndY;
        }
    }
}, { passive: false });

// Remove loading screen once everything is ready
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 500);
});

// Set initial section positions
sections.forEach((section, i) => {
    if (i === 0) {
        section.classList.add('active');
        section.style.opacity = '1';
        section.style.visibility = 'visible';
    } else {
        section.style.opacity = '0';
        section.style.visibility = 'hidden';
    }
});
