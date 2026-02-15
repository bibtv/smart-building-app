import React from 'react'

function Settings() {
  return (
    <div className="settings">
      <h2>⚙️ Settings</h2>
      <div className="settings-section">
        <h3>Notification Preferences</h3>
        <label>
          <input type="checkbox" /> Email alerts for offline devices
        </label>
        <label>
          <input type="checkbox" /> SMS alerts for critical issues
        </label>
      </div>
      <div className="settings-section">
        <h3>API Configuration</h3>
        <label>
          Auth0 Domain:
          <input type="text" placeholder="your-domain.auth0.com" />
        </label>
        <label>
          API Endpoint:
          <input type="text" placeholder="http://localhost:4000" />
        </label>
      </div>
    </div>
  )
}

export default Settings
