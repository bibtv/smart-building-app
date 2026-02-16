# 🚀 Deployment

Guides for deploying the Smart Building IoT Platform.

---

## 📁 Files

| File | Description |
|------|-------------|
| [railway.md](./railway.md) | Railway cloud deployment |
| [docker.md](./docker.md) | Local Docker deployment |

---

## 🌐 Live Services

| Service | URL | Status |
|---------|-----|--------|
| Smart Building App | https://smart-building-app-production.up.railway.app | ✅ |
| Node-RED | https://railway-nodered-production-1bec.up.railway.app | ✅ |
| PostgreSQL | Railway managed | ✅ |

---

## Quick Start - Railway

### 1. Connect GitHub Repo
```bash
railway link
# Select your project
```

### 2. Add PostgreSQL
```bash
railway add postgresql
```

### 3. Deploy
```bash
git push origin main
# Railway auto-deploys on push
```

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection | ✅ |
| `AUTH0_DOMAIN` | Auth0 tenant domain | ✅ |
| `AUTH0_CLIENT_ID` | Auth0 client ID | ✅ |
| `AUTH0_CLIENT_SECRET` | Auth0 client secret | ✅ |
| `PORT` | Server port (default: 3000) | |

---

*See [railway.md](./railway.md) for detailed Railway deployment guide.*
