# 🎨 Node-RED Integration

Node-RED flows for the Smart Building IoT Platform.

---

## Access

- **URL:** https://railway-nodered-production-1bec.up.railway.app
- **Username:** admin
- **Password:** password

---

## Core Flows

### 1. MQTT Input → Database

```
[mqtt in: sensor data] → [function: parse] → [postgres: insert]
```

**MQTT In Node:**
- Topic: `building/+/+/reading`
- Broker: Configured MQTT broker

**Function Node:**
```javascript
msg.deviceId = msg.topic.split('/')[1];
msg.sensorType = msg.topic.split('/')[2];
msg.value = msg.payload.value;
msg.unit = msg.payload.unit || '';
return msg;
```

---

### 2. REST API → MQTT (Commands)

```
[http in: API endpoint] → [function: prepare] → [mqtt out: device]
```

**HTTP In Node:**
- Method: POST
- URL: `/api/device/command`

**Function Node:**
```javascript
const deviceId = msg.payload.deviceId;
const command = msg.payload.command;
msg.topic = 'building/' + deviceId + '/command';
msg.payload = command;
return msg;
```

---

### 3. LoRaWAN Integration

```
[mqtt in: chirpstack] → [function: decode] → [postgres: insert]
```

**MQTT In Node:**
- Topic: `application/+/device/+/rx`

**Function Node:**
```javascript
const payload = msg.payload;
const decoded = payload.object || {};

msg.deviceId = 'lorawan_' + payload.devEui;
msg.sensorType = decoded.dataType || 'custom';
msg.value = decoded.temperature || decoded.humidity || decoded.value;
msg.unit = decoded.unit || '';
msg.timestamp = payload.receivedAt;

return msg;
```

---

### 4. Alert Monitoring

```
[mqtt in: device status] → [function: check] → [switch: route]
                                         ↓
                              [http out: create alert]
```

**Function Node:**
```javascript
const now = Date.now();
const lastSeen = msg.payload.lastSeen || 0;
const timeout = 5 * 60 * 1000; // 5 minutes

if (now - lastSeen > timeout) {
  msg.alert = {
    deviceId: msg.deviceId,
    alertType: 'device_offline',
    message: 'Device ' + msg.deviceId + ' offline',
    severity: 'warning'
  };
  return [msg, null];
}
return [null, msg];
```

---

## Import Flows

### Method 1: Paste JSON

1. Open Node-RED
2. Menu → Import → Clipboard
3. Paste flow JSON
4. Click Import

### Method 2: Copy from Documentation

Copy the JSON from each section above and import as above.

---

## MQTT Broker Configuration

### Add Broker in Node-RED

1. Click on MQTT node
2. Add new broker config
3. Enter:
   - **Broker:** Your MQTT host
   - **Port:** 1883 (or 9001 for WebSocket)
   - **Protocol:** MQTT V3.1.1

---

## Useful Nodes

Install via Palette Manager:

| Node | Purpose |
|------|---------|
| node-red-contrib-postgres | PostgreSQL database |
| node-red-contrib-mqtt-broker | Embedded MQTT broker |
| node-red-dashboard | UI dashboard |
| node-red-contrib-ros | ROS integration |
| node-red-contrib-webex | Webex notifications |

---

## Example: Complete Flow

```json
[
  {
    "id": "mqtt-in",
    "type": "mqtt in",
    "z": "main",
    "name": "All Sensors",
    "topic": "building/+/+/reading",
    "qos": "2",
    "broker": "mqtt-broker-config"
  },
  {
    "id": "parse",
    "type": "function",
    "z": "main",
    "name": "Parse Data",
    "func": "const parts = msg.topic.split('/');\nmsg.location = parts[0];\nmsg.deviceType = parts[1];\nmsg.sensorType = parts[2];\nreturn msg;"
  },
  {
    "id": "store",
    "type": "postgres",
    "z": "main",
    "name": "Insert DB"
  }
]
```

---

## Best Practices

1. **Use consistent topics** - Follow the `building/{location}/{type}/{property}` format
2. **Add error handling** - Use catch nodes to log errors
3. **Keep flows modular** - Separate input, processing, and output
4. **Use subflows** - For repeated patterns
5. **Enable persistence** - Use Node-RED's persistent context

---

## Troubleshooting

### No messages received
- Check MQTT broker is running
- Verify topic subscription
- Check firewall rules

### Database errors
- Verify PostgreSQL connection
- Check table schema matches
- Verify credentials

### Flow not deploying
- Check for syntax errors in function nodes
- Verify all required nodes are installed
