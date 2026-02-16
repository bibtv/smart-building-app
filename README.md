# 🏢 Smart Building IoT Platform

A modern IoT platform for smart buildings with support for MQTT devices, LoRaWAN sensors, and ROS robots.

[![Deploy to Railway](https://railway.app/button.svg)](https://railway.app)

---

## 🚀 Quick Start

### Live Demo

| Service | URL |
|---------|-----|
| **Web App** | https://smart-building-app-production.up.railway.app |
| **Node-RED** | https://railway-nodered-production-1bec.up.railway.app |

**Node-RED Login:** admin / password

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Database | PostgreSQL + TimescaleDB |
| Authentication | Auth0 |
| Automation | Node-RED |
| Communication | MQTT |
| Hosting | Railway |

---

## 📁 Project Structure

```
smart-building-app/
├── frontend/           # React application
├── backend/           # Node.js API
├── docs/              # Documentation
│   ├── architecture/  # Architecture diagrams
│   ├── deployment/   # Deployment guides
│   ├── integrations/ # Device integrations
│   └── api/          # API reference
├── docker-compose.yml
└── PLANNING.md       # Project roadmap
```

---

## 📖 Documentation

### Getting Started
- [Quick Start Guide](./docs/getting-started.md)
- [Architecture](./docs/architecture/README.md)

### Deployment
- [Railway Deployment](./docs/deployment/railway.md)
- [Docker Deployment](./docs/deployment/docker.md)

### Integrations
- [MQTT Setup](./docs/integrations/mqtt.md)
- [LoRaWAN/ChirpStack](./docs/integrations/lorawan.md)
- [ROS Robots](./docs/integrations/ros.md)
- [Node-RED Flows](./docs/integrations/nodered.md)

### API
- [API Reference](./docs/api/README.md)
- [Postman Collection](./docs/api/postman.md)

---

## 🎯 Features

| Feature | Status |
|---------|--------|
| User Authentication (Auth0) | ✅ |
| Device Management | ✅ |
| Real-time Data | ✅ |
| PostgreSQL Database | ✅ |
| Node-RED Automation | ✅ |
| MQTT Integration | 🔄 |
| LoRaWAN Support | 📋 |
| ROS Robot Control | 📋 |

---

## 🔌 Supported Devices

### Communication Protocols
- **MQTT** - Direct device communication
- **LoRaWAN** - Long-range, low-power (via ChirpStack)
- **REST API** - HTTP-based devices
- **ROS** - Robot Operating System

### Device Types
- Temperature & humidity sensors
- Motion detectors
- Door/window sensors
- HVAC controls
- IP cameras
- ROS robots

---

## 📡 Integration

### MQTT Topics
```
building/{location}/{device_type}/reading   # Sensor data
building/{location}/{device_type}/status    # Device status
building/{location}/{device_type}/command  # Commands
```

### API Endpoints
```
GET    /api/devices      # List devices
POST   /api/devices      # Create device
GET    /api/readings     # Get readings
POST   /api/readings     # Add reading
GET    /api/alerts       # Get alerts
```

---

## 🐳 Local Development

```bash
# Clone repository
git clone https://github.com/bibtv/smart-building-app.git

# Start with Docker
docker-compose up -d

# Or run manually
cd frontend && npm install && npm run dev
cd backend && npm install && npm run dev
```

---

## 🔧 Configuration

### Environment Variables

**Backend:**
- `DATABASE_URL` - PostgreSQL connection
- `AUTH0_DOMAIN` - Auth0 domain
- `AUTH0_CLIENT_ID` - Auth0 client ID
- `AUTH0_CLIENT_SECRET` - Auth0 client secret

**Frontend:**
- `VITE_API_URL` - Backend API URL
- `VITE_AUTH0_DOMAIN` - Auth0 domain
- `VITE_AUTH0_CLIENT_ID` - Auth0 client ID

---

## 📅 Project Roadmap

See [PLANNING.md](./PLANNING.md) for detailed roadmap.

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 1 | Core Platform | ✅ Done |
| Phase 2 | IoT Expansion | 🔄 In Progress |
| Phase 3 | ROS Integration | 📋 Planned |
| Phase 4 | LoRaWAN Integration | 📋 Planned |
| Phase 5 | Advanced Features | 📋 Future |

---

## 👤 Author

- **Alan Yeung** - [GitHub](https://github.com/bibtv)

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.
