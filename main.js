// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000011);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 30, 70);

const renderer = new THREE.WebGLRenderer({ 
  canvas: document.getElementById('solarCanvas'),
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Lighting
const sunLight = new THREE.PointLight(0xffffff, 2, 500);
sunLight.position.set(0, 0, 0);
sunLight.castShadow = true;
scene.add(sunLight);

const ambientLight = new THREE.AmbientLight(0x404040, 0.1);
scene.add(ambientLight);

// Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 20;
controls.maxDistance = 200;

// Create starfield background
function createStarField() {
  const starGeometry = new THREE.BufferGeometry();
  const starCount = 10000;
  const positions = new Float32Array(starCount * 3);
  
  for (let i = 0; i < starCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 2000;
  }
  
  starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1 });
  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);
}

// Sun
const sun = new THREE.Mesh(
  new THREE.SphereGeometry(4, 32, 32),
  new THREE.MeshBasicMaterial({ 
    color: 0xfdb813,
    emissive: 0xffaa00,
    emissiveIntensity: 0.3
  })
);
scene.add(sun);

// Add sun glow
const sunGlow = new THREE.Mesh(
  new THREE.SphereGeometry(4.8, 32, 32),
  new THREE.MeshBasicMaterial({
    color: 0xffaa00,
    transparent: true,
    opacity: 0.1,
    side: THREE.BackSide
  })
);
sun.add(sunGlow);

// Planet data
const planetData = [
  { name: "Mercury", color: 0x8c7853, size: 0.38, distance: 12, speed: 0.047, rotationSpeed: 0.001 },
  { name: "Venus", color: 0xffc649, size: 0.95, distance: 16, speed: 0.035, rotationSpeed: -0.0005 },
  { name: "Earth", color: 0x6b93d6, size: 1.0, distance: 20, speed: 0.03, rotationSpeed: 0.01 },
  { name: "Mars", color: 0xcd5c5c, size: 0.53, distance: 25, speed: 0.024, rotationSpeed: 0.009 },
  { name: "Jupiter", color: 0xd8ca9d, size: 2.5, distance: 35, speed: 0.013, rotationSpeed: 0.02 },
  { name: "Saturn", color: 0xfad5a5, size: 2.1, distance: 45, speed: 0.009, rotationSpeed: 0.018, hasRings: true },
  { name: "Uranus", color: 0x4fd0e7, size: 1.6, distance: 55, speed: 0.007, rotationSpeed: 0.012 },
  { name: "Neptune", color: 0x4b70dd, size: 1.5, distance: 65, speed: 0.005, rotationSpeed: 0.011 }
];

const planets = [];
const orbitLines = [];
let timeSpeed = 1;
let showOrbits = true;
let earthDays = 0;

// Create planets
planetData.forEach((data, index) => {
  // Create planet
  const geometry = new THREE.SphereGeometry(data.size, 32, 32);
  const material = new THREE.MeshStandardMaterial({ 
    color: data.color,
    roughness: 0.8,
    metalness: 0.1
  });
  const planet = new THREE.Mesh(geometry, material);
  
  planet.castShadow = true;
  planet.receiveShadow = true;
  planet.position.x = data.distance;
  
  planet.userData = {
    ...data,
    angle: Math.random() * Math.PI * 2,
    type: 'planet'
  };
  
  scene.add(planet);
  planets.push(planet);

  // Add rings for Saturn
  if (data.hasRings) {
    const ringGeometry = new THREE.RingGeometry(data.size * 1.2, data.size * 2, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xaaaaaa,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide
    });
    const rings = new THREE.Mesh(ringGeometry, ringMaterial);
    rings.rotation.x = Math.PI / 2;
    planet.add(rings);
  }

  // Create orbit line
  const points = [];
  for (let i = 0; i <= 64; i++) {
    const angle = (i / 64) * Math.PI * 2;
    points.push(new THREE.Vector3(
      Math.cos(angle) * data.distance,
      0,
      Math.sin(angle) * data.distance
    ));
  }
  
  const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const orbitMaterial = new THREE.LineBasicMaterial({
    color: 0x444444,
    transparent: true,
    opacity: 0.3
  });
  
  const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
  scene.add(orbitLine);
  orbitLines.push(orbitLine);
});

// Create starfield
createStarField();

// UI Controls
let fpsCounter = 0;
let lastTime = performance.now();

