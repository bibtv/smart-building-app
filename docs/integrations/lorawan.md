# 📡 LoRaWAN Integration

Guide for integrating LoRaWAN devices via ChirpStack.

---

## Architecture

```
┌──────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  LoRaWAN    │     │  Network Server │     │  Your Platform  │
│  Devices    │────▶│  (ChirpStack)   │────▶│  (Node-RED)    │
│  Sensors    │     │  + Gateway      │     │  + PostgreSQL  │
└──────────────┘     └─────────────────┘     └─────────────────┘
```

---

## Options

| Option | Type | Cost | Complexity |
|--------|------|------|------------|
| **The Things Stack** | Cloud | Free tier | Low |
| **ChirpStack** | Self-hosted | Free | Medium |
| **ChirpStack Cloud** | Managed | $99/mo | Low |

---

## Option 1: The Things Stack Cloud (Recommended)

### Sign Up
1. Go to [account.thethingsstack.io](https://account.thethingsstack.io)
2. Create free account
3. Create your first application

### Add Device
1. In Console → Applications → Add application
2. Add end device (OTAA recommended)
3. Note: Device EUI, App EUI, App Key

### MQTT Integration
1. Go to Integrations → MQTT
2. Note: Username, Password, Server
3. Subscribe to topic: `application/#`

---

## Option 2: ChirpStack Self-Hosted

### Docker Compose

```bash
# Start ChirpStack
docker-compose -f docs/docker-compose.lorawan.yml up -d
```

Access:
- ChirpStack UI: http://localhost:8080
- Credentials: admin / admin

### Configure

1. Add gateway in ChirpStack
2. Create application
3. Add devices
4. Configure MQTT integration

---

## MQTT Topics

### Subscribe (Uplink)
```
application/{app_id}/device/{dev_eui}/rx
```

### Publish (Downlink)
```
application/{app_id}/device/{dev_eui}/tx
```

---

## Payload Decoding

### JavaScript Decoder (ChirpStack)

```javascript
function Decode(fPort, bytes) {
  return {
    temperature: ((bytes[0] << 8) | bytes[1]) / 100,
    humidity: bytes[2],
    battery: bytes[3],
    status: (bytes[4] & 1) ? "ok" : "error"
  };
}
```

---

## Hardware Recommendations

### Gateways
| Model | Price | Bands |
|-------|-------|-------|
| RAK7249 | ~$200 | EU/US |
| Dragino LG308 | ~$80 | EU868 |
| RAK7289 | ~$150 | Global |

### Sensors
| Device | Use Case | Price |
|--------|----------|-------|
| LilyGO T-Beam | GPS | ~$20 |
| Heltec LoRa 32 | Multi-sensor | ~$15 |
| BME280 | Temp/Humidity | ~$5 |

---

## Cost

| Item | One-time |
|------|----------|
| Gateway | $80-300 |
| Sensors (x5) | $50-100 |
| **Total** | **$130-400** |

---

## Next Steps

1. Sign up for The Things Stack
2. Purchase a gateway
3. Add your first sensor
4. Connect to Node-RED

See [Node-RED Flows](../integrations/nodered.md) for data integration.
