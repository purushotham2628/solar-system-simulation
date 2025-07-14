class SolarSystem {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    this.renderer = new THREE.WebGLRenderer({ 
      canvas: document.getElementById('solarCanvas'),
      antialias: true
    });
    
    this.textureManager = new TextureManager();
    this.planets = [];
    this.orbitLines = [];
    this.sun = null;
    this.controls = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    
    this.timeSpeed = 1;
    this.showOrbits = true;
    this.earthDays = 0;
    
    this.init();
  }

  async init() {
    this.setupRenderer();
    this.setupCamera();
    this.setupLighting();
    this.setupControls();
    this.setupBackground();
    
    await this.createSun();
    await this.createPlanets();
    this.createOrbitLines();
    
    this.setupEventListeners();
    this.animate();
  }

  setupRenderer() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.8;
  }

  setupCamera() {
    this.camera.position.set(0, 30, 70);
    this.camera.lookAt(0, 0, 0);
  }

  setupLighting() {
    // Sun light
    const sunLight = new THREE.PointLight(0xffffff, 2, 500);
    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    this.scene.add(sunLight);

    // Ambient light for subtle illumination
    const ambientLight = new THREE.AmbientLight(0x404040, 0.1);
    this.scene.add(ambientLight);
  }

  setupControls() {
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 20;
    this.controls.maxDistance = 200;
    this.controls.enablePan = false;
  }

  setupBackground() {
    const starTexture = this.textureManager.createStarField();
    const starGeometry = new THREE.SphereGeometry(1000, 32, 32);
    const starMaterial = new THREE.MeshBasicMaterial({
      map: starTexture,
      side: THREE.BackSide
    });
    const starField = new THREE.Mesh(starGeometry, starMaterial);
    this.scene.add(starField);
  }

  async createSun() {
    const sunTexture = this.textureManager.createSunTexture();
    const sunGeometry = new THREE.SphereGeometry(SUN_DATA.size, 64, 64);
    const sunMaterial = new THREE.MeshBasicMaterial({
      map: sunTexture,
      emissive: new THREE.Color(0xffaa00),
      emissiveIntensity: 0.3
    });
    
    this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
    this.sun.userData = { ...SUN_DATA, type: 'sun' };
    this.scene.add(this.sun);

    // Add sun glow effect
    const glowGeometry = new THREE.SphereGeometry(SUN_DATA.size * 1.2, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide
    });
    const sunGlow = new THREE.Mesh(glowGeometry, glowMaterial);
    this.sun.add(sunGlow);
  }

  async createPlanets() {
    for (const planetData of PLANET_DATA) {
      await this.createPlanet(planetData);
    }
  }

  async createPlanet(data) {
    try {
      const texture = await this.textureManager.loadTexture(data.texture, data.name);
      
      const geometry = new THREE.SphereGeometry(data.size, 32, 32);
      const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.8,
        metalness: 0.1
      });
      
      const planet = new THREE.Mesh(geometry, material);
      planet.castShadow = true;
      planet.receiveShadow = true;
      
      // Set initial position
      planet.position.x = data.distance;
      
      planet.userData = {
        ...data,
        angle: Math.random() * Math.PI * 2,
        type: 'planet'
      };
      
      this.scene.add(planet);
      this.planets.push(planet);

      // Add rings for Saturn
      if (data.hasRings) {
        this.addRings(planet, data.size);
      }
    } catch (error) {
      console.error(`Failed to create planet ${data.name}:`, error);
    }
  }

  addRings(planet, planetSize) {
    const ringGeometry = new THREE.RingGeometry(planetSize * 1.2, planetSize * 2, 64);
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

  createOrbitLines() {
    PLANET_DATA.forEach(data => {
      const points = [];
      for (let i = 0; i <= 64; i++) {
        const angle = (i / 64) * Math.PI * 2;
        points.push(new THREE.Vector3(
          Math.cos(angle) * data.distance,
          0,
          Math.sin(angle) * data.distance
        ));
      }
      
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: 0x444444,
        transparent: true,
        opacity: 0.3
      });
      
      const orbitLine = new THREE.Line(geometry, material);
      this.scene.add(orbitLine);
      this.orbitLines.push(orbitLine);
    });
  }

  setupEventListeners() {
    window.addEventListener('resize', () => this.onWindowResize());
    window.addEventListener('click', (event) => this.onMouseClick(event));
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  onMouseClick(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects([this.sun, ...this.planets]);

    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
      this.selectPlanet(clickedObject);
    }
  }

  selectPlanet(planet) {
    // Dispatch custom event for UI to handle
    const event = new CustomEvent('planetSelected', {
      detail: { planet: planet.userData }
    });
    window.dispatchEvent(event);
  }

  setTimeSpeed(speed) {
    this.timeSpeed = speed;
  }

  setCameraDistance(distance) {
    const direction = this.camera.position.clone().normalize();
    this.camera.position.copy(direction.multiplyScalar(distance));
  }

  toggleOrbits() {
    this.showOrbits = !this.showOrbits;
    this.orbitLines.forEach(line => {
      line.visible = this.showOrbits;
    });
  }

  resetCamera() {
    this.controls.reset();
    this.camera.position.set(0, 30, 70);
    this.camera.lookAt(0, 0, 0);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Update controls
    this.controls.update();

    // Update sun rotation
    if (this.sun) {
      this.sun.rotation.y += SUN_DATA.rotationSpeed * this.timeSpeed;
    }

    // Update planets
    this.planets.forEach(planet => {
      const data = planet.userData;
      
      // Orbital motion
      data.angle += data.speed * this.timeSpeed;
      planet.position.x = data.distance * Math.cos(data.angle);
      planet.position.z = data.distance * Math.sin(data.angle);
      
      // Rotation
      planet.rotation.y += data.rotationSpeed * this.timeSpeed;
    });

    // Update Earth days counter
    const earthPlanet = this.planets.find(p => p.userData.name === 'Earth');
    if (earthPlanet) {
      this.earthDays += earthPlanet.userData.speed * this.timeSpeed * 365;
    }

    this.renderer.render(this.scene, this.camera);
  }

  getEarthDays() {
    return Math.floor(this.earthDays);
  }
}