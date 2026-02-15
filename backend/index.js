import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { Pool } from 'pg'
import { Server } from 'socket.io'

dotenv.config()

const app = express()
const server = require('http').createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*'
  }
})

// Middleware
app.use(cors())
app.use(express.json())

// Database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/smartbuilding'
})

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.get('/api/devices', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM devices ORDER BY created_at DESC')
    res.json(result.rows)
  } catch (error) {
    console.error('Error fetching devices:', error)
    res.status(500).json({ error: 'Failed to fetch devices' })
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

// WebSocket for real-time data
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)
  
  socket.on('device-data', async (data) => {
    // Store sensor data
    await pool.query(
      'INSERT INTO sensor_readings (device_id, sensor_type, value) VALUES ($1, $2, $3)',
      [data.deviceId, data.sensorType, data.value]
    )
    
    // Broadcast to all clients
    io.emit('sensor-update', data)
  })
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

const PORT = process.env.PORT || 4000

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
