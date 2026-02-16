# 📬 Postman Collection

Postman collection for API testing.

---

## Import Collection

### Option 1: From File

1. Open Postman
2. Click **Import** → **File**
3. Select `Smart-Building-IoT-Platform.postman_collection.json`
4. Click Import

### Option 2: From URL

1. Click **Import** → **Link**
2. Enter: `https://raw.githubusercontent.com/bibtv/smart-building-app/main/docs/Smart-Building-IoT-Platform.postman_collection.json`

---

## Configure Environment

1. Click **Environments** → **Add**
2. Add variable: `baseUrl`
3. Value: `https://smart-building-app-production.up.railway.app`
4. Save

---

## Collection Structure

```
Smart Building IoT Platform
├── Devices
│   ├── Get All Devices
│   ├── Get Device by ID
│   ├── Create Device
│   ├── Update Device
│   └── Delete Device
├── Sensor Readings
│   ├── Get All Readings
│   ├── Get Latest Reading
│   └── Add Reading
├── Alerts
│   ├── Get All Alerts
│   └── Acknowledge Alert
├── Auth
│   ├── Login (Auth0)
│   ├── Logout
│   └── Get User Info
└── Health
    └── Health Check
```

---

## Using the Collection

### 1. Get Devices

1. Select **Devices → Get All Devices**
2. Click **Send**
3. View response in bottom panel

### 2. Add Sensor Reading

1. Select **Sensor Readings → Add Reading**
2. Update body with your device data
3. Click **Send**

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| baseUrl | API base URL | https://smart-building-app-production.up.railway.app |
| accessToken | Auth0 token | (auto-filled after login) |

---

## Adding Authentication

1. Go to **Collections** → **Auth**
2. Click **Get Token** (will redirect to Auth0)
3. Copy the token
4. In environment, set `accessToken` = your token
5. For each request, add header:
   - Key: `Authorization`
   - Value: `Bearer {{accessToken}}`

---

## Testing

### Run All Tests

1. Click **Collections** → **Smart Building IoT Platform**
2. Click **Run**
3. Configure:
   - Iteration: 1
   - Delay: 500ms
4. Click **Run Collection**

---

## Export Collection

1. Click **Collections** → **...** → **Export**
2. Choose format (recommended: JSON v2.1)
3. Save to `docs/` folder

---

## Additional Requests

Add custom requests:

1. Click **...** → **Add Request**
2. Configure:
   - Method: GET/POST/PUT/DELETE
   - URL: `{{baseUrl}}/api/endpoint`
3. Save to appropriate folder
