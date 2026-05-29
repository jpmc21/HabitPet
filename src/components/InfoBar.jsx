import { useState, useEffect } from "react"
import { API_URL } from "../globals"

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
    <div style={styles.bar}>
      <div style={styles.item}>
        <span>👤</span>
        <span>{userInfo.username}</span>
      </div>

      <div style={styles.item}>
        <span>⭐</span>
        <span>Points: {userInfo.points}</span>
      </div>

      <div style={styles.item}>
        <span>🔥</span>
        <span>Best streak: {userInfo.bestStreak} days</span>
      </div>

      <div style={styles.item}>
        <span>🐱</span>
        <span>Pet: {petName}</span>
      </div>
    </div>
  )
}

const styles = {
  bar: {
    width: "100%",
    padding: "14px 12px",
    background: "linear-gradient(90deg, #fde7c8, #fcefdd)",
    color: "#3b3028",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "14px",
    flexWrap: "wrap",
    boxSizing: "border-box",
    fontSize: "16px",
    borderBottom: "1px solid #f3c89f"
  },

  item: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "rgba(255, 255, 255, 0.88)",
    padding: "8px 14px",
    borderRadius: "18px",
    boxShadow: "0 3px 10px rgba(90, 60, 30, 0.10)"
  }
}