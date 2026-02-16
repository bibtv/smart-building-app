# 🌐 Railway Deployment

Step-by-step guide for deploying to Railway.

---

## Prerequisites

- [Railway account](https://railway.com)
- [GitHub repo](https://github.com) connected to Railway
- [Auth0 account](https://auth0.com)

---

## Step 1: Create Railway Project

### Option A: CLI
```bash
# Install Railway CLI
npm install -g railway

# Login
railway login

# Create project
railway init
# Follow prompts to connect GitHub repo
```

### Option B: Web Dashboard
1. Go to [railway.com](https://railway.com)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository

---

## Step 2: Add PostgreSQL

```bash
railway add postgresql
```

Or via dashboard:
1. Open project
2. Click "New" → "Database" → "PostgreSQL"

---

## Step 3: Configure Environment

### Backend Environment
```bash
railway variables set DATABASE_URL=$POSTGRES_URL
railway variables set AUTH0_DOMAIN=your-domain.us.auth0.com
railway variables set AUTH0_CLIENT_ID=your-client-id
railway variables set AUTH0_CLIENT_SECRET=your-client-secret
```

### Frontend Environment
```bash
railway variables set VITE_API_URL=https://your-app.up.railway.app
railway variables set VITE_AUTH0_DOMAIN=your-domain.us.auth0.com
railway variables set VITE_AUTH0_CLIENT_ID=your-client-id
```

---

## Step 4: Deploy

```bash
git push origin main
```

Railway will automatically detect and deploy:
- Frontend (detected from `frontend/package.json`)
- Backend (detected from `backend/package.json`)

---

## Step 5: Add Node-RED

```bash
railway deploy --template nodered
```

Or manually:
1. In Railway dashboard, click "New"
2. Select "Empty service"
3. Add the following `package.json`:

```json
{
  "name": "node-red",
  "version": "1.0.0",
  "scripts": {
    "start": "node_modules/.bin/node-red -p $PORT"
  },
  "dependencies": {
    "node-red": "^3.1.0"
  }
}
```

---

## Current Services

| Service | Type | Status |
|---------|------|--------|
| smart-building-app | Web app | ✅ |
| railway-nodered | Node-RED | ✅ |
| Postgres | Database | ✅ |

---

## Troubleshooting

### View Logs
```bash
railway logs
railway logs --service service-name
```

### Restart Service
```bash
railway restart --service service-name
```

### Open Shell
```bash
railway shell --service service-name
```

---

## Cost Management

- **Free tier:** $5 credit/month
- **PostgreSQL:** ~$5/month
- **Node-RED:** Uses free tier credit

See [pricing](https://railway.com/pricing) for details.
