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
import styles from "./PetCard.module.css"

// fake data until backend is ready
// change level and mood here to test different images
const fakePet = {
  level: 2,        // 0 = egg, 1 = baby, 2 = teen, 3 = adult
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

export default function PetCard({ dataChanged }) {

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
      setPet(prev => {
        let newMood
        if (prev.fullness > 60) {
          newMood = 'happy'
        } else if (prev.fullness > 30) {
          newMood = 'neutral'
        } else {
          newMood = 'sad'
        }
        return { ...prev, mood: newMood }
      })
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
    <div
      className={styles.container}
      style={{ backgroundImage: `url(${background})` }}
    >

      {/* the pet image — clicking it triggers handleInteract */}
      <img
        src={petImage}
        alt="pet"
        className={styles.petImg}
        onClick={handleInteract}
      />

      <p className={styles.message}>{message || '\u00A0'}</p>

      <p className={styles.label}>Level {pet.level}</p>

      {/* fullness bar */}
      <div className={styles.barRow}>
        <span className={styles.barLabel}>Fullness</span>
        <div className={styles.barBg}>
          <div style={{
            width: pet.fullness + '%',
            height: '100%',
            background: fullnessColor,
            borderRadius: '6px',
            transition: 'width 0.3s',
          }} />
        </div>
        <span className={styles.barNum}>{pet.fullness}/100</span>
      </div>

      {/* exp bar */}
      <div className={styles.barRow}>
        <span className={styles.barLabel}>EXP</span>
        <div className={styles.barBg}>
          <div style={{
            width: pet.exp + '%',
            height: '100%',
            background: '#57cc99',
            borderRadius: '6px',
            transition: 'width 0.3s',
          }} />
        </div>
        <span className={styles.barNum}>{pet.exp}/100</span>
      </div>

      <p className={styles.label}>Mood: {pet.mood}</p>
      <p className={styles.label}>Points: {points}</p>

      <button className={styles.button} data-testid="feed-btn" onClick={handleFeed}>
        Feed (5 pts)
      </button>

    </div>
  )
}
