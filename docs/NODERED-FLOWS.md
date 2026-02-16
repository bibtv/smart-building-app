# Node-RED Flows for Smart Building IoT Platform

## 📥 MQTT Input Flows

### 1. LoRaWAN Device Data (from ChirpStack)
```json
[
  {
    "id": "lorawan-input",
    "type": "mqtt in",
    "z": "main",
    "name": "LoRaWAN Uplink",
    "topic": "application/+/device/+/rx",
    "qos": "2",
    "broker": "mqtt-broker",
    "x": 150,
    "y": 100,
    "wires": [["lorawan-parse"]]
  },
  {
    "id": "lorawan-parse",
    "type": "function",
    "z": "main",
    "name": "Parse LoRaWAN Payload",
    "func": "const payload = msg.payload;\nconst decoded = payload.object || {};\n\nmsg.deviceId = payload.devEui;\nmsg.sensorType = payload.dataType || 'custom';\nmsg.value = decoded.temperature || decoded.humidity || decoded.value;\nmsg.unit = decoded.unit || '';\nmsg.timestamp = payload.receivedAt;\n\nreturn msg;",
    "x": 400,
    "y": 100,
    "wires": [["store-reading", "send-to-api"]]
  }
]
```

### 2. ROS Robot Data
```json
[
  {
    "id": "ros-input",
    "type": "mqtt in",
    "z": "main",
    "name": "Robot Status",
    "topic": "building/robot/+/status",
    "qos": "2",
    "broker": "mqtt-broker",
    "x": 150,
    "y": 250,
    "wires": [["ros-process"]]
  },
  {
    "id": "ros-process",
    "type": "function",
    "z": "main",
    "name": "Process Robot Data",
    "func": "const topicParts = msg.topic.split('/');\nconst robotId = topicParts[2];\n\nmsg.deviceId = robotId;\nmsg.sensorType = 'robot';\nmsg.value = JSON.stringify(msg.payload);\nmsg.unit = '';\n\nreturn msg;",
    "x": 400,
    "y": 250,
    "wires": [["store-reading"]]
  }
]
```

---

## 📤 MQTT Output Flows

### 3. Send Command to Device
```json
[
  {
    "id": "command-input",
    "type": "http in",
    "z": "main",
    "name": "Device Command API",
    "url": "/api/device/command",
    "method": "post",
    "x": 150,
    "y": 400,
    "wires": [["prepare-command"]]
  },
  {
    "id": "prepare-command",
    "type": "function",
    "z": "main",
    "name": "Prepare MQTT Message",
    "func": "const deviceId = msg.payload.deviceId;\nconst command = msg.payload.command;\n\nmsg.topic = 'building/device/' + deviceId + '/command';\nmsg.payload = command;\n\nreturn msg;",
    "x": 400,
    "y": 400,
    "wires": [["mqtt-out"]]
  },
  {
    "id": "mqtt-out",
    "type": "mqtt out",
    "z": "main",
    "name": "Device Command",
    "topic": "",
    "qos": "2",
    "retain": "false",
    "broker": "mqtt-broker",
    "x": 650,
    "y": 400,
    "wires": []
  }
]
```

---

## 💾 Database Integration

### 4. Store Sensor Reading
```json
[
  {
    "id": "store-reading",
    "type": "function",
    "z": "main",
    "name": "Insert to PostgreSQL",
    "func": "const pg = global.get('postgres');\n\nconst query = `\n  INSERT INTO sensor_readings (device_id, sensor_type, value, unit, timestamp)\n  VALUES ($1, $2, $3, $4, NOW())\n`;\n\npg.query(query, [\n  msg.deviceId,\n  msg.sensorType,\n  msg.value,\n  msg.unit\n], function(err) {\n  if (err) node.error(err);\n});\n\nreturn msg;",
    "x": 650,
    "y": 100,
    "wires": []
  }
]
```

---

## 🔄 REST API Integration

