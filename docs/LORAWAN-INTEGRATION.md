# LoRaWAN Integration Plan

## 🌍 LoRaWAN Architecture

```
┌──────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  LoRaWAN    │     │  Network Server │     │  Your Platform  │
│  Devices    │────▶│  (ChirpStack)   │────▶│  (Node-RED)    │
│  Sensors    │     │  + Gateway      │     │  + PostgreSQL  │
└──────────────┘     └─────────────────┘     └─────────────────┘
```

---

## ⚙️ Components Needed

### 1. LoRaWAN Gateway
- **Hardware:** Raspberry Pi + LoRa concentrator (e.g., RAK2245, RAK14000)
- **Software:** ChirpStack Gateway OS
- **Alternative:** Buy ready-made gateway (Kerlink, Multitech, Milesight)

### 2. Network Server
| Option | Type | Cost | Complexity |
|--------|------|------|------------|
| **ChirpStack** | Self-hosted | Free | Medium |
| **The Things Stack** | Cloud/Self-hosted | Free tier | Low |
| **LoRaServer** | Self-hosted | Free | High |

### 3. Application Integration
- MQTT (recommended)
- REST API
- InfluxDB for time-series data

---

## 🔌 Integration Flow

```
LoRaWAN Device → Gateway → Network Server → MQTT → Node-RED → PostgreSQL → React App
```

### MQTT Topics from ChirpStack:
```
application/{app_id}/device/{dev_id}/rx  # Uplink (device → server)
application/{app_id}/device/{dev_id}/tx  # Downlink (server → device)
application/{app_id}/device/{dev_id}/join  # Device join
```

---

## 📋 Implementation Steps

### Phase 1: Infrastructure
- [ ] Purchase/setup LoRaWAN gateway
- [ ] Deploy ChirpStack Network Server (Docker)
- [ ] Configure gateway in ChirpStack

### Phase 2: Device Management
- [ ] Create application in ChirpStack
- [ ] Register devices (OTAA or ABP)
- [ ] Test uplink/downlink

### Phase 3: Integration
- [ ] Configure MQTT integration in ChirpStack
- [ ] Create Node-RED flows to subscribe to MQTT
- [ ] Parse LoRaWAN payload (decode bytes → JSON)
- [ ] Store in PostgreSQL

### Phase 4: Dashboard
- [ ] Add LoRaWAN devices to React UI
- [ ] Display sensor data
- [ ] Send downlink commands

---

## 🛒 Recommended Hardware

### Gateway
| Model | Price | Bands |
|-------|-------|-------|
| RAK7249 (WisGate) | ~$200 | EU/US |
| Kerlink iFemtoCell | ~$300 | EU/US |
| Dragino LG308 | ~$80 | EU868 |

### Sensors/Devices
| Device | Use Case | Price |
|--------|----------|-------|
| LilyGO TTGO T-Beam | GPS tracker | ~$20 |
| Heltec WiFi LoRa 32 | General sensor | ~$15 |
| BME680 | Temp/Humidity/Gas | ~$10 |
| DeepSleepRouter | Door sensor | ~$10 |

---

## 💰 Cost Estimate

| Item | One-time |
|------|----------|
| LoRaWAN Gateway | $80-300 |
| LoRa Sensors (x5) | $50-100 |
| **Total** | **$130-400** |

---

## 🔧 Technical Notes

### Payload Decoding
LoRaWAN sends raw bytes - need decoder in ChirpStack:

```javascript
function Decode(fPort, bytes) {
  return {
    temperature: (bytes[0] << 8) | bytes[1]) / 100,
    humidity: bytes[2],
    battery: bytes[3]
  };
}
```

### Data Flow Example
1. Temperature sensor sends `01 2B 64` (bytes)
2. ChirpStack decodes → `{temp: 29.9, status: "ok"}`
3. MQTT publishes to `application/1/device/+/rx`
4. Node-RED subscribes, inserts to PostgreSQL
5. React app displays in dashboard

---

## 📦 Docker Compose (ChirpStack)

```yaml
version: '3'

services:
  chirpstack-gateway-bridge:
    image: chirpstack/chirpstack-gateway-bridge:4
    ports:
      - 1700:1700/udp
  
  chirpstack-network-server:
    image: chirpstack/chirpstack-network-server:4
    environment:
      - POSTGRESQL_DSN=postgres://chirpstack:chirpstack@postgres:5432/chirpstack
  
  chirpstack-application-server:
    image: chirpstack/chirpstack-application-server:4
    environment:
      - POSTGRESQL_DSN=postgres://chirpstack:chirpstack@postgres:5432/chirpstack_as
  
  chirpstack-rest-api:
    image: chirpstack/chirpstack-rest-api:4
  
  mosquitto:
    image: eclipse-mosquitto
    ports:
      - 1883:1883

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_PASSWORD=chirpstack
```

---

## ✅ Next Steps

1. **Decide:** Self-hosted vs cloud-hosted
2. **Purchase:** Gateway hardware
3. **Deploy:** ChirpStack on Railway or VPS
4. **Connect:** First sensor

Want me to set up ChirpStack on Railway or create the Node-RED integration flows?
