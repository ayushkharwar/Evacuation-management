const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ========== IN-MEMORY DATA STORE ==========
const dataStore = {
  hazards: [],
  routes: [],
  safeZones: [],
  notifications: [],
  blockedRoads: [],
  crowdDensity: [],
  stats: {
    totalEvacuees: 4821,
    avgEvacuationTime: 14.2,
    lastUpdated: new Date()
  }
};

// ========== SEED DATA ==========
function seedData() {
  // Initial Safe Zones
  dataStore.safeZones = [
    {
      id: 'sz-1',
      name: 'Central High School',
      location: '123 Education Blvd',
      lat: 40.725,
      lng: -74.000,
      capacity: 500,
      occupied: 340,
      status: 'open',
      distance: 1.2
    },
    {
      id: 'sz-2',
      name: 'City Park Plaza',
      location: '555 Park Avenue',
      lat: 40.710,
      lng: -73.985,
      capacity: 500,
      occupied: 125,
      status: 'open',
      distance: 3.5
    },
    {
      id: 'sz-3',
      name: 'Convention Center',
      location: '789 Convention Way',
      lat: 40.702,
      lng: -73.995,
      capacity: 2500,
      occupied: 300,
      status: 'open',
      distance: 2.8
    },
    {
      id: 'sz-4',
      name: 'Metro Central Station',
      location: '100 Station Plaza',
      lat: 40.715,
      lng: -74.005,
      capacity: 800,
      occupied: 760,
      status: 'open',
      distance: 0.8
    }
  ];

  // Predefined route templates (6 routes)
  dataStore.routeTemplates = [
    {
      id: 'rt-1',
      name: 'Route A - Main St',
      waypoints: [
        { lat: 40.7128, lng: -74.0060 },
        { lat: 40.715, lng: -74.004 },
        { lat: 40.720, lng: -74.002 },
        { lat: 40.725, lng: -74.000 }
      ],
      baseTime: 12,
      distance: 2.4,
      destination: 'Central High School'
    },
    {
      id: 'rt-2',
      name: 'Route B - 12th Ave',
      waypoints: [
        { lat: 40.7128, lng: -74.0060 },
        { lat: 40.710, lng: -74.008 },
        { lat: 40.705, lng: -74.010 },
        { lat: 40.710, lng: -73.985 }
      ],
      baseTime: 18,
      distance: 3.1,
      destination: 'Convention Center'
    },
    {
      id: 'rt-3',
      name: 'Route C - Industrial Path',
      waypoints: [
        { lat: 40.7128, lng: -74.0060 },
        { lat: 40.708, lng: -74.002 },
        { lat: 40.700, lng: -73.990 },
        { lat: 40.702, lng: -73.995 }
      ],
      baseTime: 25,
      distance: 4.0,
      destination: 'City Park Plaza'
    },
    {
      id: 'rt-4',
      name: 'Route D - River Walk',
      waypoints: [
        { lat: 40.7128, lng: -74.0060 },
        { lat: 40.718, lng: -74.008 },
        { lat: 40.725, lng: -74.015 },
        { lat: 40.730, lng: -74.020 }
      ],
      baseTime: 15,
      distance: 2.8,
      destination: 'Riverside Shelter'
    },
    {
      id: 'rt-5',
      name: 'Route E - Central Hub',
      waypoints: [
        { lat: 40.7128, lng: -74.0060 },
        { lat: 40.714, lng: -74.004 },
        { lat: 40.716, lng: -74.001 },
        { lat: 40.715, lng: -74.005 }
      ],
      baseTime: 8,
      distance: 1.5,
      destination: 'Metro Central Station'
    },
    {
      id: 'rt-6',
      name: 'Route F - Emergency Direct',
      waypoints: [
        { lat: 40.7128, lng: -74.0060 },
        { lat: 40.720, lng: -73.995 },
        { lat: 40.730, lng: -73.985 },
        { lat: 40.735, lng: -73.980 }
      ],
      baseTime: 22,
      distance: 5.2,
      destination: 'Emergency Assembly Point'
    }
  ];

  // Initial routes (calculated)
  dataStore.routes = calculateAllRoutes();

  // Initial crowd density points
  dataStore.crowdDensity = generateCrowdDensity();

  // Initial notification
  dataStore.notifications.push({
    id: uuidv4(),
    type: 'info',
    message: 'System initialized. All monitoring systems active.',
    timestamp: new Date(),
    read: false
  });
}

// ========== UTILITY FUNCTIONS ==========
function calculateDistance(lat1, lng1, lat2, lng2) {
  // Simple Euclidean distance approximation for demo
  const latDiff = lat1 - lat2;
  const lngDiff = lng1 - lng2;
  return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
}

