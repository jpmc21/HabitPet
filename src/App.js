import { useState } from 'react'
import PetCard from './components/PetCard'
import Habits from './components/Habits'
import Login from './components/Login'
import Register from './components/Register'
import './App.css'

function App() {

  // check if user was already logged in before
  // used AI, prompt: "how to get item from localStorage in react"
  const [token, setToken] = useState(localStorage.getItem('token'))

  // tracks which page to show when not logged in
  const [page, setPage] = useState('login')

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

  // not logged in yet, show login or register
  if (!token) {
    if (page === 'register') {
      return (
        <Register
          onRegister={handleRegister}
          switchToLogin={function() { setPage('login') }}
        />
      )
    }
    return (
      <Login
        onLogin={handleLogin}
        switchToRegister={function() { setPage('register') }}
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