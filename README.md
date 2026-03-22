# EvacRoute — Smart Evacuation System

A full-stack prototype for an **Evacuation Route Planning and Crowd Movement System**. This system demonstrates the complete flow: Hazard Detection → Route Generation → Evacuation Guidance → Notifications.

## 🚨 Features

- **Real-time Hazard Monitoring** — Track active hazards on an interactive map
- **Dynamic Route Calculation** — Automatically recalculates safe routes when hazards are detected
- **Safe Zone Management** — Monitor capacity and occupancy of evacuation shelters
- **Live Notifications** — Stream alerts for hazards, route changes, and broadcasts
- **Crowd Density Visualization** — See population movement on the map
- **Emergency Simulation** — One-click demo of full emergency scenario

## 📁 Project Structure

```
evacuation-system/
├── package.json           # Root package with dependencies
├── server/
│   └── index.js          # Express.js backend with in-memory data store
├── client/
│   └── index.html        # Frontend dashboard with Leaflet map
└── README.md             # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm
- Python 3 (for serving frontend, optional)

### Installation

1. Navigate to the project directory:
   ```bash
   cd evacuation-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start both server and client:
   ```bash
   npm start
   ```

   Or run them separately:

   **Terminal 1 (Backend):**
   ```bash
   npm run server
   ```

   **Terminal 2 (Frontend):**
   ```bash
   cd client
   python -m http.server 3001
   ```

4. Open your browser:
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:3000/api

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/hazards` | Get all active hazards |
| POST | `/api/hazards` | Add a new hazard (auto-triggers route recalculation & notification) |
| DELETE | `/api/hazards/:id` | Resolve a hazard (auto-updates routes & sends notification) |
| GET | `/api/routes` | Get all evacuation routes with safety scores |
| POST | `/api/routes/calculate` | Trigger route recalculation |
| GET | `/api/safezones` | Get all safe zones with capacity info |
| PATCH | `/api/safezones/:id` | Update safe zone occupancy |
| GET | `/api/notifications` | Get recent notifications (last 50) |
| POST | `/api/notifications` | Create a manual broadcast |
| GET | `/api/stats` | Get live statistics |
| GET | `/api/crowddensity` | Get crowd density data points |
| POST | `/api/simulate-emergency` | Trigger emergency simulation |

## 🎮 Demo Flow

### Manual Demo

1. **Initial State**: System starts in monitoring mode with no active hazards
2. **Report Hazard**: Click "REPORT HAZARD" button and fill in the form
3. **Observe**: 
   - Hazard appears on map with danger zone
   - Nearby roads automatically get marked as blocked
   - Routes recalculate with safety scores
   - Notification appears in activity log
4. **Navigate**: Click "Navigate" on a safe route to zoom to it
5. **Manage Zones**: Use +/- buttons to simulate people arriving at safe zones
6. **Resolve**: Click "Resolve" on hazard to clear it and reopen roads

### One-Click Emergency Demo

Click the **"TRIGGER EMERGENCY"** button to simulate a full emergency:

1. 3 hazards appear simultaneously (Fire, Flood, Structural)
2. Roads near hazards get blocked
3. Routes automatically recalculate
4. Emergency notifications stream in
5. Crowd density increases
6. System shows full alert state

## 🔧 Route Calculation Logic

The system uses a simple but effective scoring algorithm:

```
Final Score = (Safety Score × 0.6) + (Distance Score × 0.2) + (Congestion Score × 0.2)
```

- **Safety Score**: Starts at 100, penalized for proximity to hazards
- **Distance Score**: Shorter routes score higher
- **Congestion Score**: Simulated traffic conditions

Routes within 0.002° (~200m) of a hazard are marked **BLOCKED**.
Routes within 0.005° (~500m) receive safety penalties.

## 🎨 Frontend Features

- **Interactive Leaflet Map** with dark theme
- **Real-time Updates** via 5-second polling
- **Responsive Design** with Tailwind CSS
- **Animated Markers** for hazards and safe zones
- **Live Statistics Panel** 
- **Activity Log** with timestamped notifications
- **Emergency Ticker** at bottom

## 🗺️ Map Layers

- **Hazard Layer**: Red markers with danger zones
- **Route Layer**: Green (recommended) / Amber (alternate) polylines
- **Safe Zone Layer**: Color-coded by capacity (green/amber/red)
- **Crowd Density Layer**: Heat dots showing population concentration

## ⚠️ Important Notes

- **No Database**: All data is in-memory and resets on server restart
- **No Authentication**: This is a prototype, no login required
- **No External APIs**: Routes are predefined, no Google Maps or Mapbox routing
- **CORS Enabled**: API accepts requests from any origin

## 📝 Data Seeding

On server startup, the system seeds:

- 4 Safe Zones (schools, convention centers, etc.)
- 6 Predefined Route Templates
- 8 Crowd Density Points
- Initial system notification

## 🛠️ Technologies Used

**Backend:**
- Node.js + Express
- CORS middleware
- UUID for IDs

**Frontend:**
- Tailwind CSS
- Leaflet.js for mapping
- Native Fetch API

## 📸 Screenshots

When running, you'll see:
- Dark-themed dashboard with three panels
- Interactive map in the center
- Hazard list on the left
- Routes and stats on the right
- Emergency ticker at the bottom

---

**Built for demonstration purposes. Not production-ready.**