# 🏢 Smart Building IoT Platform

A modern IoT platform for smart buildings built with React, Node.js, Auth0, and PostgreSQL.

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Database | PostgreSQL + TimescaleDB |
| Authentication | Auth0 |
| Real-time | Socket.io |
| Hosting | Railway |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL (local or Railway)
- Auth0 account

### 1. Clone & Install

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 2. Configure Environment

```bash
# Frontend
cp .env.example .env
# Edit .env with your Auth0 credentials

# Backend
cp .env.example .env
# Edit .env with your DATABASE_URL
```

### 3. Set up Database

```bash
# Connect to PostgreSQL and run:
psql $DATABASE_URL -f schema.sql
```

### 4. Run Development

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 📁 Project Structure

```
smart-building-app/
├── frontend/          # React application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── hooks/
│   └── package.json
├── backend/          # Node.js API
│   ├── routes/
│   ├── models/
│   ├── services/
│   ├── index.js
│   └── schema.sql
└── README.md
```

## 🔧 Auth0 Setup

1. Create account at [auth0.com](https://auth0.com)
2. Create Application → Single Page Application
3. Configure:
   - Allowed Callback URLs: `http://localhost:3000`
   - Allowed Logout URLs: `http://localhost:3000`
   - Allowed Web Origins: `http://localhost:3000`

## 📦 Deploy to Railway

1. Push to GitHub
2. Create Railway project
3. Add PostgreSQL
4. Connect GitHub repo
5. Set environment variables

## 📄 License

MIT
