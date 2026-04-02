# SmartGuard – Smart Road Safety System
### Convergence 2026 | Problem ID: HT202603

---

## 🏆 Project Overview
**SmartGuard** is a hackathon presentation website for a Smart Road Safety System designed for Convergence 2026. The website is a single-page interactive prototype showcasing a real-time IoT-based vehicle detection and warning system for blind curves and rural ghat roads.

---

## ✅ Implemented Features

### Website Sections
1. **Hero Section** – Animated title, live stats counter, call-to-action buttons, road scene animation with sensor nodes and vehicles
2. **Problem Section** – 6-card problem breakdown, animated statistics bars for accident causes
3. **Solution Section** – System overview diagram, feature list, full tech stack grid
4. **Architecture Section** – 3-layer architecture diagram (Edge → Fog → Alert/Cloud), animated detection → alert flow steps
5. **Features Section** – 8 feature cards with metrics and animated bars
6. **Live Demo Simulation** – Canvas-based interactive simulation with vehicle animation, sensors, LED boards, and data packet visualization
7. **Impact & Analytics** – Animated counters, 3 Chart.js charts (bar, radar, doughnut), deployment hotspot map
8. **Development Roadmap** – Timeline with phase status indicators
9. **Team Section** – Dynamically rendered team cards
10. **Footer** – Tags and branding

### Interactive Features
- **Particle background** with connecting lines
- **Scroll-triggered animations** (reveal on scroll)
- **Animated stat counters** (counting up on intersection)
- **Canvas simulation** with 4 scenarios (Normal, Collision, Fog, Heavy Truck)
- **Simulation controls**: speed slider, detection range slider, fog/night toggles
- **Real-time system status panel** (Sensor A/B, Alert boards, Response time, Event counter)
- **Event log** with timestamped entries
- **Chart.js charts**: Accident reduction bar, Weather performance radar, Cost comparison doughnut
- **Interactive map dots** with tooltips
- **Active nav highlighting** based on scroll position
- **Hamburger menu** for mobile

---

## 🗂️ File Structure

```
index.html          Main single-page application
css/style.css       All styling, animations, responsive design
js/main.js          All JavaScript (particles, charts, simulation, interactions)
README.md           This documentation
```

---

## 🚀 Entry Points
- **Main Page**: `index.html`
- **Sections via anchor**: `#problem`, `#solution`, `#architecture`, `#features`, `#demo`, `#impact`, `#roadmap`, `#team`

---

## 🛠️ Technology Stack
- **HTML5 / CSS3 / Vanilla JS** – No framework dependencies
- **Chart.js** (CDN) – Data visualizations
- **Font Awesome 6.4.0** (CDN) – Icons
- **Google Fonts** (Inter + Orbitron) – Typography
- **Canvas API** – Particle background + simulation
- **IntersectionObserver API** – Scroll animations

---

## 📋 Features Not Yet Implemented
- Real Firebase backend integration (static demo only)
- Actual IoT sensor data feed
- Mobile app section / PWA demo

## 🔧 Recommended Next Steps
1. Add real team member names and photos
2. Integrate actual hardware demo video
3. Add Firebase live data feed for real event counts
4. Add a downloadable project report PDF link
