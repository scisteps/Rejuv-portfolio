// src/utils/campusData.js

// Your existing building data
export const INITIAL_BUILDINGS = [
  {
    id: 1,
    name: "Main Library",
    description: "24/7 study area with 500+ seats, group study rooms, computer lab, and coffee shop",
    lat: 37.3605,
    lng: -122.0675,
    imageUrl: "/images/library.jpg",
    category: "academic",
    hours: "Mon-Fri: 8am-12am, Sat-Sun: 10am-10pm",
    phone: "(555) 123-4567",
    amenities: ["WiFi", "Printing", "Study Rooms", "Coffee Shop"],
    type: "building",
    images: ["/images/library-1.jpg", "/images/library-2.jpg", "/images/library-3.jpg"],
    lottieAnimation: null
  },
  {
    id: 2,
    name: "Student Union",
    description: "Food court, book store, student activity center, and event spaces",
    lat: 37.3599,
    lng: -122.0653,
    imageUrl: "/images/union.jpg",
    category: "services",
    hours: "Mon-Sun: 7am-11pm",
    phone: "(555) 123-4568",
    amenities: ["Food Court", "Bookstore", "ATM", "Event Space"],
    type: "building",
    images: ["/images/union-1.jpg", "/images/union-2.jpg"],
    lottieAnimation: null
  },
  {
    id: 3,
    name: "Engineering Building",
    description: "Faculty of Engineering, labs, lecture halls, and research centers",
    lat: 37.3632,
    lng: -122.0665,
    imageUrl: "/images/engineering.jpg",
    category: "academic",
    hours: "Mon-Fri: 7am-10pm",
    phone: "(555) 123-4569",
    amenities: ["Labs", "Lecture Halls", "Research Centers", "WiFi"],
    type: "college",
    images: ["/images/engineering-1.jpg", "/images/engineering-2.jpg"],
    lottieAnimation: null
  },
  {
    id: 4,
    name: "Science Complex",
    description: "Physics, Chemistry, Biology departments with state-of-the-art labs",
    lat: 37.3595,
    lng: -122.0645,
    imageUrl: "/images/science.jpg",
    category: "academic",
    hours: "Mon-Fri: 7am-9pm",
    phone: "(555) 123-4570",
    amenities: ["Labs", "Research Equipment", "Lecture Halls"],
    type: "college",
    images: ["/images/science-1.jpg", "/images/science-2.jpg"],
    lottieAnimation: null
  },
  {
    id: 5,
    name: "Main Dining Hall",
    description: "Multiple food options including international cuisine and dietary-specific meals",
    lat: 37.3612,
    lng: -122.0650,
    imageUrl: "/images/dining-hall.jpg",
    category: "services",
    hours: "Mon-Sun: 7am-9pm",
    phone: "(555) 123-4571",
    amenities: ["International Cuisine", "Vegetarian Options", "Halal Options"],
    type: "hall",
    images: ["/images/dining-1.jpg", "/images/dining-2.jpg"],
    lottieAnimation: null
  },
  {
    id: 6,
    name: "Lecture Hall A",
    description: "Modern lecture hall with 300 seats, AV equipment, and recording capabilities",
    lat: 37.3621,
    lng: -122.0675,
    imageUrl: "/images/lecture-hall.jpg",
    category: "academic",
    hours: "Mon-Fri: 8am-10pm",
    phone: "(555) 123-4572",
    amenities: ["AV Equipment", "Recording", "300 Seats"],
    type: "hall",
    images: ["/images/lecture-1.jpg"],
    lottieAnimation: null
  },
  {
    id: 7,
    name: "Main Gate",
    description: "Main entrance to campus with security checkpoint and visitor center",
    lat: 37.3570,
    lng: -122.0690,
    imageUrl: "/images/main-gate.jpg",
    category: "services",
    hours: "24/7",
    phone: "(555) 123-4573",
    amenities: ["Security", "Visitor Center", "Parking"],
    type: "gate",
    images: ["/images/gate-main.jpg"],
    lottieAnimation: null
  },
  {
    id: 8,
    name: "South Gate",
    description: "Secondary entrance with student access and parking",
    lat: 37.3560,
    lng: -122.0630,
    imageUrl: "/images/south-gate.jpg",
    category: "services",
    hours: "6am-11pm",
    phone: "(555) 123-4574",
    amenities: ["Student Access", "Parking"],
    type: "gate",
    images: ["/images/gate-south.jpg"],
    lottieAnimation: null
  },
  {
    id: 9,
    name: "Campus Center",
    description: "Central hub for student activities, information desk, and gathering spaces",
    lat: 37.3605,
    lng: -122.0655,
    imageUrl: "/images/campus-center.jpg",
    category: "services",
    hours: "Mon-Sun: 8am-10pm",
    phone: "(555) 123-4575",
    amenities: ["Information Desk", "Student Lounge", "Event Space"],
    type: "location",
    images: ["/images/center-1.jpg", "/images/center-2.jpg", "/images/center-3.jpg"],
    lottieAnimation: null // Will be imported separately
  },
  {
    id: 10,
    name: "Fitness Center",
    description: "Full gym, indoor track, swimming pool, and fitness classes",
    lat: 37.3585,
    lng: -122.0665,
    imageUrl: "/images/fitness.jpg",
    category: "services",
    hours: "Mon-Fri: 5am-11pm, Sat-Sun: 7am-9pm",
    phone: "(555) 123-4576",
    amenities: ["Gym", "Pool", "Fitness Classes", "Track"],
    type: "location",
    images: ["/images/fitness-1.jpg", "/images/fitness-2.jpg"],
    lottieAnimation: null
  }
];

