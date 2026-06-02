import { useState, useEffect, useRef } from "react"
import { API_URL } from "../globals"
import axios from 'axios'
import styles from "./Stats.module.css" 
import background from '../assets/background.png'



export default function Stats({token}){
      const [userInfo, setUserInfo] = useState(null)
      const [habitStats, setHabitStats] = useState(null)
      const [view, setView] = useState('week') //default
      const [selectedHabit, setSelectedHabit] = useState(null)
      const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [habits, setHabits] = useState([])
    
    
 const headers = { Authorization: `Bearer ${token}` }






  useEffect(() => {
    async function getUserInfo() {
      try {
        const res = await fetch(`${API_URL}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const data = await res.json()

        if (data.success) {
          setUserInfo(data)
        }
      } catch (err) {
        console.log("could not retreive data in stats page", err)
      }
    }

    getUserInfo()
  }, [token])

   if (!userInfo) {
    return (
      <div className={styles.bar}>
        Loading statistics...
      </div>
    )
  }

 async function handleHabitSelect(habit) {
    setSelectedHabit(habit)
    try {
      const res = await axios.get(`${API_URL}/api/habits/${habit._id}/stats`, { headers })
      setHabitStats(res.data.data)
    } catch (err) {
      setError('Failed to load habit stats')
    }
  }

  const filteredHabits = habits.filter(h =>
    h.title.toLowerCase().includes(search.toLowerCase())
  )

  //if (loading) return <div className={styles.center}>Loading stats...</div>
  if (error) return <div className={styles.center}>{error}</div>



return (
<<<<<<< HEAD
     <div className={styles.container} style={{ backgroundImage: `url(${background})` }}>
     <h1>Your Statistics</h1>
    <div>
    <h2> overview</h2>
    </div>
    <div className={styles.bar}>
      <div className={styles.item}>
        <span>Best streak: {userInfo.bestStreak} days</span>
      </div>
      <div className={styles.item}>
        <span>Points: {userInfo.points}</span>
      </div>
      <div className={styles.item}>
        <span>most completed task: {userInfo.bestStreak} days</span>
      </div>
    <div className={styles.item}>
        <span>least completed task: {userInfo.bestStreak} </span>
      </div>
    </div>
    {/* here is where it is for individual habit where it toggles between week month and year to show how many times youve completed it  */}
        <h3> individual stat</h3>
        
 <div >
        <button className={view ==='week' ? styles.toggleActive : styles.toggleBtn}
            onClick={() => setView('week')}
        >Week</button>
        <button className={view === 'month' ? styles.toggleActive : styles.toggleBtn}
            onClick={() => setView('month')}
        >Month</button>
        <button className={view === 'year' ? styles.toggleActive : styles.toggleBtn}
            onClick={() => setView('year')}
        >Year</button>
</div>
    <div>
       {/*here will be how many times youve completed your task in that veiws time frame*/} 
    </div>
     </div>
  )
}
