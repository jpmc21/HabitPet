import { useState } from 'react'
import { API_URL } from '../globals'
import axios from 'axios'
import background from '../assets/background.png'
import teenHappy from '../assets/teen_happy.png'

// login page
// user types username and password here
export default function Login({ onLogin, switchToRegister }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    // stop page refresh
    e.preventDefault()

    // clear old error
    setError('')

    try {
      // send username and password to backend
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        username: username,
        password: password,
      })

      // backend sends back a token if login works
      const token = res.data.token

      // used AI to understand localStorage here
      // save token in browser
      localStorage.setItem('token', token)

      // send the token back to App.js
      onLogin(token)
    } catch (err) {
      // show backend error if backend sends one
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message)
      } else {
        setError('Something went wrong, try again')
      }
    }
  }

  function handleUsernameChange(e) {
    setUsername(e.target.value)
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value)
  }
  // used AI to help with this layout/style part
  return (
    <div style={styles.container}>
      <img src={teenHappy} alt="habitpet" style={{ width: '100px', marginBottom: '8px' }} />
      <h2 style={styles.title}>HabitPet</h2>
      <h3 style={styles.subtitle}>Login</h3>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          style={styles.input}
          placeholder="Username"
          value={username}
          onChange={handleUsernameChange}
          required
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          required
        />

        {/* only show error when there is one */}
        {error !== '' && <p style={styles.error}>{error}</p>}

        <button style={styles.button} type="submit">
          Login
        </button>
      </form>

      <p style={styles.switchText}>
        No account?{' '}
        <span style={styles.link} onClick={switchToRegister}>
          Register here
        </span>
      </p>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundImage: 'url(' + background + ')',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  },

  title: {
    fontSize: '32px',
    marginBottom: '8px',
  },

  subtitle: {
    fontSize: '20px',
    marginBottom: '24px',
    color: '#666',
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    width: '300px',
  },

  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ccc',
  },

  error: {
    color: 'red',
    fontSize: '14px',
    margin: '0',
  },

  button: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '8px',
    border: 'none',
    background: '#f4a261',
    color: 'white',
    cursor: 'pointer',
  },

  switchText: {
    marginTop: '16px',
    fontSize: '14px',
    color: '#666',
  },

  link: {
    color: '#f4a261',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
}