// Roads data - completely new data for the admin map
export const INITIAL_ROADS = [
  { 
    id: 'road-1', 
    name: 'Main Campus Drive', 
    coordinates: [
      { lat: 37.3570, lng: -122.0690 }, // Main Gate
      { lat: 37.3580, lng: -122.0675 },
      { lat: 37.3595, lng: -122.0665 }, // Science Complex
      { lat: 37.3605, lng: -122.0655 }, // Campus Center
      { lat: 37.3620, lng: -122.0645 },
      { lat: 37.3632, lng: -122.0635 }  // Engineering Building
    ],
    color: '#FF6B6B',
    type: 'main',
    width: 4,
    description: 'Main road connecting all major campus buildings'
  },
  { 
    id: 'road-2', 
    name: 'Academic Way', 
    coordinates: [
      { lat: 37.3595, lng: -122.0665 }, // Science Complex
      { lat: 37.3605, lng: -122.0675 }, // Library
      { lat: 37.3621, lng: -122.0675 }  // Lecture Hall A
    ],
    color: '#4ECDC4',
    type: 'secondary',
    width: 3,
    description: 'Road through academic buildings'
  },
  { 
    id: 'road-3', 
    name: 'Student Boulevard', 
    coordinates: [
      { lat: 37.3570, lng: -122.0690 }, // Main Gate
      { lat: 37.3585, lng: -122.0665 }, // Fitness Center
      { lat: 37.3599, lng: -122.0653 }, // Student Union
      { lat: 37.3612, lng: -122.0650 }  // Dining Hall
    ],
    color: '#FFD93D',
    type: 'secondary',
    width: 3,
    description: 'Student activity and services route'
  },
  { 
    id: 'road-4', 
    name: 'Engineering Avenue', 
    coordinates: [
      { lat: 37.3621, lng: -122.0675 }, // Lecture Hall A
      { lat: 37.3632, lng: -122.0665 }, // Engineering Building
      { lat: 37.3640, lng: -122.0650 }
    ],
    color: '#6C5CE7',
    type: 'secondary',
    width: 3,
    description: 'Engineering and technology route'
  },
  { 
    id: 'road-5', 
    name: 'South Access Road', 
    coordinates: [
      { lat: 37.3560, lng: -122.0630 }, // South Gate
      { lat: 37.3575, lng: -122.0640 },
      { lat: 37.3595, lng: -122.0645 }, // Science Complex
      { lat: 37.3605, lng: -122.0655 }  // Campus Center
    ],
    color: '#A8E6CF',
    type: 'service',
    width: 2,
    description: 'Service and delivery route'
  },
  { 
    id: 'road-6', 
    name: 'Campus Ring Road', 
    coordinates: [
      { lat: 37.3570, lng: -122.0690 },
      { lat: 37.3565, lng: -122.0675 },
      { lat: 37.3560, lng: -122.0630 },
      { lat: 37.3570, lng: -122.0610 },
      { lat: 37.3590, lng: -122.0605 },
      { lat: 37.3610, lng: -122.0615 },
      { lat: 37.3640, lng: -122.0630 },
      { lat: 37.3632, lng: -122.0665 },
      { lat: 37.3605, lng: -122.0675 },
      { lat: 37.3570, lng: -122.0690 }
    ],
    color: '#FF8A5C',
    type: 'main',
    width: 4,
    description: 'Full campus ring road with all access points'
  }
];

// Additional metadata for filters
export const FILTER_CATEGORIES = {
  roads: [
    { id: 'all-roads', label: 'All Roads', type: 'select-all' },
    { id: 'main', label: 'Main Roads', type: 'category' },
    { id: 'secondary', label: 'Secondary Roads', type: 'category' },
    { id: 'service', label: 'Service Roads', type: 'category' }
  ],
  buildings: [
    { id: 'all-buildings', label: 'All Buildings', type: 'select-all' },
    { id: 'academic', label: 'Academic', type: 'category' },
    { id: 'services', label: 'Services', type: 'category' }
  ],
  types: [
    { id: 'building', label: 'Buildings' },
    { id: 'hall', label: 'Halls' },
    { id: 'college', label: 'Colleges' },
    { id: 'gate', label: 'Gates' },
    { id: 'location', label: 'Locations' }
  ]
};

// Helper functions
export const getBuildingsByType = (type) => {
  return INITIAL_BUILDINGS.filter(building => building.type === type);
};

export const getBuildingsByCategory = (category) => {
  return INITIAL_BUILDINGS.filter(building => building.category === category);
};

export const getBuildingById = (id) => {
  return INITIAL_BUILDINGS.find(building => building.id === id);
};