function isNearHazard(lat, lng, threshold = 0.005) {
  return dataStore.hazards.some(h => {
    const dist = calculateDistance(lat, lng, h.lat, h.lng);
    return dist < threshold;
  });
}

function isBlockedByHazard(lat, lng) {
  return dataStore.hazards.some(h => {
    const dist = calculateDistance(lat, lng, h.lat, h.lng);
    return dist < 0.002; // ~200m = blocked
  });
}

function generateCrowdDensity() {
  // Generate mock crowd density data that shifts slightly
  const basePoints = [
    { lat: 40.7128, lng: -74.006, intensity: 0.8 },
    { lat: 40.715, lng: -74.004, intensity: 0.6 },
    { lat: 40.718, lng: -74.008, intensity: 0.4 },
    { lat: 40.720, lng: -74.002, intensity: 0.7 },
    { lat: 40.710, lng: -73.995, intensity: 0.5 },
    { lat: 40.705, lng: -74.010, intensity: 0.3 },
    { lat: 40.725, lng: -74.000, intensity: 0.9 },
    { lat: 40.702, lng: -73.995, intensity: 0.2 }
  ];
  
  return basePoints.map(p => ({
    lat: p.lat + (Math.random() - 0.5) * 0.002,
    lng: p.lng + (Math.random() - 0.5) * 0.002,
    intensity: Math.max(0.1, Math.min(1, p.intensity + (Math.random() - 0.5) * 0.2))
  }));
}

function calculateRouteScore(route) {
  let safetyScore = 100;
  let blocked = false;
  
  // Check each waypoint against hazards
  route.waypoints.forEach(wp => {
    if (isBlockedByHazard(wp.lat, wp.lng)) {
      blocked = true;
    }
    if (isNearHazard(wp.lat, wp.lng)) {
      safetyScore -= 15;
    }
    if (isNearHazard(wp.lat, wp.lng, 0.003)) {
      safetyScore -= 25;
    }
  });
  
  // Congestion simulation (random but slowly changing)
  const congestion = 0.3 + Math.random() * 0.5;
  
  // Calculate final score: safety * 0.6 + (1/distance) * 0.2 + (1/congestion) * 0.2
  const distanceScore = 1 / route.distance;
  const congestionScore = 1 / congestion;
  const finalScore = (safetyScore * 0.6) + (distanceScore * 20 * 0.2) + (congestionScore * 0.2);
  
  return {
    safetyScore: Math.max(0, safetyScore),
    finalScore: blocked ? 0 : finalScore,
    blocked,
    congestion: congestion < 0.4 ? 'low' : congestion < 0.7 ? 'medium' : 'high'
  };
}

function calculateAllRoutes() {
  return dataStore.routeTemplates.map(template => {
    const score = calculateRouteScore(template);
    return {
      id: template.id,
      name: template.name,
      waypoints: template.waypoints,
      destination: template.destination,
      time: template.baseTime,
      distance: template.distance,
      safetyScore: score.safetyScore,
      finalScore: score.finalScore,
      blocked: score.blocked,
      congestion: score.congestion,
      recommended: !score.blocked && score.safetyScore > 70
    };
  }).sort((a, b) => b.finalScore - a.finalScore);
}

function markRoadsBlocked() {
  // Simple proximity check - if road is near hazard, mark as blocked
  dataStore.blockedRoads = [];
  
  // Define key road segments
  const roadSegments = [
    { id: 'road-1', name: 'Main St', start: { lat: 40.712, lng: -74.008 }, end: { lat: 40.720, lng: -74.002 } },
    { id: 'road-2', name: '12th Ave', start: { lat: 40.710, lng: -74.008 }, end: { lat: 40.705, lng: -74.010 } },
    { id: 'road-3', name: 'Industrial Blvd', start: { lat: 40.708, lng: -74.002 }, end: { lat: 40.700, lng: -73.990 } },
    { id: 'road-4', name: 'River Walk', start: { lat: 40.718, lng: -74.008 }, end: { lat: 40.725, lng: -74.015 } },
    { id: 'road-5', name: 'Central Hub', start: { lat: 40.714, lng: -74.004 }, end: { lat: 40.716, lng: -74.001 } },
    { id: 'road-6', name: 'Oak Ave', start: { lat: 40.711, lng: -74.007 }, end: { lat: 40.713, lng: -74.005 } }
  ];
  
  roadSegments.forEach(road => {
    const midLat = (road.start.lat + road.end.lat) / 2;
    const midLng = (road.start.lng + road.end.lng) / 2;
    
    dataStore.hazards.forEach(hazard => {
      const dist = calculateDistance(midLat, midLng, hazard.lat, hazard.lng);
      if (dist < 0.003) {
        dataStore.blockedRoads.push({
          id: road.id,
          name: road.name,
          reason: `Near ${hazard.type}: ${hazard.location}`,
          hazardId: hazard.id
        });
      }
    });
  });
}

