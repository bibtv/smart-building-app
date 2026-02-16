# 📊 Architecture Diagrams

This file contains Mermaid diagrams for the Smart Building IoT Platform.

---

## System Architecture

```mermaid
flowchart TB
    subgraph "IoT Layer"
        direction LR
        Sensors["📡 Sensors"]
        Actuators["🎮 Actuators"]
        Robots["🤖 ROS Robots"]
        LoRaWAN["📡 LoRaWAN Devices"]
    end
    
    subgraph "Communication"
        MQTT["📨 MQTT"]
        WebSocket["🔌 WebSocket"]
        REST["🌐 REST API"]
    end
    
    subgraph "Network Server"
        ChirpStack["📟 ChirpStack"]
    end
    
    subgraph "Processing"
        NodeRED["🎨 Node-RED"]
        Backend["⚙️ Backend"]
    end
    
    subgraph "Storage"
        DB["🗄️ PostgreSQL"]
    end
    
    subgraph "Frontend"
        React["⚛️ React"]
        Auth["🔐 Auth0"]
    end
    
    Sensors --> MQTT
    Actuators --> MQTT
    Robots --> MQTT
    LoRaWAN --> ChirpStack
    ChirpStack --> MQTT
    MQTT --> NodeRED
    MQTT --> Backend
    NodeRED --> DB
    Backend --> DB
    React --> REST
    React --> WebSocket
    React --> Auth
```

---

## Data Flow - Sensor Reading

```mermaid
sequenceDiagram
    participant Device as IoT Device
    participant MQTT as MQTT Broker
    participant NodeRED as Node-RED
    participant DB as PostgreSQL
    participant API as Backend API
    participant UI as React App
    
    Device->>MQTT: Publish sensor data
    MQTT->>NodeRED: Forward to flow
    NodeRED->>DB: Store reading
    NodeRED->>API: Send for processing
    API->>DB: Store processed data
    UI->>API: Request readings
    API-->>UI: Return data
```

---

## Data Flow - Robot Control

```mermaid
sequenceDiagram
    participant User
    participant UI as React App
    participant API as Backend
    participant NodeRED as Node-RED
    participant MQTT as MQTT
    participant Robot as ROS Robot
    
    User->>UI: Click "Move Robot"
    UI->>API: Send command
    API->>NodeRED: Forward command
    NodeRED->>MQTT: Publish command
    MQTT->>Robot: Deliver command
    Robot-->>MQTT: Acknowledge
    MQTT-->>NodeRED: Status
    NodeRED-->>API: Update
    API-->>UI: Success
```

---

## Database Schema

```mermaid
erDiagram
    DEVICES ||--o{ SENSOR_READINGS : "generates"
    DEVICES ||--o{ ALERTS : "triggers"
    
    DEVICES {
        uuid id PK
        string name
        string type
        string location
        enum status
        jsonb metadata
        timestamp created_at
        timestamp updated_at
    }
    
    SENSOR_READINGS {
        bigint id PK
        uuid device_id FK
        string sensor_type
        numeric value
        string unit
        timestamptz timestamp
    }
    
    ALERTS {
        uuid id PK
        uuid device_id FK
        string alert_type
        text message
        enum severity
        boolean acknowledged
        timestamptz created_at
    }
```

---

## Deployment Architecture

```mermaid
flowchart LR
    subgraph "Railway Cloud"
        App["🏢 Smart Building App"]
        NodeRED["🎨 Node-RED"]
        DB["🗄️ PostgreSQL"]
    end
    
    subgraph "External"
        Auth0["🔐 Auth0"]
        ChirpStack["📟 ChirpStack"]
    end
    
    subgraph "IoT Network"
        MQTT["📨 MQTT"]
        Gateway["📡 LoRaWAN Gateway"]
        Devices["📡 IoT Devices"]
        Robots["🤖 Robots"]
    end
    
    App --> Auth0
    App --> NodeRED
    App --> DB
    NodeRED --> MQTT
    ChirpStack --> MQTT
    MQTT --> Devices
    MQTT --> Robots
    Gateway --> ChirpStack
```

---

## Feature Roadmap

```mermaid
gantt
    title Project Timeline
    dateFormat  YYYY-MM-DD
    
    section Phase 1
    Core Platform       :done,    p1, 2026-01-01, 2026-02-15
    
    section Phase 2
    IoT Expansion      :active,  p2, 2026-02-16, 2026-04-30
    
    section Phase 3
    ROS Integration    :         p3, 2026-05-01, 2026-07-31
    
    section Phase 4
    LoRaWAN Integration:         p4, 2026-08-01, 2026-10-31
    
    section Phase 5
    Advanced Features  :         p5, 2026-11-01, 2026-12-31
```

---

## MQTT Topic Structure

```mermaid
graph LR
    subgraph "Topics"
        Direction["📍 Direction"]
        Reading["building/{location}/{type}/reading"]
        Status["building/{location}/{type}/status"]
        Command["building/{location}/{type}/command"]
    end
    
    Reading -->|"Subscribe"| NodeRED
    Status -->|"Subscribe"| NodeRED
    NodeRED -->|"Publish"| Command
```
