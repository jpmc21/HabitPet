import { useState } from 'react'

// just using fake data for now until the backend is ready
const fakePet = {
  level: 1,
  hunger: 70,
  mood: 'happy',
  exp: 40,
}

const fakePoints = 50

// the pet looks different depending on what level it is
const PET_EMOJI = {
  1: '🥚',
  2: '🐣',
  3: '🐥',
  4: '🦜',
  5: '🦅',
}

export default function PetCard() {

  // keeping track of pet stats, points, and any message to show the user
  const [pet, setPet] = useState(fakePet)
  const [points, setPoints] = useState(fakePoints)
  const [message, setMessage] = useState('')

  // this runs when the user clicks the feed button
  // costs 5 points, adds 30 hunger
  const handleFeed = () => {
    if (points < 5) {
      setMessage('Not enough points!')
      return
    }
    // subtract points and increase hunger
    // Math.min makes sure hunger never goes above 100
    setPoints(points - 5)
    setPet({ ...pet, hunger: Math.min(100, pet.hunger + 30) })
    setMessage('Fed! 🍖')

    // clear the message after 2 seconds
    setTimeout(() => setMessage(''), 2000)
  }

  // this runs when the user clicks on the pet
  // just sets mood to happy for now
  const handleInteract = () => {
    setPet({ ...pet, mood: 'happy' })
    setMessage('Your pet is happy! 💖')
    setTimeout(() => setMessage(''), 2000)
  }

  // cap the level at 5 so we don't go out of bounds on PET_EMOJI
  const emoji = PET_EMOJI[Math.min(pet.level, 5)] || '🥚'

  return (
    <div style={styles.container}>

      {/* clicking the pet triggers the interact function */}
      <div style={styles.petEmoji} onClick={handleInteract}>
        {emoji}
      </div>

      {/* only show the message if there is one */}
      {message && <p style={styles.message}>{message}</p>}

      {/* basic info */}
      <p style={styles.label}>Level {pet.level}</p>

      {/* hunger bar — orange color */}
      <div style={styles.barRow}>
        <span style={styles.barLabel}>Hunger</span>
        <div style={styles.barBg}>
          <div style={{
            ...styles.barFill,
            width: `${pet.hunger}%`,
            background: '#f4a261'
          }} />
        </div>
        <span style={styles.barNum}>{pet.hunger}/100</span>
      </div>

      {/* exp bar — green color */}
      <div style={styles.barRow}>
        <span style={styles.barLabel}>EXP</span>
        <div style={styles.barBg}>
          <div style={{
            ...styles.barFill,
            width: `${pet.exp}%`,
            background: '#57cc99'
          }} />
        </div>
        <span style={styles.barNum}>{pet.exp}/100</span>
      </div>

      {/* show a different emoji depending on mood */}
      <p style={styles.label}>
        Mood: {pet.mood === 'happy' ? '😊' : pet.mood === 'neutral' ? '😐' : '😢'}
      </p>

      <p style={styles.label}>Points: {points}</p>

      {/* feed button */}
      <button style={styles.button} onClick={handleFeed}>
        Feed (5 pts)
      </button>

    </div>
  )
}

// all the styles in one place at the bottom
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