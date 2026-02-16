# 🗄️ Data Models

Database schema and data models for the Smart Building IoT Platform.

---

## Tables

### devices

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| name | VARCHAR(255) | NOT NULL | Device name |
| type | VARCHAR(50) | NOT NULL | Device type |
| location | VARCHAR(255) | | Physical location |
| status | ENUM | | online, offline, error |
| metadata | JSONB | | Additional config |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMP | | Last update |

### sensor_readings

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGSERIAL | PK | Unique identifier |
| device_id | UUID | FK → devices.id | Parent device |
| sensor_type | VARCHAR(50) | NOT NULL | Type of reading |
| value | NUMERIC | NOT NULL | Sensor value |
| unit | VARCHAR(20) | | Unit of measure |
| timestamp | TIMESTAMPTZ | DEFAULT NOW() | Reading time |

### alerts

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| device_id | UUID | FK → devices.id | Related device |
| alert_type | VARCHAR(50) | NOT NULL | Type of alert |
| message | TEXT | NOT NULL | Alert message |
| severity | ENUM | | info, warning, error, critical |
| acknowledged | BOOLEAN | DEFAULT FALSE | Acknowledged status |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |

---

## Device Types

| Type | Description | Example Sensors |
|------|-------------|-----------------|
| `temperature` | Temperature monitoring | DHT22, DS18B20 |
| `humidity` | Humidity monitoring | DHT22, AM2302 |
| `motion` | Motion detection | PIR, ultrasonic |
| `light` | Light level | LDR, BH1750 |
| `door` | Door/window sensor | Reed switch |
| `hvac` | HVAC control | Temperature, fan |
| `camera` | Camera feed | IP camera |
| `robot` | ROS robot | LIDAR, IMU |
| `power` | Power monitoring | Current sensor |
| `gas` | Gas detection | MQ-2, MQ-7 |
| `lorawan` | LoRaWAN device | Various LPWAN sensors |

---

## Alert Severity

| Level | Color | Description |
|-------|-------|-------------|
| `info` | Blue | Informational |
| `warning` | Yellow | Warning condition |
| `error` | Orange | Error condition |
| `critical` | Red | Critical issue |

---

## Example Queries

### Insert sensor reading
```sql
INSERT INTO sensor_readings (device_id, sensor_type, value, unit)
VALUES ('uuid-here', 'temperature', 22.5, 'celsius');
```

### Get latest readings per device
```sql
SELECT DISTINCT ON (device_id) *
FROM sensor_readings
ORDER BY device_id, timestamp DESC;
```

### Get device with alert count
```sql
SELECT d.*, COUNT(a.id) as alert_count
FROM devices d
LEFT JOIN alerts a ON d.id = a.device_id AND a.acknowledged = FALSE
GROUP BY d.id;
```

---

## TimescaleDB (Optional)

For time-series optimization with TimescaleDB:

```sql
-- Convert to hypertable
SELECT create_hypertable('sensor_readings', 'timestamp');

-- Enable compression
ALTER TABLE sensor_readings SET (
  timescaledb.compress,
  timescaledb.compress_segmentby = 'device_id'
);

-- Add compression policy
SELECT add_compression_policy('sensor_readings', INTERVAL '7 days');
```
