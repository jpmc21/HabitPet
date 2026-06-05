import { useState, useEffect, useRef } from "react"
import { API_URL } from "../globals"
import axios from 'axios'
import styles from "./Stats.module.css"
import background from '../assets/background.png'



export default function Stats({ token }) {
  const [userInfo, setUserInfo] = useState(null)
  const [habitStats, setHabitStats] = useState(null)
  const [view, setView] = useState('week') //default
  const [selectedHabit, setSelectedHabit] = useState(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [habits, setHabits] = useState([])
  const [currentResults, setCurrentResults] = useState([]);

  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
  }, [search])


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

  useEffect(() => {
    async function fetchHabits() {
      try {
        const [habits, stats] = await Promise.all([
          axios.get(`${API_URL}/api/habits`, { headers }),
          axios.get(`${API_URL}/api/habits/stats`, { headers })
        ]);
        setHabits(habits.data.data || [])
        if (stats.data.success) {
          setHabitStats(stats.data.data)
          console.log(stats)
        }
      } catch (err) {
        setError('Failed to load habits')
      } finally {
        setLoading(false)
      }
    }
    fetchHabits()
  }, [])

  // fetch stats for selected habit
  useEffect(() => {
    if (!selectedHabit) return
    async function fetchHabitStats() {
      try {
        const res = await axios.get(`${API_URL}/api/habits/${selectedHabit._id}/stats`, { headers })
        setHabitStats([res.data.data])
      } catch (err) {
        setError('Failed to load habit stats')
      }
    }
    fetchHabitStats()
  }, [selectedHabit])

  async function handleHabitSelect(habit) {
    setSelectedHabit(habit)
    try {
      const res = await axios.get(`${API_URL}/api/habits/${habit._id}/stats`, { headers })
      setHabitStats([res.data.data])
    } catch (err) {
      setError('Failed to load habit stats')
    }
  }

  //if (loading) return <div className={styles.center}>Loading stats...</div>
  if (error) return <div className={styles.center}>{error}</div>

  if (!userInfo) {
    return (
      <div className={styles.bar}>
        Loading statistics...
      </div>
    )
  }

  let mostCompleted = null
  let leastCompleted = null

  if (habits.length > 0) {
    const sorted = [...habits].sort((a, b) =>
      (b.completions?.length || 0) - (a.completions?.length || 0)
    )
    mostCompleted = sorted[0]
    leastCompleted = sorted[sorted.length - 1]
  }
  const totalCompletions = habits.reduce((sum, h) => sum + (h.completions?.length || 0), 0)

  return (

    <div className={styles.container} style={{ backgroundImage: `url(${background})` }}>
      <h1 className={styles.title}>Your Statistics</h1>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Overview</h2>
        <div className={styles.cardRow}>
          <div className={styles.cardItem}>
            <span className={styles.cardLabel}>Best Streak</span>
            <span className={styles.cardValue}>{userInfo.bestStreak} days</span>
          </div>
          <div className={styles.cardItem}>
            <span className={styles.cardLabel}>All Habits Completed Ever</span>
            <span className={styles.cardValue}>{totalCompletions}</span>
          </div>
          <div className={styles.cardItem}>
            <span className={styles.cardLabel}>Most Completed Task</span>
            <span className={styles.cardValue}>{mostCompleted ? mostCompleted.title : 'N/A'}</span>
          </div>
          <div className={styles.cardItem}>
            <span className={styles.cardLabel}>Least Completed Task</span>
            <span className={styles.cardValue}>{leastCompleted ? leastCompleted.title : 'N/A'}</span>
          </div>
        </div>
      </div>
      {/* here is where it is for individual habit where it toggles between week month and year to show how many times youve completed it  */}

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Individual Habit</h2>

        <div className={styles.toggle}>
          <button className={view === 'week' ? styles.toggleActive : styles.toggleBtn} onClick={() => setView('week')}>Week</button>
          <button className={view === 'month' ? styles.toggleActive : styles.toggleBtn} onClick={() => setView('month')}>Month</button>
          <button className={view === 'year' ? styles.toggleActive : styles.toggleBtn} onClick={() => setView('year')}>Year</button>
        </div>

        <input
          className={styles.search}
          placeholder="Search habits..."
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            console.log(habitStats);
            setCurrentResults(habitStats.filter(h => h.title.toLowerCase().includes(search.toLowerCase())));
            console.log("current results", currentResults)
          }}
        />

        {search !== '' && currentResults && currentResults.map(stat => (
          <div className={styles.habitCard}>
            <p className={styles.habitTitle}>{stat.title}</p>
            <p className={styles.label}>Started: {new Date(stat.startedAt).toLocaleDateString()}</p>
            <p className={styles.label}>Total completions: {stat.totalCompletions}</p>
            <p className={styles.label}>Current streak: {stat.currentStreak} days</p>
            <p className={styles.label}>
              Completions this {view}:{' '}
              {view === 'week' && stat.week}
              {view === 'month' && stat.month}
              {view === 'year' && stat.year}
            </p>
          </div>
        ))}

        {/* {search && (
          <ul className={styles.dropdown}>
            {filteredHabits.map(h => (
              <li
                key={h._id}
                className={styles.dropdownItem}
                onClick={() => { setSelectedHabit(h); setSearch('') }}
              >
                {h.title}
              </li>
            ))}
          </ul>
        )} */}

        {search === '' && habitStats && !selectedHabit && habitStats.map((stat) => (
          <div className={styles.habitCard}>
            <p className={styles.habitTitle}>{stat.title}</p>
            <p className={styles.label}>Started: {new Date(stat.startedAt).toLocaleDateString()}</p>
            <p className={styles.label}>Total completions: {stat.totalCompletions}</p>
            <p className={styles.label}>Current streak: {stat.currentStreak} days</p>
            <p className={styles.label}>
              Completions this {view}:{' '}
              {view === 'week' && stat.week}
              {view === 'month' && stat.month}
              {view === 'year' && stat.year}
            </p>
          </div>
        ))}

        {/* {selectedHabit && habitStats ? (
          <div className={styles.habitCard}>
            <p className={styles.habitTitle}>{habitStats.title}</p>
            <p className={styles.label}>Started: {new Date(habitStats.startedAt).toLocaleDateString()}</p>
            <p className={styles.label}>Total completions: {habitStats.totalCompletions}</p>
            <p className={styles.label}>Current streak: {habitStats.currentStreak} days</p>
            <p className={styles.label}>
              Completions this {view}:{' '}
              {view === 'week' && habitStats.week}
              {view === 'month' && habitStats.month}
              {view === 'year' && habitStats.year}
            </p>
          </div>
        ) : (
          <p className={styles.empty}>Search and select a habit to see its stats.</p>
        )} */}
      </div>
    </div>

  )
}
