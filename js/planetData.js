const PLANET_DATA = [
  {
    name: "Mercury",
    color: 0x8c7853,
    size: 0.38,
    distance: 12,
    speed: 0.047,
    rotationSpeed: 0.001,
    texture: "https://images.pexels.com/photos/87009/earth-soil-creep-moon-87009.jpeg?auto=compress&cs=tinysrgb&w=1024",
    info: {
      description: "The smallest planet and closest to the Sun. Mercury has extreme temperature variations.",
      diameter: "4,879 km",
      distance: "57.9 million km",
      day: "59 Earth days",
      year: "88 Earth days",
      moons: "0",
      temperature: "-173°C to 427°C"
    }
  },
  {
    name: "Venus",
    color: 0xffc649,
    size: 0.95,
    distance: 16,
    speed: 0.035,
    rotationSpeed: -0.0005,
    texture: "https://images.pexels.com/photos/1146134/pexels-photo-1146134.jpeg?auto=compress&cs=tinysrgb&w=1024",
    info: {
      description: "The hottest planet with a thick, toxic atmosphere. Often called Earth's twin.",
      diameter: "12,104 km",
      distance: "108.2 million km",
      day: "243 Earth days",
      year: "225 Earth days",
      moons: "0",
      temperature: "462°C"
    }
  },
  {
    name: "Earth",
    color: 0x6b93d6,
    size: 1.0,
    distance: 20,
    speed: 0.03,
    rotationSpeed: 0.01,
    texture: "https://images.pexels.com/photos/220201/pexels-photo-220201.jpeg?auto=compress&cs=tinysrgb&w=1024",
    info: {
      description: "Our home planet, the only known planet with life. 71% of surface is covered by water.",
      diameter: "12,756 km",
      distance: "149.6 million km",
      day: "24 hours",
      year: "365.25 days",
      moons: "1",
      temperature: "-89°C to 58°C"
    }
  },
  {
    name: "Mars",
    color: 0xcd5c5c,
    size: 0.53,
    distance: 25,
    speed: 0.024,
    rotationSpeed: 0.009,
    texture: "https://images.pexels.com/photos/33684/sunset-dreamy-dusk-evening.jpeg?auto=compress&cs=tinysrgb&w=1024",
    info: {
      description: "The Red Planet with the largest volcano in the solar system. Target for future human missions.",
      diameter: "6,792 km",
      distance: "227.9 million km",
      day: "24.6 hours",
      year: "687 Earth days",
      moons: "2",
      temperature: "-87°C to -5°C"
    }
  },
  {
    name: "Jupiter",
    color: 0xd8ca9d,
    size: 2.5,
    distance: 35,
    speed: 0.013,
    rotationSpeed: 0.02,
    texture: "https://images.pexels.com/photos/1146134/pexels-photo-1146134.jpeg?auto=compress&cs=tinysrgb&w=1024",
    info: {
      description: "The largest planet, a gas giant with a Great Red Spot storm larger than Earth.",
      diameter: "142,984 km",
      distance: "778.5 million km",
      day: "9.9 hours",
      year: "12 Earth years",
      moons: "95",
      temperature: "-108°C"
    }
  },
  {
    name: "Saturn",
    color: 0xfad5a5,
    size: 2.1,
    distance: 45,
    speed: 0.009,
    rotationSpeed: 0.018,
    texture: "https://images.pexels.com/photos/1146134/pexels-photo-1146134.jpeg?auto=compress&cs=tinysrgb&w=1024",
    hasRings: true,
    info: {
      description: "Famous for its spectacular ring system. Less dense than water despite its size.",
      diameter: "120,536 km",
      distance: "1.43 billion km",
      day: "10.7 hours",
      year: "29 Earth years",
      moons: "146",
      temperature: "-139°C"
    }
  },
  {
    name: "Uranus",
    color: 0x4fd0e7,
    size: 1.6,
    distance: 55,
    speed: 0.007,
    rotationSpeed: 0.012,
    texture: "https://images.pexels.com/photos/220201/pexels-photo-220201.jpeg?auto=compress&cs=tinysrgb&w=1024",
    info: {
      description: "An ice giant that rotates on its side. Has faint rings and extreme seasons.",
      diameter: "51,118 km",
      distance: "2.87 billion km",
      day: "17.2 hours",
      year: "84 Earth years",
      moons: "27",
      temperature: "-197°C"
    }
  },
  {
    name: "Neptune",
    color: 0x4b70dd,
    size: 1.5,
    distance: 65,
    speed: 0.005,
    rotationSpeed: 0.011,
    texture: "https://images.pexels.com/photos/220201/pexels-photo-220201.jpeg?auto=compress&cs=tinysrgb&w=1024",
    info: {
      description: "The windiest planet with speeds up to 2,100 km/h. The farthest known planet from the Sun.",
      diameter: "49,528 km",
      distance: "4.5 billion km",
      day: "16.1 hours",
      year: "165 Earth years",
      moons: "16",
      temperature: "-201°C"
    }
  }
];

const SUN_DATA = {
  name: "Sun",
  color: 0xfdb813,
  size: 4,
  rotationSpeed: 0.002,
  texture: "https://images.pexels.com/photos/1146134/pexels-photo-1146134.jpeg?auto=compress&cs=tinysrgb&w=1024",
  info: {
    description: "Our star, containing 99.86% of the Solar System's mass. Powers all life on Earth.",
    diameter: "1,392,700 km",
    temperature: "5,778K (surface)",
    age: "4.6 billion years",
    composition: "73% Hydrogen, 25% Helium"
  }
};