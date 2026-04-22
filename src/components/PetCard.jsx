import { useState } from 'react'

// Fake data — will be replaced with real API data later
const fakePet = {
  level: 1,
  hunger: 70,
  mood: 'happy',
  exp: 40,
}

const fakePoints = 50

// Different pet emoji based on level
const PET_EMOJI = {
  1: '🥚',
  2: '🐣',
  3: '🐥',
  4: '🦜',
  5: '🦅',
}

export default function PetCard() {
  const [pet, setPet] = useState(fakePet)
  const [points, setPoints] = useState(fakePoints)
  const [message, setMessage] = useState('')

  // Feed button handler
  const handleFeed = () => {
    if (points < 5) {
      setMessage('Not enough points!')
      return
    }
    setPoints(points - 5)
    setPet({ ...pet, hunger: Math.min(100, pet.hunger + 30) })
    setMessage('Fed successfully! 🍖')
    setTimeout(() => setMessage(''), 2000)
  }

  // Click pet to interact
  const handleInteract = () => {
    setPet({ ...pet, mood: 'happy' })
    setMessage('Your pet is happy! 💖')
    setTimeout(() => setMessage(''), 2000)
  }

  const emoji = PET_EMOJI[Math.min(pet.level, 5)] || '🥚'

  return (
    <div style={styles.container}>

      {/* Pet emoji — click to interact */}
      <div
        style={styles.petEmoji}
        onClick={handleInteract}
      >
        {emoji}
      </div>

      {/* Feedback message */}
      {message && <p style={styles.message}>{message}</p>}

      {/* Level display */}
      <p style={styles.label}>Level {pet.level}</p>

      {/* Hunger bar */}
      <div style={styles.barRow}>
        <span style={styles.barLabel}>Hunger</span>
        <div style={styles.barBg}>
          <div style={{ ...styles.barFill, width: `${pet.hunger}%`, background: '#f4a261' }} />
        </div>
        <span style={styles.barNum}>{pet.hunger}/100</span>
      </div>

      {/* EXP bar */}
      <div style={styles.barRow}>
        <span style={styles.barLabel}>EXP</span>
        <div style={styles.barBg}>
          <div style={{ ...styles.barFill, width: `${pet.exp}%`, background: '#57cc99' }} />
        </div>
        <span style={styles.barNum}>{pet.exp}/100</span>
      </div>

      {/* Mood display */}
      <p style={styles.label}>
        Mood: {pet.mood === 'happy' ? '😊' : pet.mood === 'neutral' ? '😐' : '😢'}
      </p>

      {/* Points display */}
      <p style={styles.label}>Points: {points}</p>

      {/* Feed button */}
      <button style={styles.button} onClick={handleFeed}>
        Feed (5 pts)
      </button>

    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '24px',
    maxWidth: '360px',
    margin: '0 auto',
  },
  petEmoji: {
    fontSize: '80px',
    cursor: 'pointer',
    userSelect: 'none',
    marginBottom: '12px',
  },
  message: {
    color: 'green',
    marginBottom: '8px',
  },
  label: {
    fontSize: '16px',
    margin: '6px 0',
  },
  barRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
    margin: '6px 0',
  },
  barLabel: {
    width: '60px',
    fontSize: '14px',
  },
  barBg: {
    flex: 1,
    height: '12px',
    background: '#eee',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: '6px',
    transition: 'width 0.3s',
  },
  barNum: {
    fontSize: '12px',
    width: '50px',
    textAlign: 'right',
  },
  button: {
    marginTop: '16px',
    padding: '10px 24px',
    fontSize: '15px',
    cursor: 'pointer',
    borderRadius: '8px',
    border: 'none',
    background: '#f4a261',
    color: 'white',
  },
}