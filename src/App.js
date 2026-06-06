import axios from 'axios'
import PetCard from './components/PetCard'
import Habits from './components/Habits'
import Login from './components/Login'
import Register from './components/Register'
import Stats from './components/Stats'
import { useState, useEffect } from 'react'
import InfoBar from './components/InfoBar'
import { API_URL } from './globals'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.css'

function App() {
  // check if user was already logged in before
  // [GenAI Use] Prompt: "In React, how do I read a saved JWT token from localStorage on app load to restore login state?"
  // [GenAI Use] LLM Response Start
  const [token, setToken] = useState(localStorage.getItem('token'))
  // [GenAI Use] LLM Response End
  // [GenAI Use] Reflection: getItem returns null if nothing saved, useState treats null as falsy so login page shows up correctly. this way user stays logged in after refresh

  // tracks which page to show when not logged in
  const [page, setPage] = useState('login')
  const [tab, setTab] = useState('pet')
  const [isValidating, setIsValidating] = useState(true)
  const [hasOutdatedData, setHasOutdatedData] = useState(true)

  const dataChanged = () => {
    setHasOutdatedData(true);
  }


  useEffect(() => {
    async function verifyToken() {
      const savedToken = localStorage.getItem('token');
      if (!savedToken) {
        setPage('login');
        setIsValidating(false);
        return;
      }
      try {
        await axios.get(`${API_URL}/api/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setIsValidating(false)


      } catch {
        localStorage.removeItem('token');
        setToken(null);
        setPage('login');
        setIsValidating(false);
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
    setHasOutdatedData(true)
  }
  let view;

  if (isValidating) {
    view = (
      <div className="App">
        <header className="App-header">
          <h2>Loading HabitPet...</h2>
        </header>
      </div>
    );


    // not logged in yet, show login or register
  } else if (!token) {
    if (page === 'register') {
      view = (
        <Register
          onRegister={handleRegister}
          switchToLogin={function () { setPage('login') }}
        />
      );
    } else {
      view = (
        <Login
          onLogin={handleLogin}
          switchToRegister={function () { setPage('register') }}
        />
      );
    }

    // logged in, show main app
  } else {
    view = (
      <div className="App" data-testid="app-container">
        <InfoBar token={token} hasOutdatedData={hasOutdatedData} setHasOutdatedData={setHasOutdatedData} />
        <header className="App-header">
          <div className="tabs">
            <button data-testid="habits-tab" onClick={() => setTab('habits')} className={tab === 'habits' ? 'tabActive' : 'tab'}>Habits</button>
            <button data-testid="pet-tab" onClick={() => setTab('pet')} className={tab === 'pet' ? 'tabActive' : 'tab'}>Pet</button>
            <button data-testid="stats-tab" onClick={() => setTab('stats')} className={tab === 'stats' ? 'tabActive' : 'tab'}>Stats</button>
          </div>


          {tab === 'pet' && <PetCard token={token} dataChanged={dataChanged} />}
          {tab === 'habits' && <Habits token={token} dataChanged={dataChanged} />}
          {tab === 'stats' && <Stats token={token} dataChanged={dataChanged} />}



          <button data-testid="logout-btn" onClick={handleLogout}>
            Logout
          </button>

        </header>

      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" limit={3} />
      {view}
    </>
  );
}

export default App;