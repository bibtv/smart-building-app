import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'

function Login() {
  const { loginWithRedirect } = useAuth0()

  return (
    <div className="login">
      <h1>🏢 Smart Building</h1>
      <p>IoT Platform for Smart Buildings</p>
      <button onClick={() => loginWithRedirect()}>
        Log In with Auth0
      </button>
    </div>
  )
}

export default Login
