# 🐳 Docker Deployment

Local development and deployment using Docker Compose.

---

## Quick Start

```bash
# Clone and navigate
git clone https://github.com/bibtv/smart-building-app.git
cd smart-building-app

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

---

## Services

| Service | Port | Description |
|---------|------|-------------|
| Frontend | http://localhost:5173 | Vite dev server |
| Backend | http://localhost:3000 | Node.js API |
| PostgreSQL | localhost:5432 | Database |
| Node-RED | http://localhost:1880 | Flow automation |

---

## Docker Compose Files

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Core platform |
| `docs/docker-compose.lorawan.yml` | LoRaWAN stack (ChirpStack) |

---

## Core Platform

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: smartbuilding
      POSTGRES_DB: smartbuilding
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://postgres:smartbuilding@postgres:5432/smartbuilding
      - AUTH0_DOMAIN=${AUTH0_DOMAIN}
      - AUTH0_CLIENT_ID=${AUTH0_CLIENT_ID}
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    depends_on:
      - backend

  nodered:
    image: nodered/node-red
    ports:
      - "1880:1880"
    volumes:
      - nodered_data:/data

volumes:
  postgres_data:
  nodered_data:
```

---

## LoRaWAN Stack (Optional)

To run ChirpStack for LoRaWAN:

```bash
docker-compose -f docs/docker-compose.lorawan.yml up -d
```

This includes:
- PostgreSQL
- Redis
- MQTT (Mosquitto)
- ChirpStack Gateway Bridge
- ChirpStack Network Server
- ChirpStack Application Server

---

## Commands

```bash
# Start all
docker-compose up -d

# Stop all
docker-compose down

# Rebuild
docker-compose build

# View logs
docker-compose logs -f [service]

# Access container
docker-compose exec backend sh
```

---

## Environment Variables

Create `.env` file:

```bash
# .env
AUTH0_DOMAIN=your-domain.us.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
DATABASE_URL=postgres://postgres:password@localhost:5432/smartbuilding
```

---

## Hardware Requirements

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| RAM | 2 GB | 4 GB |
| CPU | 1 core | 2 cores |
| Disk | 10 GB | 20 GB |

---

*For production, use Railway or a managed VPS.*
