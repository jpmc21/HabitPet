import { useState, useEffect } from "react"
import { API_URL } from "../globals"
import styles from "./Habits.module.css" 

export default function InfoBar({ token }) {
  const [userInfo, setUserInfo] = useState(null)

  // get the user info for the top bar
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
        console.log("info bar not working", err)
      }
    }

    getUserInfo()
  }, [token])

  if (!userInfo) {
    return (
      <div style={styles.bar}>
        Loading info...
      </div>
    )
  }

  // pet level number looks weird so I use words here
  let petName = "New pet"

  if (userInfo.petLevel === 1) {
    petName = "Baby"
  } else if (userInfo.petLevel === 2) {
    petName = "Teen"
  } else if (userInfo.petLevel === 3) {
    petName = "Adult"
  }

  return (
    <div className={styles.bar}>
      <div className={styles.item}>
        <span>👤</span>
        <span>{userInfo.username}</span>
      </div>

      <div className={styles.item}>
        <span>⭐</span>
        <span>Points: {userInfo.points}</span>
      </div>

      <div className={styles.item}>
        <span>🔥</span>
        <span>Best streak: {userInfo.bestStreak} days</span>
      </div>

      <div className={styles.item}>
        <span>🐱</span>
        <span>Pet: {petName}</span>
      </div>
    </div>
  )
}

