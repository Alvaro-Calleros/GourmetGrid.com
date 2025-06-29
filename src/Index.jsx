import React from 'react'
import { useState } from 'react'
import Authenticated from './components/Authenticated'
import Welcome from './App'
import Login from './components/Login'

function App() {
  
  const[isAuthenticated, setIsAuthenticated] =  useState(false)
  const[user, setUser] = useState(null)

  const handleLogin = (username) => {
    setIsAuthenticated(true)
    setUser(username)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUser(null)
  }

  return (
    <>
      <section style={{padding: '2rem'}}>
        <Authenticated isAuthenticated={isAuthenticated}>
            <Welcome onLogout={handleLogout} username={user}/>
            <Login onLogin={handleLogin}/>
        </Authenticated>
        
      </section>
    </>
  )
}

export default App
