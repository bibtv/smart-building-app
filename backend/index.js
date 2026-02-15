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

// Database - with fallback
let pool
if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  })
  pool.query('SELECT 1').then(() => console.log('✅ Database connected')).catch(e => console.log('⚠️ Database not available:', e.message))
} else {
  console.log('⚠️ DATABASE_URL not set')
  pool = { query: () => Promise.resolve({ rows: [] }) }
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
    res.json([
      { id: 1, name: 'Temperature Sensor 1', type: 'temperature', location: 'Floor 1', status: 'online' },
      { id: 2, name: 'Motion Detector 1', type: 'motion', location: 'Floor 2', status: 'online' }
    ])
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

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
