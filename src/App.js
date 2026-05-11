<<<<<<< HEAD
import PetCard from './components/PetCard'

function App() {
  return (
    <div>
      <PetCard />
=======
import logo from './logo.svg';
import PetCard from './components/PetCard';
import './App.css';
import Habits from './components/Habits';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <Habits />
        <PetCard />
      </header>
>>>>>>> 98cf3f0 (Move habits component into src and update app imports)
    </div>
  )
}

export default App