# Smart Building IoT Platform - Documentation

---

## 🏢 Project Overview

A modern IoT platform for smart buildings built with React, Node.js, Auth0, PostgreSQL, and Node-RED.

**Version:** 1.0.0  
**Last Updated:** 2026-02-16  
**Owner:** Alan Yeung

---

## 📡 API Reference

### Base URL
```
https://smart-building-app-production.up.railway.app
```

### Authentication
All API endpoints (except `/health`) require Auth0 authentication.

---

### Devices

#### GET /api/devices
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

#### POST /api/devices
Create a new device.

**Request Body:**
```json
{
  "name": "New Sensor",
  "type": "temperature",
  "location": "Living Room"
}
```

#### GET /api/devices/:id
Get device by ID.

#### PUT /api/devices/:id
Update device.

#### DELETE /api/devices/:id
Delete device.

---

### Sensor Readings

#### GET /api/readings
Get sensor readings.

**Query Parameters:**
- `deviceId` (optional) - Filter by device
- `sensorType` (optional) - Filter by sensor type
- `limit` (optional, default: 100) - Number of readings
- `from` (optional) - Start date
- `to` (optional) - End date

#### POST /api/readings
Add a new sensor reading.

**Request Body:**
```json
{
  "deviceId": "uuid",
  "sensorType": "temperature",
  "value": 22.5,
  "unit": "celsius"
}
```

---

### Alerts

#### GET /api/alerts
Get all alerts.

#### PUT /api/alerts/:id/acknowledge
Acknowledge an alert.

---

## 🗄️ Database Schema

### devices
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR(255) | Device | VARCHAR(50 name |
| type) | Device type |
| location | VARCHAR(255) | Location |
| status | ENUM | online, offline, error |
| metadata | JSONB | Additional data |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update |

### sensor_readings
| Column | Type | Description |
|--------|------|-------------|
| id | BIGSERIAL | Primary key |
| device_id | UUID | Foreign key to devices |
| sensor_type | VARCHAR(50) | Type of sensor |
| value | NUMERIC | Sensor value |
| unit | VARCHAR(20) | Unit of measurement |
| timestamp | TIMESTAMPTZ | Reading time |

### alerts
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| device_id | UUID | Foreign key to devices |
| alert_type | VARCHAR(50) | Type of alert |
| message | TEXT | Alert message |
| severity | ENUM | info, warning, error, critical |
| acknowledged | BOOLEAN | Acknowledgment status |
| created_at | TIMESTAMP | Creation time |

---

## 🔧 Device Types

| Type | Description | Common Sensors |
|------|-------------|----------------|
| temperature | Temperature monitoring | DHT22, DS18B20 |
| humidity | Humidity monitoring | DHT22, AM2302 |
| motion | Motion detection | PIR, ultrasonic |
| light | Light level | LDR, BH1750 |
| door | Door sensor | Magnetic reed switch |
| hvac | HVAC control | Temperature, fan speed |
| camera | Camera feed | IP camera, Raspberry Pi camera |
| robot | ROS robot | LIDAR, IMU, encoders |
| power | Power monitoring | Current sensor, voltage sensor |
| gas | Gas detection | MQ-2, MQ-7 |

---

## 🔌 MQTT Topics

### Subscribe
| Topic | Description |
|-------|-------------|
| `building/+/+/reading` | All sensor readings |
| `building/+/+/status` | Device status updates |
| `building/+/alert` | Alert messages |

### Publish
| Topic | Description |
|-------|-------------|
| `building/+/+/command` | Send commands to devices |
| `building/+/+/config` | Device configuration |

---

## 🌍 Environment Variables

### Backend
| Variable | Description |
|----------|-------------|
| DATABASE_URL | PostgreSQL connection string |
| AUTH0_DOMAIN | Auth0 domain |
| AUTH0_CLIENT_ID | Auth0 client ID |
| PORT | Server port (default: 3000) |

### Frontend
| Variable | Description |
|----------|-------------|
| VITE_API_URL | Backend API URL |
| VITE_AUTH0_DOMAIN | Auth0 domain |
| VITE_AUTH0_CLIENT_ID | Auth0 client ID |

---

## 🚀 Deployment

### Railway Services
- **smart-building-app** - Main application
- **PostgreSQL** - Database
- **Node-RED** - Flow automation

### Environment
- Node.js 18+
- PostgreSQL with TimescaleDB
- Auth0 for authentication

---

## 📞 Support

- **GitHub Issues:** https://github.com/bibtv/smart-building-app/issues
- **Email:** alan.yeung@powerworkplace.com
