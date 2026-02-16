# 🔌 API Reference

REST API documentation for the Smart Building IoT Platform.

---

## 📁 Files

| File | Description |
|------|-------------|
| [endpoints.md](./endpoints.md) | API endpoints |
| [postman.md](./postman.md) | Postman collection |

---

## Base URL

```
https://smart-building-app-production.up.railway.app
```

---

## Authentication

All endpoints (except `/health`) require Auth0 JWT token.

### Include Token

```bash
curl -H "Authorization: Bearer <token>" \
  https://smart-building-app-production.up.railway.app/api/devices
```

---

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/devices` | List all devices |
| POST | `/api/devices` | Create device |
| GET | `/api/devices/:id` | Get device |
| PUT | `/api/devices/:id` | Update device |
| DELETE | `/api/devices/:id` | Delete device |
| GET | `/api/readings` | Get sensor readings |
| POST | `/api/readings` | Add reading |
| GET | `/api/alerts` | Get alerts |
| PUT | `/api/alerts/:id/acknowledge` | Acknowledge alert |
| GET | `/health` | Health check |

---

*See [endpoints.md](./endpoints.md) for detailed API documentation.*
