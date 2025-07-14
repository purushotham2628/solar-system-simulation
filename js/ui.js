class UIManager {
  constructor(solarSystem) {
    this.solarSystem = solarSystem;
    this.fpsCounter = 0;
    this.lastTime = performance.now();
    
    this.initializeControls();
    this.setupEventListeners();
    this.startFPSCounter();
  }

  initializeControls() {
    this.createGlobalControls();
    this.createPlanetControls();
    this.setupPanelToggles();
  }

  createGlobalControls() {
    // Global speed control
    const globalSpeedSlider = document.getElementById('global-speed');
    const globalSpeedDisplay = globalSpeedSlider.nextElementSibling;
    
    globalSpeedSlider.addEventListener('input', (e) => {
      const speed = parseFloat(e.target.value);
      this.solarSystem.setTimeSpeed(speed);
      globalSpeedDisplay.textContent = `${speed}x`;
    });

    // Camera distance control
    const cameraDistanceSlider = document.getElementById('camera-distance');
    const cameraDistanceDisplay = cameraDistanceSlider.nextElementSibling;
    
    cameraDistanceSlider.addEventListener('input', (e) => {
      const distance = parseInt(e.target.value);
      this.solarSystem.setCameraDistance(distance);
      cameraDistanceDisplay.textContent = distance;
    });

    // Action buttons
    document.getElementById('reset-camera').addEventListener('click', () => {
      this.solarSystem.resetCamera();
      cameraDistanceSlider.value = 70;
      cameraDistanceDisplay.textContent = '70';
    });

    document.getElementById('toggle-orbits').addEventListener('click', () => {
      this.solarSystem.toggleOrbits();
    });
  }

  createPlanetControls() {
    const planetControlsContainer = document.getElementById('planet-controls');
    
    PLANET_DATA.forEach((planetData, index) => {
      const controlDiv = document.createElement('div');
      controlDiv.className = 'planet-control';
      
      const nameSpan = document.createElement('span');
      nameSpan.className = 'planet-name';
      nameSpan.textContent = planetData.name;
      nameSpan.style.color = `#${planetData.color.toString(16).padStart(6, '0')}`;
      
      const slider = document.createElement('input');
      slider.type = 'range';
      slider.min = '0';
      slider.max = '0.1';
      slider.step = '0.001';
      slider.value = planetData.speed;
      
      const speedDisplay = document.createElement('span');
      speedDisplay.className = 'planet-speed';
      speedDisplay.textContent = `${planetData.speed.toFixed(3)}`;
      
      slider.addEventListener('input', (e) => {
        const speed = parseFloat(e.target.value);
        const planet = this.solarSystem.planets[index];
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
  }

  setupPanelToggles() {
    // Controls panel toggle
    const controlsToggle = document.getElementById('toggle-controls');
    const controlsContent = document.querySelector('#controls-panel .panel-content');
    
    controlsToggle.addEventListener('click', () => {
      controlsContent.classList.toggle('collapsed');
      controlsToggle.textContent = controlsContent.classList.contains('collapsed') ? '+' : '−';
    });

    // Info panel toggle
    const infoToggle = document.getElementById('toggle-info');
    const infoContent = document.querySelector('#info-panel .panel-content');
    
    infoToggle.addEventListener('click', () => {
      infoContent.classList.toggle('collapsed');
      infoToggle.textContent = infoContent.classList.contains('collapsed') ? '+' : '−';
    });
  }

  setupEventListeners() {
    // Listen for planet selection
    window.addEventListener('planetSelected', (event) => {
      this.displayPlanetInfo(event.detail.planet);
    });
  }

  displayPlanetInfo(planetData) {
    const infoContainer = document.getElementById('planet-info');
    
    if (planetData.type === 'sun') {
      infoContainer.innerHTML = `
        <div class="planet-detail">
          <h4>${planetData.name}</h4>
          <p>${planetData.info.description}</p>
          <div class="planet-stats">
            <div class="stat-item">
              <span class="stat-label">Diameter</span>
              <span class="stat-value">${planetData.info.diameter}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Temperature</span>
              <span class="stat-value">${planetData.info.temperature}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Age</span>
              <span class="stat-value">${planetData.info.age}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Composition</span>
              <span class="stat-value">${planetData.info.composition}</span>
            </div>
          </div>
        </div>
      `;
    } else {
      infoContainer.innerHTML = `
        <div class="planet-detail">
          <h4>${planetData.name}</h4>
          <p>${planetData.info.description}</p>
          <div class="planet-stats">
            <div class="stat-item">
              <span class="stat-label">Diameter</span>
              <span class="stat-value">${planetData.info.diameter}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Distance</span>
              <span class="stat-value">${planetData.info.distance}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Day Length</span>
              <span class="stat-value">${planetData.info.day}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Year Length</span>
              <span class="stat-value">${planetData.info.year}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Moons</span>
              <span class="stat-value">${planetData.info.moons}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Temperature</span>
              <span class="stat-value">${planetData.info.temperature}</span>
            </div>
          </div>
        </div>
      `;
    }

    // Expand info panel if collapsed
    const infoContent = document.querySelector('#info-panel .panel-content');
    const infoToggle = document.getElementById('toggle-info');
    if (infoContent.classList.contains('collapsed')) {
      infoContent.classList.remove('collapsed');
      infoToggle.textContent = '−';
    }
  }

  startFPSCounter() {
    const fpsElement = document.getElementById('fps-counter');
    const timeElement = document.getElementById('time-display');
    
    const updateStats = () => {
      const currentTime = performance.now();
      this.fpsCounter++;
      
      if (currentTime - this.lastTime >= 1000) {
        const fps = Math.round((this.fpsCounter * 1000) / (currentTime - this.lastTime));
        fpsElement.textContent = `FPS: ${fps}`;
        
        const earthDays = this.solarSystem.getEarthDays();
        timeElement.textContent = `Earth Days: ${earthDays.toLocaleString()}`;
        
        this.fpsCounter = 0;
        this.lastTime = currentTime;
      }
      
      requestAnimationFrame(updateStats);
    };
    
    updateStats();
  }
}