### 5. Forward to Backend API
```json
[
  {
    "id": "send-to-api",
    "type": "function",
    "z": "main",
    "name": "Format for API",
    "func": "msg.payload = {\n  deviceId: msg.deviceId,\n  sensorType: msg.sensorType,\n  value: msg.value,\n  unit: msg.unit\n};\n\nreturn msg;",
    "x": 650,
    "y": 100,
    "wires": [["api-request"]]
  },
  {
    "id": "api-request",
    "type": "http request",
    "z": "main",
    "name": "POST to Backend",
    "method": "POST",
    "url": "https://smart-building-app-production.up.railway.app/api/readings",
    "tls": "",
    "x": 900,
    "y": 100,
    "wires": [["api-response"]]
  },
  {
    "id": "api-response",
    "type": "debug",
    "z": "main",
    "name": "API Response",
    "active": true,
    "tosidebar": true,
    "console": false,
    "tostatus": false,
    "complete": "payload",
    "x": 1150,
    "y": 100,
    "wires": []
  }
]
```

---

## 🔔 Alert Flows

### 6. Device Offline Alert
```json
[
  {
    "id": "check-offline",
    "type": "function",
    "z": "main",
    "name": "Check Device Status",
    "func": "// Check if device hasn't reported in 5 minutes\nconst now = Date.now();\nconst lastSeen = msg.lastSeen || 0;\nconst timeout = 5 * 60 * 1000; // 5 minutes\n\nif (now - lastSeen > timeout) {\n  msg.alert = {\n    deviceId: msg.deviceId,\n    alertType: 'device_offline',\n    message: 'Device ' + msg.deviceId + ' has not reported in 5 minutes',\n    severity: 'warning'\n  };\n  return [msg, null];\n}\nreturn [null, msg];",
    "x": 400,
    "y": 500,
    "wires": [["send-alert"], ["continue"]]
  },
  {
    "id": "send-alert",
    "type": "http request",
    "z": "main",
    "name": "Create Alert",
    "method": "POST",
    "url": "https://smart-building-app-production.up.railway.app/api/alerts",
    "x": 650,
    "y": 500,
    "wires": []
  }
]
```

---

## 📊 MQTT Broker Configuration

### Broker Settings
```
Protocol: MQTT v3.1.1
Port: 1883 (TCP) / 9001 (WebSocket)
Authentication: None (development)
Persistence: Disabled
```

### Topic Structure
```
building/{location}/{device_type}/reading    # Sensor data
building/{location}/{device_type}/status     # Device status
building/{location}/{device_type}/command    # Commands to device
building/robot/{robot_id}/status             # Robot status
building/robot/{robot_id}/cmd                # Robot commands

application/{app_id}/device/{dev_id}/rx      # LoRaWAN uplink (ChirpStack)
application/{app_id}/device/{dev_id}/tx       # LoRaWAN downlink
```

---

## 🔧 Node-RED MQTT Broker Setup

To add MQTT broker in Node-RED:

1. Open Node-RED editor
2. Go to Menu → Settings → Runtime
3. Scroll to "Editor" or use palette manager
4. Install `node-red-contrib-aedes` for embedded broker
5. Or configure external broker in a "mqtt broker" config node

### Using External MQTT Broker

1. Click on MQTT node
2. Add new broker config
3. Enter:
   - Broker: `<mqtt-broker-host>`
   - Port: 1883
   - Protocol: MQTT V3.1.1

---

## ✅ Flow Summary

| Flow | Purpose |
|------|---------|
| LoRaWAN Input | Receive data from ChirpStack |
| ROS Robot Input | Receive data from ROS robots |
| Device Command | Send commands to devices |
| Store Reading | Save to PostgreSQL |
| API Forward | Send to backend API |
| Alerts | Monitor device health |

---

## 🚀 Quick Deploy

### Start MQTT Broker (Docker)
```bash
docker run -d -p 1883:1883 -p 9001:9001 --name mqtt eclipse-mosquitto mosquitto -c /mosquitto.conf
```

### Import Flows to Node-RED
1. Open Node-RED
2. Menu → Import
3. Copy JSON from above sections
4. Deploy

---

*Last Updated: 2026-02-16*
