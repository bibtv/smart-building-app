# 🤖 ROS Robot Integration

Guide for integrating ROS-based robots with the IoT platform.

---

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  ROS Robot │────▶│  MQTT Broker│────▶│  Node-RED  │
│ (ROS Noetic│     │             │     │             │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                                │
                                                ▼
                                        ┌─────────────┐
                                        │  PostgreSQL │
                                        └─────────────┘
```

---

## Integration Methods

### 1. MQTT Bridge (Recommended)

Install `mqtt_bridge` on the robot:

```bash
# On ROS robot
sudo apt install ros-noetic-mqtt-bridge
```

Configure `mqtt_bridge.yaml`:

```yaml
mqtt:
  host: mqtt-broker-host
  port: 1883

ros:
  robot_namespace: robot1

bridge:
  - ros_topic: /cmd_vel
    mqtt_topic: building/robot1/cmd_vel
    ros_msg_type: geometry_msgs/Twist
  - ros_topic: /odom
    mqtt_topic: building/robot1/odom
    ros_msg_type: nav_msgs/Odometry
  - ros_topic: /battery_state
    mqtt_topic: building/robot1/battery
    ros_msg_type: sensor_msgs/BatteryState
```

---

### 2. Rosbridge (WebSocket)

Install rosbridge on the robot:

```bash
sudo apt install ros-noetic-rosbridge-suite
```

Start rosbridge:
```bash
roslaunch rosbridge_server rosbridge_websocket.launch
```

Connect via Node-RED `rosbridge` nodes.

---

## MQTT Topics

### Subscribe (Robot → Platform)
| Topic | Message Type |
|-------|--------------|
| `building/robot/{id}/status` | JSON |
| `building/robot/{id}/odom` | JSON (position, velocity) |
| `building/robot/{id}/battery` | JSON (percentage) |
| `building/robot/{id}/sensors` | JSON (sensor data) |

### Publish (Platform → Robot)
| Topic | Message Type |
|-------|--------------|
| `building/robot/{id}/cmd_vel` | JSON ({linear, angular}) |
| `building/robot/{id}/goal` | JSON (position) |

---

## Example Data

### Robot Status
```json
{
  "robot_id": "robot1",
  "status": "idle",
  "battery": 85,
  "position": { "x": 1.2, "y": 3.4 },
  "timestamp": "2026-02-16T12:00:00Z"
}
```

### Command
```json
{
  "linear": { "x": 0.5, "y": 0, "z": 0 },
  "angular": { "x": 0, "y": 0, "z": 0.1 }
}
```

---

## Node-RED Integration

### Receive Robot Data

```json
[
  {
    "id": "robot-status",
    "type": "mqtt in",
    "topic": "building/robot/+/status",
    "broker": "mqtt-broker"
  },
  {
    "id": "parse-robot",
    "type": "function",
    "func": "msg.deviceId = 'robot_' + msg.topic.split('/')[2];\nmsg.sensorType = 'robot_status';\nmsg.value = JSON.stringify(msg.payload);\nreturn msg;"
  },
  {
    "id": "store-db",
    "type": "postgres",
    "query": "INSERT INTO sensor_readings ..."
  }
]
```

### Send Robot Command

```json
[
  {
    "id": "http-in",
    "type": "http in",
    "url": "/api/robot/command"
  },
  {
    "id": "format-mqtt",
    "type": "function",
    "func": "msg.topic = 'building/robot/' + msg.payload.robotId + '/cmd_vel';\nmsg.payload = msg.payload.command;\nreturn msg;"
  },
  {
    "id": "mqtt-out",
    "type": "mqtt out",
    "topic": "",
    "broker": "mqtt-broker"
  }
]
```

---

## Robot Control UI

Add to React dashboard:

```jsx
function RobotControl({ robotId }) {
  const [position, setPosition] = useState(null);
  
  const sendCommand = (cmd) => {
    fetch('/api/robot/command', {
      method: 'POST',
      body: JSON.stringify({ robotId, command: cmd })
    });
  };
  
  return (
    <div>
      <h3>Robot {robotId}</h3>
      <div>
        <button onClick={() => sendCommand({x: 0.1})}>Forward</button>
        <button onClick={() => sendCommand({x: -0.1})}>Backward</button>
        <button onClick={() => sendCommand({z: 0.1})}>Turn Left</button>
        <button onClick={() => sendCommand({z: -0.1})}>Turn Right</button>
      </div>
    </div>
  );
}
```

---

## Supported ROS Versions

| ROS Version | Status |
|-------------|--------|
| ROS Noetic | ✅ Recommended |
| ROS 2 Jazzy | ✅ Supported |
| ROS 2 Humble | ✅ Supported |
