# Smart Building IoT Platform - Architecture Diagrams

## System Architecture

```mermaid
flowchart TB
    subgraph "IoT Layer"
        direction LR
        Sensors["📡 Sensors"]
        Actuators["🎮 Actuators"]
        Robots🤖["🤖 ROS Robots"]
        Cameras["📷 Cameras"]
    end
    
    subgraph "Communication Layer"
        MQTT[("📨 MQTT Broker")]
        WebSocket[(("🔌 WebSocket"))]
        REST[("🌐 REST API")]
    end
    
    subgraph "Processing Layer"
        NodeRED["🎨 Node-RED"]
        Backend["⚙️ Node.js Backend"]
    end
    
    subgraph "Data Layer"
        PostgreSQL[("🗄️ PostgreSQL")]
        TimescaleDB[("📈 TimescaleDB")]
    end
    
    subgraph "Presentation Layer"
        React["⚛️ React App"]
        Auth0[("🔐 Auth0")]
    end
    
    Sensors --> MQTT
    Actuators --> MQTT
    Robots --> MQTT
    Cameras --> MQTT
    
    MQTT --> NodeRED
    MQTT --> Backend
    
    NodeRED --> PostgreSQL
    Backend --> PostgreSQL
    Backend --> TimescaleDB
    
    React --> REST
    React --> WebSocket
    React --> Auth0
```

---

## Data Flow - Device Reading

```mermaid
sequenceDiagram
    participant Sensor as IoT Sensor
    participant MQTT as MQTT Broker
    participant NodeRED as Node-RED
    participant DB as PostgreSQL
    participant API as Node.js API
    participant UI as React App
    
    Sensor->>MQTT: Publish sensor data
    MQTT->>NodeRED: Forward to flow
    NodeRED->>DB: Store in database
    NodeRED->>API: Send for processing
    API->>DB: Store processed data
    UI->>API: Request current readings
    API-->>UI: Return sensor data
```

---

## Data Flow - Robot Control

```mermaid
sequenceDiagram
    participant User as User
    participant UI as React App
    participant API as Node.js API
    participant NodeRED as Node-RED
    participant MQTT as MQTT Broker
    participant Robot as ROS Robot
    
    User->>UI: Click "Move Robot"
    UI->>API: Send command
    API->>NodeRED: Forward command
    NodeRED->>MQTT: Publish to robot topic
    MQTT->>Robot: Deliver command
    Robot-->>MQTT: Acknowledge
    MQTT-->>NodeRED: Confirmation
    NodeRED-->>API: Status update
    API-->>UI: Show success
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

## System Components

```mermaid
graph TB
    subgraph "External Services"
        Auth0[("Auth0")]
        Railway[("Railway Cloud")]
    end
    
    subgraph "Smart Building Platform"
        Web[🌐 Web App]
        API[⚙️ API Server]
        DB[(🗄️ Database)]
        Flows[🎨 Node-RED]
    end
    
    subgraph "IoT Infrastructure"
        MQTT[📨 MQTT]
    end
    
    Web --> Auth0
    Web --> API
    API --> DB
    Flows --> DB
    Flows --> MQTT
    API --> Flows
```

---

## Deployment Architecture

```mermaid
flowchart LR
    subgraph "Railway Cloud"
        subgraph "Smart Building App"
            Frontend[⚛️ React]
            Backend[⚙️ Node.js]
        end
        Database[(🗄️ PostgreSQL)]
        NodeRED[🎨 Node-RED]
    end
    
    subgraph "IoT Network"
        MQTT[📨 MQTT Broker]
        Devices[📡 IoT Devices]
        Robots🤖[🤖 ROS Robots]
    end
    
    Frontend --> Backend
    Backend --> Database
    Backend --> NodeRED
    NodeRED --> MQTT
    MQTT --> Devices
    MQTT --> Robots
```

---

## Feature Roadmap

```mermaid
gantt
    title Project Timeline
    dateFormat  YYYY-MM-DD
    section Phase 1
    Core Platform       :done,    des1, 2026-01-01, 2026-02-15
    section Phase 2
    IoT Expansion      :active,  des2, 2026-02-16, 2026-04-30
    section Phase 3
    ROS Integration    :         des3, 2026-05-01, 2026-07-31
    section Phase 4
    Advanced Features  :         des4, 2026-08-01, 2026-12-31
```
