import { useState, useEffect } from "react"
import axios from "axios"
import { API_URL } from "../globals";
import { toast } from "react-toastify";

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

// tweak these to test different images
function getExpPercentage(exp) {
  if (exp >= 300) return 100;
  if (exp >= 200) return ((exp - 200) / 100) * 100;
  if (exp >= 100) return ((exp - 100) / 100) * 100;
  return (exp / 100) * 100;
}
function getExpText(exp) {
  if (exp >= 300) return 'MAX';
  if (exp >= 200) return `${exp - 200}/100`;
  if (exp >= 100) return `${exp - 100}/100`;
  return `${exp}/100`;
}
function getPetImage(level, mood) {
  if (level === 0) return egg;
  if (level === 1) {
    if (mood === 'happy') return baby_happy;
    if (mood === 'sad') return baby_sad;
    return baby_neutral;
  }
  if (level === 2) {
    if (mood === 'happy') return teen_happy;
    if (mood === 'sad') return teen_sad;
    return teen_neutral;
  }
  if (mood === 'happy') return adult_happy;
  if (mood === 'sad') return adult_sad;
  return adult_neutral;
}

export default function PetCard({ token }) {
  const [pet, setPet] = useState(null)
  const [points, setPoints] = useState(0)
  const [message, setMessage] = useState('')
  const [jiggle, setJiggle] = useState(false)

  useEffect(() => {
    async function fetchPetData() {
      try {
        const response = await axios.get(`${API_URL}/api/pets`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setPet(response.data.pet);
        setPoints(response.data.points);
      } catch {
        toast.error('Failed to load pet data.');
      }
    }
    if (token) {
      fetchPetData();
    }
  }, [token])

  const handleFeed = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/pets/feed`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPet(response.data.pet);
      setPoints(response.data.points);

      setMessage('Fed! 🍖');
      toast.success('Your pet is happy! 💖');

      setTimeout(() => setMessage(''), 2000);

      setTimeout(() => {
        setPet(prev => {
          let newMood = 'sad';
          if (prev.fullness > 60) newMood = 'happy';
          else if (prev.fullness > 30) newMood = 'neutral';
          return { ...prev, mood: newMood };
        });
      }, 60000);

    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error('Failed to feed pet. Please try again.');
      }
    }
  }
  const handleInteract = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/pets/interact`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPet(response.data.pet);
      setMessage('Your pet is happy! 💖')
      setJiggle(true)
      setTimeout(() => {
        setMessage('')
        setJiggle(false)
      }, 2000)
      setTimeout(() => {
        setPet(prev => ({ ...prev, mood: 'neutral' }))
      }, 60000)
    } catch {
      toast.error('Failed to interact with pet. Please try again.');
    }
  }
  if (!pet) {
    return <div className={styles.container}>Loading your pet...</div>

  }
  let fullnessColor = '#e63946';
  if (pet.fullness > 60) fullnessColor = '#57cc99';
  else if (pet.fullness > 30) fullnessColor = '#f4a261';
  const petImage = getPetImage(pet.level, pet.mood);
  return (
    <div className={styles.container} style={{ backgroundImage: `url(${background})` }}>
      <img src={petImage} alt="pet" className={styles.petImg + (jiggle ? ' ' + styles.jigglePng : '')} onClick={handleInteract} />
      <p className={styles.message}>{message || '\u00A0'}</p>
      <p className={styles.label}>Level {pet.level}</p>

      {/* fullness bar */}
      <div className={styles.barRow}>
        <span className={styles.barLabel}>Fullness</span>
        <div className={styles.barBg}>
          <div style={{ width: pet.fullness + '%', height: '100%', background: fullnessColor, borderRadius: '6px', transition: 'width 0.3s' }} />
        </div>
        <span className={styles.barNum}>{pet.fullness}/100</span>
      </div>

      {/* exp bar */}
      <div className={styles.barRow}>
        <span className={styles.barLabel}>EXP</span>
        <div className={styles.barBg}>
          <div
            style={{
              width: getExpPercentage(pet.exp) + '%',
              height: '100%',
              background: '#57cc99',
              borderRadius: '6px',
              transition: 'width 0.3s'
            }}
          />
        </div>
        <span className={styles.barNum}>{getExpText(pet.exp)}</span>
      </div>

      <p className={styles.label}>Mood: {pet.mood}</p>
      <p className={styles.label}>Points: {points}</p>

      {/* Feed costs 15 pts */}
      <button className={styles.button} onClick={handleFeed}>
        Feed (15 pts)
      </button>
    </div>
  )
}