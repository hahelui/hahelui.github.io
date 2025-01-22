// Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    antialias: true,
    alpha: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

// Create stars
function addStar() {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const star = new THREE.Mesh(geometry, material);

    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
    star.position.set(x, y, z);
    scene.add(star);
    return star;
}

const stars = Array(200).fill().map(addStar);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
scene.add(ambientLight, pointLight);

// Add directional light for better visibility
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(0, 1, 0);
scene.add(dirLight);

// Create geometric shapes for each section
const shapes = {
    whoami: createDodecahedron(),
    experience: createOctahedron(),
    contact: createTorus(),
    footer: createIcosahedron()
};

// Shape creation functions
function createDodecahedron() {
    const geometry = new THREE.DodecahedronGeometry(3);
    const material = new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        wireframe: true
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(-5, 0, 15);  
    mesh.userData = {
        homePosition: { x: -5, y: 0, z: 15 },
        farPosition: { x: -5, y: 0, z: 50 }
    };
    scene.add(mesh);
    return mesh;
}

function createOctahedron() {
    const geometry = new THREE.OctahedronGeometry(4);
    const material = new THREE.MeshStandardMaterial({
        color: 0xff0088,
        wireframe: true
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(5, 0, 15);  
    mesh.userData = {
        homePosition: { x: 5, y: 0, z: 15 },
        farPosition: { x: 5, y: 0, z: 50 }
    };
    scene.add(mesh);
    return mesh;
}

function createTorus() {
    const geometry = new THREE.TorusGeometry(3, 1, 16, 100);
    const material = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        wireframe: true
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 15);  
    mesh.userData = {
        homePosition: { x: 0, y: 0, z: 15 },
        farPosition: { x: 0, y: 0, z: 50 }
    };
    scene.add(mesh);
    return mesh;
}

function createIcosahedron() {
    const geometry = new THREE.IcosahedronGeometry(3);
    const material = new THREE.MeshStandardMaterial({
        color: 0xff8800,
        wireframe: true
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 15);  
    mesh.userData = {
        homePosition: { x: 0, y: 0, z: 15 },
        farPosition: { x: 0, y: 0, z: 50 }
    };
    scene.add(mesh);
    return mesh;
}

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
        if (shape.material) {
            shape.material.opacity = scale;
            shape.material.transparent = true;
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

// Animation
function animate() {
    requestAnimationFrame(animate);

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

// Handle window resize
window.addEventListener('resize', () => {
    // Update camera and renderer
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Adjust shape positions based on screen size
    const isMobile = window.innerWidth < 768;
    Object.values(shapes).forEach(shape => {
        // Move shapes closer on mobile
        if (isMobile) {
            shape.userData.homePosition.z = 10;
            shape.userData.farPosition.z = 30;
        } else {
            shape.userData.homePosition.z = 15;
            shape.userData.farPosition.z = 50;
        }
    });
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

// Start animation
animate();

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
