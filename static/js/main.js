// Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    antialias: true
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
                y: i === index ? '0%' : i < index ? '-100%' : '100%',
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
        const targetZ = index * -5 + 30; // Adjust these values to control camera movement
        const targetRotX = index * -0.1;
        const targetRotY = index * -0.1;

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
            // Scroll down
            scrollToSection(currentSectionIndex + 1);
        } else if (e.deltaY < 0 && currentSectionIndex > 0) {
            // Scroll up
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

    // Update camera position and rotation from animation state
    camera.position.z = cameraState.posZ;
    camera.rotation.x = cameraState.rotX;
    camera.rotation.y = cameraState.rotY;

    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
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
        
        if (Math.abs(deltaY) > 50) { // Minimum swipe distance
            if (deltaY > 0 && currentSectionIndex < sections.length - 1) {
                scrollToSection(currentSectionIndex + 1);
            } else if (deltaY < 0 && currentSectionIndex > 0) {
                scrollToSection(currentSectionIndex - 1);
            }
            touchStartY = touchEndY;
        }
    }
}, { passive: false });

// Start animation
animate();

// Set initial section positions
sections.forEach((section, i) => {
    if (i === 0) {
        section.classList.add('active');
        gsap.set(section, { y: '0%' });
    } else {
        gsap.set(section, { y: '100%' });
    }
});
