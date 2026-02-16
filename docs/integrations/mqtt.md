# 📨 MQTT Integration

Guide for setting up MQTT communication with IoT devices.

---

## MQTT Broker

### Quick Start (Docker)

```bash
docker run -d \
  --name mqtt-broker \
  -p 1883:1883 \
  -p 9001:9001 \
  eclipse-mosquitto:2 \
  mosquitto -c /mosquitto/config/mosquitto.conf
```

### Configuration

```conf
# mosquitto.conf
listener 1883
allow_anonymous true
persistence false

# WebSocket support
listener 9001
protocol websockets
```

---

## Topic Structure

### Format
```
building/{location}/{device_type}/{property}
```

### Examples

| Topic | Direction | Description |
|-------|-----------|-------------|
| `building/livingroom/temperature/reading` | → In | Sensor reading |
| `building/livingroom/temperature/status` | → In | Device status |
| `building/livingroom/hvac/command` | ← Out | HVAC command |
| `building/+/temperature/reading` | → In | All temperature sensors |

---

## MQTT Clients

### ESP8266/ESP32 Example

```cpp
#include <PubSubClient.h>

const char* mqttServer = "broker.hivemq.com";
const int mqttPort = 1883;

void setup() {
  client.setServer(mqttServer, mqttPort);
  
  // Publish temperature reading
  char payload[50];
  sprintf(payload, "{\"temp\": %.1f, \"humidity\": %.1f}", temperature, humidity);
  client.publish("building/livingroom/temperature/reading", payload);
}
```

### Python Example

```python
import paho.mqtt.client as mqtt

def on_connect(client, userdata, flags, rc):
    client.subscribe("building/+/temperature/reading")

def on_message(client, userdata, msg):
    print(f"Received: {msg.payload}")

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message
client.connect("broker.hivemq.com", 1883)
client.loop_forever()
```

---

## Node-RED MQTT Nodes

### Subscribe to MQTT

1. Add **mqtt in** node
2. Configure broker
3. Set topic: `building/+/+/reading`
4. Connect to other nodes

### Publish to MQTT

1. Add **mqtt out** node
2. Configure broker
3. Set topic dynamically: `building/${msg.location}/command`

---

## Security

### Enable Authentication

```conf
listener 1883
allow_anonymous false
password_file /mosquitto/config/pwfile
```

### Generate Password File

```bash
docker exec mqtt-broker mosquitto_passwd -c /mosquitto/config/pwfile username
```

---

## Public Test Brokers

| Broker | Address | WebSocket |
|--------|---------|-----------|
| HiveMQ | broker.hivemq.com | 8000 |
| Mosquitto | test.mosquitto.org | 8080 |

*Use for testing only - not for production!*
