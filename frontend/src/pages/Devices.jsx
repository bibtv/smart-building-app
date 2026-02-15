import React, { useState, useEffect } from 'react'
import axios from 'axios'

function Devices() {
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDevices()
  }, [])

  const fetchDevices = async () => {
    try {
      const response = await axios.get('/api/devices')
      setDevices(response.data)
    } catch (error) {
      console.error('Error fetching devices:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="devices">
      <h2>🔌 Devices</h2>
      <button>+ Add Device</button>
      <div className="device-list">
        {devices.map(device => (
          <div key={device.id} className="device-card">
            <h3>{device.name}</h3>
            <p>Type: {device.type}</p>
            <p>Status: <span className={device.status}>{device.status}</span></p>
            <p>Last Seen: {new Date(device.lastSeen).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Devices
