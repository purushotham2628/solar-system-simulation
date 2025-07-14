// Main application initialization
let solarSystem;
let uiManager;

// Loading screen management
function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  loadingScreen.style.opacity = '0';
  setTimeout(() => {
    loadingScreen.style.display = 'none';
  }, 500);
}

// Initialize the application
async function init() {
  try {
    // Create solar system
    solarSystem = new SolarSystem();
    
    // Wait for solar system to initialize
    await new Promise(resolve => {
      const checkInit = () => {
        if (solarSystem.sun && solarSystem.planets.length === PLANET_DATA.length) {
          resolve();
        } else {
          setTimeout(checkInit, 100);
        }
      };
      checkInit();
    });
    
    // Initialize UI
    uiManager = new UIManager(solarSystem);
    
    // Hide loading screen
    setTimeout(hideLoadingScreen, 2000);
    
  } catch (error) {
    console.error('Failed to initialize solar system:', error);
    hideLoadingScreen();
  }
}

// Start the application
init();

// Global error handling
window.addEventListener('error', (event) => {
  console.error('Application error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});