function updateStats() {
  const openZones = dataStore.safeZones.filter(sz => sz.status === 'open');
  const fullZones = dataStore.safeZones.filter(sz => sz.occupied >= sz.capacity * 0.95);
  
  dataStore.stats = {
    totalEvacuees: dataStore.safeZones.reduce((sum, sz) => sum + sz.occupied, 0),
    blockedRoadsCount: dataStore.blockedRoads.length,
    fullZonesCount: fullZones.length,
    activeHazardsCount: dataStore.hazards.length,
    avgEvacuationTime: 14.2 + (Math.random() - 0.5) * 2,
    lastUpdated: new Date()
  };
}

// ========== API ENDPOINTS ==========

// GET /api/hazards - return all active hazards
app.get('/api/hazards', (req, res) => {
  res.json(dataStore.hazards);
});

// POST /api/hazards - add a new hazard
app.post('/api/hazards', (req, res) => {
  const { type, location, lat, lng, severity, description } = req.body;
  
  const newHazard = {
    id: uuidv4(),
    type: type || 'fire',
    location: location || 'Unknown Location',
    lat: parseFloat(lat) || 40.7128,
    lng: parseFloat(lng) || -74.006,
    severity: severity || 'high',
    description: description || '',
    status: 'active',
    createdAt: new Date()
  };
  
  dataStore.hazards.push(newHazard);
  
  // Auto: Mark nearby roads as blocked
  markRoadsBlocked();
  
  // Auto: Recalculate routes
  dataStore.routes = calculateAllRoutes();
  
  // Auto: Generate notification
  const notification = {
    id: uuidv4(),
    type: 'hazard',
    message: `New hazard detected: ${newHazard.type} at ${newHazard.location}. Severity: ${newHazard.severity}`,
    timestamp: new Date(),
    hazardId: newHazard.id,
    read: false
  };
  dataStore.notifications.unshift(notification);
  
  // Keep only last 50 notifications
  if (dataStore.notifications.length > 50) {
    dataStore.notifications = dataStore.notifications.slice(0, 50);
  }
  
  updateStats();
  
  res.status(201).json({ hazard: newHazard, notification });
});

// DELETE /api/hazards/:id - resolve/remove a hazard
app.delete('/api/hazards/:id', (req, res) => {
  const { id } = req.params;
  const hazardIndex = dataStore.hazards.findIndex(h => h.id === id);
  
  if (hazardIndex === -1) {
    return res.status(404).json({ error: 'Hazard not found' });
  }
  
  const resolvedHazard = dataStore.hazards.splice(hazardIndex, 1)[0];
  
  // Unblock associated roads
  dataStore.blockedRoads = dataStore.blockedRoads.filter(br => br.hazardId !== id);
  
  // Recalculate routes
  dataStore.routes = calculateAllRoutes();
  
  // Generate notification
  const notification = {
    id: uuidv4(),
    type: 'success',
    message: `Hazard resolved: ${resolvedHazard.type} at ${resolvedHazard.location}. Roads reopening.`,
    timestamp: new Date(),
    read: false
  };
  dataStore.notifications.unshift(notification);
  
  updateStats();
  
  res.json({ resolved: resolvedHazard, notification });
});

// GET /api/routes - return all recommended evacuation routes
app.get('/api/routes', (req, res) => {
  res.json(dataStore.routes);
});

// POST /api/routes/calculate - trigger route recalculation
app.post('/api/routes/calculate', (req, res) => {
  dataStore.routes = calculateAllRoutes();
  
  // Generate notifications for blocked routes
  dataStore.routes.forEach(route => {
    if (route.blocked) {
      const existingNotif = dataStore.notifications.find(
        n => n.message.includes(route.name) && n.message.includes('blocked')
      );
      if (!existingNotif) {
        dataStore.notifications.unshift({
          id: uuidv4(),
          type: 'warning',
          message: `${route.name} is blocked. Rerouting via ${dataStore.routes.find(r => !r.blocked)?.name || 'alternative'}`,
          timestamp: new Date(),
          read: false
        });
      }
    }
  });
  
  res.json(dataStore.routes);
});

// GET /api/safezones - return safe zones with current capacity
app.get('/api/safezones', (req, res) => {
  res.json(dataStore.safeZones);
});

