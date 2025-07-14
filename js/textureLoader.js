class TextureManager {
  constructor() {
    this.loader = new THREE.TextureLoader();
    this.textures = new Map();
    this.loadingPromises = new Map();
  }

  async loadTexture(url, name) {
    if (this.textures.has(name)) {
      return this.textures.get(name);
    }

    if (this.loadingPromises.has(name)) {
      return this.loadingPromises.get(name);
    }

    const promise = new Promise((resolve, reject) => {
      this.loader.load(
        url,
        (texture) => {
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          this.textures.set(name, texture);
          resolve(texture);
        },
        undefined,
        (error) => {
          console.warn(`Failed to load texture for ${name}:`, error);
          // Create a fallback colored texture
          const canvas = document.createElement('canvas');
          canvas.width = canvas.height = 256;
          const ctx = canvas.getContext('2d');
          
          // Create a gradient based on the planet's color
          const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
          gradient.addColorStop(0, '#ffffff');
          gradient.addColorStop(1, '#666666');
          
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, 256, 256);
          
          const fallbackTexture = new THREE.CanvasTexture(canvas);
          this.textures.set(name, fallbackTexture);
          resolve(fallbackTexture);
        }
      );
    });

    this.loadingPromises.set(name, promise);
    return promise;
  }

  createStarField() {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 2048;
    const ctx = canvas.getContext('2d');
    
    // Black background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 2048, 2048);
    
    // Add stars
    for (let i = 0; i < 1000; i++) {
      const x = Math.random() * 2048;
      const y = Math.random() * 2048;
      const size = Math.random() * 2;
      const brightness = Math.random();
      
      ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    return new THREE.CanvasTexture(canvas);
  }

  createSunTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Create sun surface texture
    const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
    gradient.addColorStop(0, '#ffff00');
    gradient.addColorStop(0.3, '#ffaa00');
    gradient.addColorStop(0.6, '#ff6600');
    gradient.addColorStop(1, '#cc3300');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);
    
    // Add some surface detail
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const radius = Math.random() * 20 + 5;
      
      const spotGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      spotGradient.addColorStop(0, 'rgba(255, 100, 0, 0.3)');
      spotGradient.addColorStop(1, 'rgba(255, 100, 0, 0)');
      
      ctx.fillStyle = spotGradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    return new THREE.CanvasTexture(canvas);
  }
}