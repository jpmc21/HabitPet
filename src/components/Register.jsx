import { useState } from 'react'
import axios from 'axios'

// register page
// user can make a new account here
export default function Register({ onRegister, switchToLogin }) {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    // dont let them use a super short password
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    try {
      // post the new account to the backend
      // used AI, prompt: "how to post with axios in react"
      await axios.post('http://localhost:3001/api/auth/register', {
        username: username,
        password: password,
      })

      // if it worked, go back to login page
      onRegister()

    } catch (err) {
      // if backend sent an error message, show it
      // otherwise show a generic one
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

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>HabitPet 🐱</h2>
      <h3 style={styles.subtitle}>Create Account</h3>

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
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={handlePasswordChange}
          required
        />

        {error !== '' && <p style={styles.error}>{error}</p>}

        <button style={styles.button} type="submit">
          Create Account
        </button>

      </form>

      <p style={styles.switchText}>
        Already have an account?{' '}
        <span style={styles.link} onClick={switchToLogin}>
          Login here
        </span>
      </p>

    </div>
  )
}
// use AI to get a default date and changed base on the page look
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
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