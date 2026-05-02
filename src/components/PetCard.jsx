import { useState } from "react"

// import all 10 pet images
import egg from '../assets/egg.png'
import baby_neutral from '../assets/baby_neutral.png'
import baby_happy from '../assets/baby_happy.png'
import baby_sad from '../assets/baby_sad.png'
import teen_neutral from '../assets/teen_neutral.png'
import teen_happy from '../assets/teen_happy.png'
import teen_sad from '../assets/teen_sad.png'
import adult_neutral from '../assets/adult_neutral.png'
import adult_happy from '../assets/adult_happy.png'
import adult_sad from '../assets/adult_sad.png'
import background from '../assets/background.png'

// fake data until backend is ready
// change level and mood here to test different images
const fakePet = {
  level: 0,        // 0 = egg, 1 = baby, 2 = teen, 3 = adult
  fullness: 70,    // 0 to 100
  mood: 'neutral', // 'neutral', 'happy', or 'sad'
  exp: 0,          // 0 to 100
}

const fakePoints = 50

// picks the right image based on level and mood
function getPetImage(level, mood) {
  // level 0 is always the egg, no mood variation
  if (level === 0) return egg

  // level 1 = baby
  if (level === 1) {
    if (mood === 'happy') return baby_happy
    if (mood === 'sad') return baby_sad
    return baby_neutral
  }

  // level 2 = teen
  if (level === 2) {
    if (mood === 'happy') return teen_happy
    if (mood === 'sad') return teen_sad
    return teen_neutral
  }

  // level 3 = adult
  if (mood === 'happy') return adult_happy
  if (mood === 'sad') return adult_sad
  return adult_neutral
}

export default function PetCard() {

  // values that can change and will update the screen when they do
  const [pet, setPet] = useState(fakePet)
  const [points, setPoints] = useState(fakePoints)
  const [message, setMessage] = useState('')

  // runs when user clicks the feed button
  // costs 5 points, adds 30 fullness, mood goes happy then back to neutral after 1 min
  const handleFeed = () => {

    // stop here if not enough points
    if (points < 5) {
      setMessage('Not enough points!')
      return
    }

    // subtract 5 points
    setPoints(points - 5)

    // increase fullness by 30, never go above 100
    // also set mood to happy so the happy image shows
    setPet({ ...pet, fullness: Math.min(100, pet.fullness + 30), mood: 'happy' })

    setMessage('Fed! 🍖')

    // after 2 seconds, clear the message
    setTimeout(() => {
      setMessage('')
    }, 2000)

    // after 1 minute, go back to neutral mood
    setTimeout(() => {
      setPet(prev => ({ ...prev, mood: 'neutral' }))
    }, 60000)
  }

  // runs when user clicks on the pet image
  // mood goes happy then back to neutral after 1 min
  const handleInteract = () => {

    // set mood to happy so the happy image shows
    setPet({ ...pet, mood: 'happy' })
    setMessage('Your pet is happy! 💖')

    // after 2 seconds, clear the message
    setTimeout(() => {
      setMessage('')
    }, 2000)

    // after 1 minute, go back to neutral mood
    setTimeout(() => {
      setPet(prev => ({ ...prev, mood: 'neutral' }))
    }, 60000)
  }

  // fullness bar color changes based on how full the pet is
  let fullnessColor
  if (pet.fullness > 60) {
    fullnessColor = '#57cc99'  // green = doing fine
  } else if (pet.fullness > 30) {
    fullnessColor = '#f4a261'  // orange = getting hungry
  } else {
    fullnessColor = '#e63946'  // red = very hungry
  }

  // get the right image for current level and mood
  const petImage = getPetImage(pet.level, pet.mood)

  return (
    <div style={styles.container}>

      {/* the pet image — clicking it triggers handleInteract */}
      <img
        src={petImage}
        alt="pet"
        style={styles.petImg}
        onClick={handleInteract}
      />

      {/* only shows up if message is not empty */}
      {message && <p style={styles.message}>{message}</p>}

      {/* level display */}
      <p style={styles.label}>Level {pet.level}</p>

      {/* fullness bar */}
      <div style={styles.barRow}>
        <span style={styles.barLabel}>Fullness</span>
        <div style={styles.barBg}>
          {/* width is a percentage based on fullness value */}
          {/* color changes based on fullnessColor variable above */}
          <div style={{
            width: pet.fullness + '%',
            height: '100%',
            background: fullnessColor,
            borderRadius: '6px',
            transition: 'width 0.3s',
          }} />
        </div>
        <span style={styles.barNum}>{pet.fullness}/100</span>
      </div>

      {/* exp bar — always green for now */}
      <div style={styles.barRow}>
        <span style={styles.barLabel}>EXP</span>
        <div style={styles.barBg}>
          <div style={{
            width: pet.exp + '%',
            height: '100%',
            background: '#57cc99',
            borderRadius: '6px',
            transition: 'width 0.3s',
          }} />
        </div>
        <span style={styles.barNum}>{pet.exp}/100</span>
      </div>

      {/* mood display */}
      <p style={styles.label}>Mood: {pet.mood}</p>

      {/* points display */}
      <p style={styles.label}>Points: {points}</p>

      {/* feed button */}
      <button style={styles.button} onClick={handleFeed}>
        Feed (5 pts)
      </button>

    </div>
  )
}

// all styles are here at the bottom
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '24px',
    minHeight: '100vh',
    width: '100%',
    backgroundImage: 'url(' + background + ')',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  },
  petImg: {
    width: '220px',
    height: '220px',
    objectFit: 'contain',
    cursor: 'pointer',
    marginBottom: '12px',
  },
  message: {
    color: '#333333',
    fontWeight: '500',
    marginBottom: '8px',
    fontSize: '18px',
  },
  label: {
    fontSize: '20px',
    margin: '6px 0',
    color: '#333333',
  },
  barRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
    maxWidth: '360px',
    margin: '6px 0',
  },
  barLabel: {
    width: '70px',
    fontSize: '18px',
    color: '#333333',
  },
  barBg: {
    flex: 1,
    height: '18px',
    background: '#aaaaaa',   // dark gray so its easy to see
    borderRadius: '6px',
    overflow: 'hidden',
  },
  barNum: {
    fontSize: '16px',
    width: '60px',
    textAlign: 'right',
    color: '#333333',
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