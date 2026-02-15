import React, { useState, useEffect } from 'react'
import axios from 'axios'

function Dashboard() {
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
    <div className="dashboard">
      <h2>📊 Dashboard</h2>
      <div className="stats">
        <div className="stat-card">
          <h3>Total Devices</h3>
          <p>{devices.length}</p>
        </div>
        <div className="stat-card">
          <h3>Online</h3>
          <p>{devices.filter(d => d.status === 'online').length}</p>
        </div>
        <div className="stat-card">
          <h3>Offline</h3>
          <p>{devices.filter(d => d.status === 'offline').length}</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
