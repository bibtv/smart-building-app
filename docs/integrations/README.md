# 🔌 Integrations

Guides for integrating external systems and devices.

---

## 📁 Files

| File | Description |
|------|-------------|
| [mqtt.md](./mqtt.md) | MQTT broker setup |
| [lorawan.md](./lorawan.md) | LoRaWAN/ChirpStack integration |
| [ros.md](./ros.md) | ROS robot integration |
| [nodered.md](./nodered.md) | Node-RED flow examples |

---

## Integration Overview

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   LoRaWAN   │     │  MQTT Devices│     │  ROS Robots │
│  (ChirpStack│     │   (WiFi)    │     │   (WiFi)    │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
                           ▼
                  ┌────────────────┐
                  │  MQTT Broker   │
                  └────────┬───────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │Node-RED  │ │ Backend  │ │ WebSocket│
        └────┬─────┘ └────┬─────┘ └──────────┘
             │             │
             └──────┬──────┘
                    ▼
             ┌──────────┐
             │PostgreSQL│
             └──────────┘
```

---

## Supported Devices

| Protocol | Integration Method | Devices |
|----------|-------------------|---------|
| MQTT | Direct subscribe/publish | ESP8266, ESP32, Arduino |
| LoRaWAN | ChirpStack gateway | Battery-powered sensors |
| REST | HTTP POST | Commercial IoT devices |
| WebSocket | Real-time | Custom applications |
| ROS | MQTT/rosbridge | robots, actuators |

---

*See individual integration guides for setup instructions.*
