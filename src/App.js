import axios from 'axios'
import PetCard from './components/PetCard'
import Habits from './components/Habits'
import Login from './components/Login'
import Register from './components/Register'
import { useState, useEffect } from 'react'

import './App.css'

function App() {
  // check if user was already logged in before
  // used AI, prompt: "how to get item from localStorage in react"
  const [token, setToken] = useState(localStorage.getItem('token'))

  // tracks which page to show when not logged in
  const [page, setPage] = useState('login')

  const [isvalidating, setIsValidating] = useState(true)

useEffect(() => {
async function verifyToken() {
  if (!token) {
    setIsValidating(false)
    return
  }
try {
  await axios.get('http://localhost:5000/api/auth/verify', {
    headers: {Authorization: `Bearer ${token}`}
  })
  setIsValidating(false)


} catch (error) {
  console.error("Token is invalid or expired. Logging out...")
  localStorage.removeItem('token')
  setToken(null)
  setIsValidating(false)
}
}
verifyToken()
}, [token])


  function handleLogin(newToken) {
    // login worked, save token
    setToken(newToken)
  }

  function handleRegister() {
    // register done, go back to login
    setPage('login')
  }

  function handleLogout() {
    // clear token so user is logged out
    localStorage.removeItem('token')
    setToken(null)
    setPage('login')
  }

  if (isvalidating) {
  return (
    <div className="App">
      <header className="App-header">
        <h2>Loading Habit...</h2>
      </header>
    </div>
  )
}

  // not logged in yet, show login or register
  if (!token) {
    if (page === 'register') {
      return (
        <Register
          onRegister={handleRegister}
          switchToLogin={function () { setPage('login') }}
        />
      )
    }
    return (
      <Login
        onLogin={handleLogin}
        switchToRegister={function () { setPage('register') }}
      />
    )
  }

  // logged in, show main app
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={handleLogout}>Logout</button>
        <Habits />
        <PetCard />
      </header>
    </div>
  )
}

export default App