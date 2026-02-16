# 🚀 Getting Started

Quick start guide for the Smart Building IoT Platform.

---

## Prerequisites

- Node.js 18+
- Docker & Docker Compose (for local development)
- PostgreSQL (local or Railway)
- Auth0 account

---

## Quick Start - Live

### Access Running Services

| Service | URL | Credentials |
|---------|-----|-------------|
| Web App | https://smart-building-app-production.up.railway.app | Auth0 login |
| Node-RED | https://railway-nodered-production-1bec.up.railway.app | admin / password |

---

## Quick Start - Local

### Option 1: Docker Compose

```bash
# Clone repository
git clone https://github.com/bibtv/smart-building-app.git
cd smart-building-app

# Start all services
docker-compose up -d

# Access services
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
# Node-RED: http://localhost:1880
# PostgreSQL: localhost:5432
```

### Option 2: Manual Setup

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your DATABASE_URL
npm install
npm run dev

# Frontend (new terminal)
cd frontend
cp .env.example .env
# Edit .env with Auth0 credentials
npm install
npm run dev
```

---

## First Steps

### 1. Add a Device

Use the web UI or API:

```bash
curl -X POST https://smart-building-app-production.up.railway.app/api/devices \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name": "Living Room", "type": "temperature", "location": "home"}'
```

### 2. Add Sensor Reading

```bash
curl -X POST https://smart-building-app-production.up.railway.app/api/readings \
  -H "Content-Type: application/json" \
  -d '{"deviceId": "YOUR_DEVICE_ID", "sensorType": "temperature", "value": 22.5, "unit": "celsius"}'
```

### 3. Connect Node-RED

1. Open Node-RED
2. Add MQTT broker config
3. Create flows to subscribe to device topics

---

## Next Steps

- [Set up MQTT devices](./integrations/mqtt.md)
- [Add LoRaWAN sensors](./integrations/lorawan.md)
- [Connect ROS robots](./integrations/ros.md)
- [Configure Node-RED flows](./integrations/nodered.md)

---

## Troubleshooting

### Database Connection Error

Ensure `DATABASE_URL` is set correctly:
```
postgresql://user:password@host:port/database
```

### Auth0 Login Fails

Check environment variables:
- `AUTH0_DOMAIN`
- `AUTH0_CLIENT_ID`
- `AUTH0_CLIENT_SECRET`

### Node-RED Not Accessible

Check Railway logs:
```bash
railway logs --service railway-nodered
```
