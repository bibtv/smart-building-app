import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { Pool } from 'pg'
import { Server } from 'socket.io'
import path from 'path'
import { fileURLToPath } from 'url'
import http from 'http'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*'
  }
})

// Middleware
app.use(cors())
app.use(express.json())

// Database
let pool
const initDatabase = async () => {
  if (process.env.DATABASE_URL) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    })
    
    try {
      // Create tables if they don't exist
      await pool.query(`
        CREATE TABLE IF NOT EXISTS devices (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          type VARCHAR(100) NOT NULL,
          location VARCHAR(255),
          status VARCHAR(50) DEFAULT 'online',
          metadata JSONB,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)
      
      await pool.query(`
        CREATE TABLE IF NOT EXISTS sensor_readings (
          id BIGSERIAL PRIMARY KEY,
          device_id INTEGER REFERENCES devices(id) ON DELETE CASCADE,
          sensor_type VARCHAR(100) NOT NULL,
          value NUMERIC(10, 2) NOT NULL,
          unit VARCHAR(50),
          timestamp TIMESTAMPTZ DEFAULT NOW()
        )
      `)
      
      await pool.query(`
        CREATE TABLE IF NOT EXISTS alerts (
          id SERIAL PRIMARY KEY,
          device_id INTEGER REFERENCES devices(id) ON DELETE CASCADE,
          alert_type VARCHAR(100) NOT NULL,
          message TEXT,
          severity VARCHAR(50) DEFAULT 'info',
          acknowledged BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        )
      `)
      
      // Insert mock data if empty
      const result = await pool.query('SELECT COUNT(*) FROM devices')
      if (parseInt(result.rows[0].count) === 0) {
        await pool.query(`
          INSERT INTO devices (name, type, location, status) VALUES
            ('Temperature Sensor 1', 'temperature', 'Floor 1 - Lobby', 'online'),
            ('Temperature Sensor 2', 'temperature', 'Floor 2 - Office', 'online'),
            ('Motion Detector 1', 'motion', 'Floor 1 - Reception', 'online'),
            ('Light Sensor 1', 'light', 'Floor 3 - Meeting Room', 'offline'),
            ('Air Quality Sensor', 'air_quality', 'Floor 2 - Open Area', 'online'),
            ('Humidity Sensor 1', 'humidity', 'Floor 1 - Lobby', 'online'),
            ('Door Sensor 1', 'door', 'Main Entrance', 'online'),
            ('HVAC Controller', 'hvac', 'Basement - Mechanical Room', 'online')
        `)
        console.log('✅ Mock data inserted')
      }
      
      console.log('✅ Database initialized')
    } catch (e) {
      console.log('⚠️ Database init error:', e.message)
    }
  } else {
    console.log('⚠️ DATABASE_URL not set')
    pool = { query: () => Promise.resolve({ rows: [] }) }
  }
}

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: pool ? 'connected' : 'disconnected' })
})

app.get('/api/devices', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM devices ORDER BY created_at DESC')
    res.json(result.rows)
  } catch (error) {
    console.error('Error fetching devices:', error)
    res.json([])
  }
})

app.post('/api/devices', async (req, res) => {
  try {
    const { name, type, location } = req.body
    const result = await pool.query(
      'INSERT INTO devices (name, type, location, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, type, location, 'online']
    )
    res.json(result.rows[0])
  } catch (error) {
    console.error('Error creating device:', error)
    res.status(500).json({ error: 'Failed to create device' })
  }
})

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')))
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
  })
}

// WebSocket for real-time data
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)
  
  socket.on('device-data', async (data) => {
    if (pool) {
      await pool.query(
        'INSERT INTO sensor_readings (device_id, sensor_type, value) VALUES ($1, $2, $3)',
        [data.deviceId, data.sensorType, data.value]
      )
    }
    io.emit('sensor-update', data)
  })
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

const PORT = process.env.PORT || 4000

// Initialize DB then start server
initDatabase().then(() => {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`)
  })
})