// PATCH /api/safezones/:id - update occupancy count
app.patch('/api/safezones/:id', (req, res) => {
  const { id } = req.params;
  const { occupancyChange } = req.body;
  
  const zone = dataStore.safeZones.find(sz => sz.id === id);
  if (!zone) {
    return res.status(404).json({ error: 'Safe zone not found' });
  }
  
  zone.occupied = Math.max(0, Math.min(zone.capacity, zone.occupied + (occupancyChange || 0)));
  
  // Check if near capacity
  if (zone.occupied >= zone.capacity * 0.95) {
    const notification = {
      id: uuidv4(),
      type: 'warning',
      message: `${zone.name} is at ${Math.round((zone.occupied / zone.capacity) * 100)}% capacity. Consider alternate locations.`,
      timestamp: new Date(),
      read: false
    };
    dataStore.notifications.unshift(notification);
  }
  
  updateStats();
  res.json(zone);
});

// GET /api/notifications - return recent notifications (last 50)
app.get('/api/notifications', (req, res) => {
  res.json(dataStore.notifications.slice(0, 50));
});

// POST /api/notifications - create a manual notification/broadcast
app.post('/api/notifications', (req, res) => {
  const { type, message } = req.body;
  
  const notification = {
    id: uuidv4(),
    type: type || 'broadcast',
    message: message || 'Emergency broadcast',
    timestamp: new Date(),
    read: false
  };
  
  dataStore.notifications.unshift(notification);
  
  if (dataStore.notifications.length > 50) {
    dataStore.notifications = dataStore.notifications.slice(0, 50);
  }
  
  res.status(201).json(notification);
});

// GET /api/stats - return live stats
app.get('/api/stats', (req, res) => {
  updateStats();
  res.json(dataStore.stats);
});

// GET /api/crowddensity - return crowd density data
app.get('/api/crowddensity', (req, res) => {
  // Regenerate with slight shifts to simulate movement
  dataStore.crowdDensity = generateCrowdDensity();
  res.json(dataStore.crowdDensity);
});

// POST /api/simulate-emergency - simulate full emergency scenario
app.post('/api/simulate-emergency', (req, res) => {
  const emergencyHazards = [
    { type: 'fire', location: 'Industrial District - Sector 4', lat: 40.718, lng: -74.012, severity: 'critical', description: 'Chemical plant fire, toxic fumes reported' },
    { type: 'flood', location: '5th & Main St', lat: 40.705, lng: -74.002, severity: 'high', description: 'Flash flooding, roads underwater' },
    { type: 'structural', location: 'Downtown Bridge', lat: 40.710, lng: -74.008, severity: 'high', description: 'Bridge instability detected' }
  ];
  
  const createdHazards = [];
  const createdNotifications = [];
  
  emergencyHazards.forEach((h, idx) => {
    setTimeout(() => {
      const newHazard = {
        id: uuidv4(),
        ...h,
        status: 'active',
        createdAt: new Date()
      };
      dataStore.hazards.push(newHazard);
      createdHazards.push(newHazard);
      
      markRoadsBlocked();
      dataStore.routes = calculateAllRoutes();
      
      const notification = {
        id: uuidv4(),
        type: 'emergency',
        message: `EMERGENCY: ${h.type.toUpperCase()} at ${h.location}. ${h.description}`,
        timestamp: new Date(),
        hazardId: newHazard.id,
        read: false
      };
      dataStore.notifications.unshift(notification);
      createdNotifications.push(notification);
    }, idx * 500); // Stagger creation by 500ms
  });
  
  // Update crowd density to show panic movement
  dataStore.crowdDensity = dataStore.crowdDensity.map(p => ({
    ...p,
    intensity: Math.min(1, p.intensity * 1.5)
  }));
  
  // Add emergency broadcast
  setTimeout(() => {
    dataStore.notifications.unshift({
      id: uuidv4(),
      type: 'broadcast',
      message: 'EMERGENCY ALERT: Multiple hazards detected. Evacuate immediately using recommended routes.',
      timestamp: new Date(),
      read: false
    });
  }, 1500);
  
  updateStats();
  
  res.json({
    message: 'Emergency simulation triggered',
    hazardsCreated: 3,
    routesRecalculated: true
  });
});

// ========== START SERVER ==========
seedData();
app.listen(PORT, () => {
  console.log(`🚨 Evacuation System API running on http://localhost:${PORT}`);
  console.log(`📡 Available endpoints:`);
  console.log(`   GET    /api/hazards`);
  console.log(`   POST   /api/hazards`);
  console.log(`   DELETE /api/hazards/:id`);
  console.log(`   GET    /api/routes`);
  console.log(`   POST   /api/routes/calculate`);
  console.log(`   GET    /api/safezones`);
  console.log(`   PATCH  /api/safezones/:id`);
  console.log(`   GET    /api/notifications`);
  console.log(`   POST   /api/notifications`);
  console.log(`   GET    /api/stats`);
  console.log(`   GET    /api/crowddensity`);
  console.log(`   POST   /api/simulate-emergency`);
});
