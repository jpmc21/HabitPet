import { useState } from 'react'
import axios from 'axios'
import { API_URL } from '../globals'
import styles from "./Register.module.css"
import background from '../assets/background.png'
import { toast } from 'react-toastify';


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
      toast.error('Password must be at least 6 characters');
      setError('Password must be at least 6 characters');
      return
    }

    try {
      // post the new account to the backend
      // [GenAI Use] Prompt: "How do I send a POST request with axios in a React form and wait for the response before moving on?"
      // [GenAI Use] LLM Response Start
      await axios.post(`${API_URL}/api/auth/register`, {
        username: username,
        password: password,
      })
      // [GenAI Use] LLM Response End
      // [GenAI Use] Reflection: axios.post takes url first then data object. await so we wait for register to finish before switching pages. also figured out err.response.data is where backend error messages live
      toast.success("Account created successfully! Please log in.");

      // if it worked, go back to login page
      onRegister()

    } catch (err) {
      // if backend sent an error message, show it
      // otherwise show a generic one
      if (err.response && err.response.data && err.response.data.message) {
        //   toast.error(err.response.data.message)
        setError(err.response.data.message);
      } else {
        //   toast.error('Something went wrong, try again')
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

  return (

    <div className={styles.container} style={{ backgroundImage: `url(${background})` }} data-testid="register-container">
      <h2 className={styles.title}>HabitPet 🐱</h2>
      <h3 className={styles.subtitle}>Create Account</h3>

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
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={handlePasswordChange}
          data-testid="password-input"
          required
        />

        {error !== '' && <p className={styles.error} data-testid="register-error">
          {error}
        </p>}
        <button className={styles.button} data-testid="register-btn" type="submit">
          Create Account
        </button>
      </form>

      <p className={styles.switchText}>
        Already have an account?{' '}
        <span className={styles.link} onClick={switchToLogin} data-testid="login-link">
          Login here
        </span>
      </p>
    </div>
  )
}
