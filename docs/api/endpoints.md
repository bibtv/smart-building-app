# 📡 API Endpoints

Detailed API endpoint documentation.

---

## Base URL

```
https://smart-building-app-production.up.railway.app
```

---

## Devices

### GET /api/devices

Get all devices.

**Response:**
```json
{
  "devices": [
    {
      "id": "uuid",
      "name": "Living Room Sensor",
      "type": "temperature",
      "location": "Living Room",
      "status": "online",
      "metadata": {},
      "createdAt": "2026-01-01T00:00:00Z"
    }
  ]
}
```

### GET /api/devices/:id

Get device by ID.

**Response:**
```json
{
  "id": "uuid",
  "name": "Living Room Sensor",
  "type": "temperature",
  "location": "Living Room",
  "status": "online",
  "metadata": {
    "model": "DHT22"
  },
  "createdAt": "2026-01-01T00:00:00Z",
  "updatedAt": "2026-01-01T00:00:00Z"
}
```

### POST /api/devices

Create a new device.

**Request:**
```json
{
  "name": "New Sensor",
  "type": "temperature",
  "location": "Living Room",
  "metadata": {}
}
```

### PUT /api/devices/:id

Update device.

**Request:**
```json
{
  "name": "Updated Name",
  "status": "online"
}
```

### DELETE /api/devices/:id

Delete device.

**Response:** `204 No Content`

---

## Sensor Readings

### GET /api/readings

Get sensor readings.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| deviceId | UUID | Filter by device |
| sensorType | string | Filter by sensor type |
| limit | number | Number of results (default: 100) |
| from | date | Start date |
| to | date | End date |

**Response:**
```json
{
  "readings": [
    {
      "id": 12345,
      "deviceId": "uuid",
      "sensorType": "temperature",
      "value": 22.5,
      "unit": "celsius",
      "timestamp": "2026-01-01T12:00:00Z"
    }
  ]
}
```

### GET /api/readings/latest

Get latest reading for each device.

**Response:**
```json
{
  "readings": [
    {
      "deviceId": "uuid",
      "sensorType": "temperature",
      "value": 22.5,
      "unit": "celsius",
      "timestamp": "2026-01-01T12:00:00Z"
    }
  ]
}
```

### POST /api/readings

Add a new sensor reading.

**Request:**
```json
{
  "deviceId": "uuid",
  "sensorType": "temperature",
  "value": 22.5,
  "unit": "celsius"
}
```

---

## Alerts

### GET /api/alerts

Get all alerts.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| deviceId | UUID | Filter by device |
| severity | string | Filter by severity |
| acknowledged | boolean | Filter by status |

**Response:**
```json
{
  "alerts": [
    {
      "id": "uuid",
      "deviceId": "uuid",
      "alertType": "device_offline",
      "message": "Device offline",
      "severity": "warning",
      "acknowledged": false,
      "createdAt": "2026-01-01T12:00:00Z"
    }
  ]
}
```

### PUT /api/alerts/:id/acknowledge

Acknowledge an alert.

**Response:**
```json
{
  "id": "uuid",
  "acknowledged": true
}
```

---

## Health

### GET /health

Health check endpoint (no auth required).

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-01T12:00:00Z"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request",
  "message": "deviceId is required"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing token"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Device not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "Database connection failed"
}
```