function initializeControls() {
  // Global speed control
  const globalSpeedSlider = document.getElementById('global-speed');
  const globalSpeedDisplay = globalSpeedSlider.nextElementSibling;
  
  globalSpeedSlider.addEventListener('input', (e) => {
    timeSpeed = parseFloat(e.target.value);
    globalSpeedDisplay.textContent = `${timeSpeed}x`;
  });

  // Camera distance control
  const cameraDistanceSlider = document.getElementById('camera-distance');
  const cameraDistanceDisplay = cameraDistanceSlider.nextElementSibling;
  
  cameraDistanceSlider.addEventListener('input', (e) => {
    const distance = parseInt(e.target.value);
    const direction = camera.position.clone().normalize();
    camera.position.copy(direction.multiplyScalar(distance));
    cameraDistanceDisplay.textContent = distance;
  });

  // Reset camera button
  document.getElementById('reset-camera').addEventListener('click', () => {
    controls.reset();
    camera.position.set(0, 30, 70);
    camera.lookAt(0, 0, 0);
    cameraDistanceSlider.value = 70;
    cameraDistanceDisplay.textContent = '70';
  });

  // Toggle orbits button
  document.getElementById('toggle-orbits').addEventListener('click', () => {
    showOrbits = !showOrbits;
    orbitLines.forEach(line => {
      line.visible = showOrbits;
    });
  });

  // Create planet controls
  const planetControlsContainer = document.getElementById('planet-controls');
  
  planetData.forEach((data, index) => {
    const controlDiv = document.createElement('div');
    controlDiv.className = 'planet-control';
    
    const nameSpan = document.createElement('span');
    nameSpan.className = 'planet-name';
    nameSpan.textContent = data.name;
    nameSpan.style.color = `#${data.color.toString(16).padStart(6, '0')}`;
    
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0';
    slider.max = '0.1';
    slider.step = '0.001';
    slider.value = data.speed;
    
    const speedDisplay = document.createElement('span');
    speedDisplay.className = 'planet-speed';
    speedDisplay.textContent = `${data.speed.toFixed(3)}`;
    
    slider.addEventListener('input', (e) => {
      const speed = parseFloat(e.target.value);
      const planet = planets[index];
      if (planet) {
        planet.userData.speed = speed;
        speedDisplay.textContent = speed.toFixed(3);
      }
    });
    
    controlDiv.appendChild(nameSpan);
    controlDiv.appendChild(slider);
    controlDiv.appendChild(speedDisplay);
    planetControlsContainer.appendChild(controlDiv);
  });

  // Panel toggles
  const controlsToggle = document.getElementById('toggle-controls');
  const controlsContent = document.querySelector('#controls-panel .panel-content');
  
  controlsToggle.addEventListener('click', () => {
    controlsContent.classList.toggle('collapsed');
    controlsToggle.textContent = controlsContent.classList.contains('collapsed') ? '+' : '−';
  });

  const infoToggle = document.getElementById('toggle-info');
  const infoContent = document.querySelector('#info-panel .panel-content');
  
  infoToggle.addEventListener('click', () => {
    infoContent.classList.toggle('collapsed');
    infoToggle.textContent = infoContent.classList.contains('collapsed') ? '+' : '−';
  });
}

// FPS Counter
function startFPSCounter() {
  const fpsElement = document.getElementById('fps-counter');
  const timeElement = document.getElementById('time-display');
  
  const updateStats = () => {
    const currentTime = performance.now();
    fpsCounter++;
    
    if (currentTime - lastTime >= 1000) {
      const fps = Math.round((fpsCounter * 1000) / (currentTime - lastTime));
      fpsElement.textContent = `FPS: ${fps}`;
      
      timeElement.textContent = `Earth Days: ${Math.floor(earthDays).toLocaleString()}`;
      
      fpsCounter = 0;
      lastTime = currentTime;
    }
    
    requestAnimationFrame(updateStats);
  };
  
  updateStats();
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Update controls
  controls.update();

  // Update sun rotation
  sun.rotation.y += 0.002 * timeSpeed;

  // Update planets
  planets.forEach(planet => {
    const data = planet.userData;
    
    // Orbital motion
    data.angle += data.speed * timeSpeed;
    planet.position.x = data.distance * Math.cos(data.angle);
    planet.position.z = data.distance * Math.sin(data.angle);
    
    // Rotation
    planet.rotation.y += data.rotationSpeed * timeSpeed;
  });

  // Update Earth days counter
  const earthPlanet = planets.find(p => p.userData.name === 'Earth');
  if (earthPlanet) {
    earthDays += earthPlanet.userData.speed * timeSpeed * 365;
  }

  renderer.render(scene, camera);
}

// Window resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Hide loading screen
function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 500);
  }
}

// Initialize everything
function init() {
  initializeControls();
  startFPSCounter();
  animate();
  
  // Hide loading screen after a delay
  setTimeout(hideLoadingScreen, 2000);
}

// Start the application
init();