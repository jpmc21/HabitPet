import logo from './logo.svg';
import PetCard from './components/PetCard';
import './App.css';
import Habits from './components/Habits';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Habits />
        <PetCard />
      </header>
    </div>
  )
}

export default App