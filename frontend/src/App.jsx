import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import Dashboard from './pages/Dashboard'
import Devices from './pages/Devices'
import Settings from './pages/Settings'
import Login from './pages/Login'

function App() {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0()

  if (!isAuthenticated) {
    return <Login />
  }

  return (
    <BrowserRouter>
      <div className="app">
        <nav>
          <h1>🏢 Smart Building</h1>
          <button onClick={() => logout({ returnTo: window.location.origin })}>
            Log Out
          </button>
        </nav>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/devices" element={<Devices />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
