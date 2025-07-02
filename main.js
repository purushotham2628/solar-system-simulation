// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 70;

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('solarCanvas') });
renderer.setSize(window.innerWidth, window.innerHeight);


// Light
const light = new THREE.PointLight(0xffffff, 2, 300);
light.position.set(0, 0, 0);
scene.add(light);

// Sun
const sun = new THREE.Mesh(
  new THREE.SphereGeometry(5, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0xfdb813 })
);
scene.add(sun);

// Planet data
const planetData = [
  { name: "Mercury", color: 0xaaaaaa, size: 0.5, distance: 8, speed: 0.04 },
  { name: "Venus", color: 0xffcc66, size: 0.8, distance: 11, speed: 0.015 },
  { name: "Earth", color: 0x3399ff, size: 0.9, distance: 15, speed: 0.01 },
  { name: "Mars", color: 0xff3300, size: 0.7, distance: 18, speed: 0.008 },
  { name: "Jupiter", color: 0xff9966, size: 2, distance: 25, speed: 0.004 },
  { name: "Saturn", color: 0xffcc99, size: 1.7, distance: 32, speed: 0.003 },
  { name: "Uranus", color: 0x66ccff, size: 1.2, distance: 38, speed: 0.002 },
  { name: "Neptune", color: 0x3333ff, size: 1.1, distance: 44, speed: 0.0015 },
];

const planets = [];
const controlsPanel = document.getElementById('controls-panel');

// Create planets and sliders
planetData.forEach((data, index) => {
  // Create mesh
  const geometry = new THREE.SphereGeometry(data.size, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color: data.color });
  const mesh = new THREE.Mesh(geometry, material);

  // Store orbit info
  mesh.userData = {
    name: data.name,
    angle: Math.random() * Math.PI * 2,
    distance: data.distance,
    baseSpeed: data.speed,
    speed: data.speed
  };
  scene.add(mesh);
  planets.push(mesh);

  // Create speed slider UI
  const label = document.createElement('label');
  label.textContent = `${data.name} Speed: `;
  label.style.display = 'block';

  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = 0;
  slider.max = 0.1;
  slider.step = 0.001;
  slider.value = data.speed;
  slider.addEventListener('input', () => {
    mesh.userData.speed = parseFloat(slider.value);
  });

  label.appendChild(slider);
  controlsPanel.appendChild(label);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  sun.rotation.y += 0.002;

  planets.forEach(planet => {
    const data = planet.userData;
    data.angle += data.speed;
    planet.position.x = data.distance * Math.cos(data.angle);
    planet.position.z = data.distance * Math.sin(data.angle);
    planet.rotation.y += 0.01;
  });

  renderer.render(scene, camera);
}
animate();

// Resize support
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
