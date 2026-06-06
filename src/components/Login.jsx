import { useState } from 'react'
import { API_URL } from '../globals'
import axios from 'axios'
import background from '../assets/background.png'
import teenHappy from '../assets/teen_happy.png'
import styles from "./Login.module.css"
import { toast } from 'react-toastify';

// login page
// user types username and password here
export default function Login({ onLogin, switchToRegister }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    // stop page refresh
    e.preventDefault()
    setError('')
    try {
      // send username and password to backend
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        username: username,
        password: password,
      })

      // backend sends back a token if login works
      const token = res.data.token

      // [GenAI Use] Prompt: "In a React app, how do I save a JWT token to localStorage after login so the user stays logged in on refresh?"
      // [GenAI Use] LLM Response Start
      localStorage.setItem('token', token)
      // [GenAI Use] LLM Response End
      // [GenAI Use] Reflection: localStorage persists even after refresh unlike normal variables. save token here, read it back in App.js with getItem so the session restores
      toast.success("Logged in successfully!");
      // send the token back to App.js
      onLogin(token)
    } catch (err) {
      // show backend error if backend sends one
      if (err.response && err.response.data && err.response.data.message) {
        // toast.error(err.response.data.message);
        setError(err.response.data.message);
      } else {
        // toast.error('Something went wrong, try again');
        setError('Something went wrong, try again');
      }
    }
  }

  function handleUsernameChange(e) {
    setUsername(e.target.value)
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value)
  }
  // [GenAI Use] Prompt: "How do I set a background image in React using inline style with an imported image file?"
  // [GenAI Use] LLM Response Start
  // style={{ backgroundImage: `url(${background})` }}
  // [GenAI Use] LLM Response End
  // [GenAI Use] Reflection: backgroundImage has to be a JS object property, wrap the imported img in url(). used inline instead of css because the image is a js import so this was easier
  return (
    <div className={styles.container} style={{ backgroundImage: `url(${background})` }} data-testid="login-container">
      <img src={teenHappy} alt="habitpet" style={{ width: '150px', marginBottom: '8px' }} />
      <h2 className={styles.title}>HabitPet</h2>
      <h3 className={styles.subtitle}>Login</h3>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          className={styles.input}
          placeholder="Username"
          value={username}
          onChange={handleUsernameChange}
          data-testid="username-input"
          required
        />

        <input
          className={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          data-testid="password-input"
          required
        />

        {/* only show error when there is one */}
        {error !== '' && <p className={styles.error}>{error}</p>}

        <button className={styles.button} type="submit" data-testid="login-btn">
          Login
        </button>
      </form>

      <p className={styles.switchText}>
        No account?{' '}
        <span className={styles.link} onClick={switchToRegister} data-testid="register-link">
          Register here
        </span>
      </p>
    </div>
  )
}
