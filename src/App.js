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
  // used AI, prompt: "how to get item from localStorage in react"
  const [token, setToken] = useState(localStorage.getItem('token'))

  // tracks which page to show when not logged in
  const [page, setPage] = useState('login')
  const [tab, setTab] = useState('pet')
  const [isvalidating, setIsValidating] = useState(true)
  const [hasOutdatedData, setHasOutdatedData] = useState(true)

  const dataChanged = () => {
    setHasOutdatedData(true);
  }

  // useEffect(() => {
  //   if (!token) {
  //     return;
  //   }
  //   const securityGaurd = setInterval(() => {
  //   const currentStorageToken = localStorage.getItem('token');
  //   if (currentStorageToken !== token) {
  //     console.log("Token not the same anymroe, booting to login...");
  //     setToken(null);
  //     localStorage.removeItem('token');
  //     setPage('login');
  //   }
  // }, 1000);
  // return() =>{ 
  //   clearInterval(securityGaurd);
  // };
  // }, [token]);

  console.log(`verifying api url ${API_URL}`);
  useEffect(() => {
    async function verifyToken() {
      const savedtoken = localStorage.getItem('token');
      if (!savedtoken) {
        setPage('login');
        setIsValidating(false);
        return;
      }
      try {
        await axios.get(`${API_URL}/api/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setIsValidating(false)


      } catch (error) {
        console.error("Invalid token on load");
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

  if (isvalidating) {
    view = (
      <div className="App">
        <header className="App-header">
          <h2>Loading Habit...</h2>
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
            <button onClick={() => setTab('habits')} className={tab === 'habits' ? 'tabActive' : 'tab'}>Habits</button>
            <button onClick={() => setTab('pet')} className={tab === 'pet' ? 'tabActive' : 'tab'}>Pet</button>
            <button onClick={() => setTab('stats')} className={tab === 'stats' ? 'tabActive' : 'tab'}>Stats</button>
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