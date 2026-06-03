import { useState, useEffect } from "react"
import { API_URL } from "../globals"
import styles from "./InfoBar.module.css"

export default function InfoBar({ token, hasOutdatedData, setHasOutdatedData }) {
  const [userInfo, setUserInfo] = useState(null)
  const [editingName, setEditingName] = useState(false)
  const [petNameInput, setPetNameInput] = useState('')


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

    if (hasOutdatedData) {
      getUserInfo()
      setHasOutdatedData(false)
    }
  }, [token, hasOutdatedData, setHasOutdatedData])

  //name change
  async function handleNameSave() {
  if (petNameInput.trim() === '') return
  try {
    await fetch(`${API_URL}/api/user/pet/name`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name: petNameInput })
    })
    setUserInfo(prev => ({ ...prev, petName: petNameInput }))
    setEditingName(false)
  } catch (err) {
    console.log('failed to save pet name', err)
  }
}

  if (!userInfo) {
    return (
      <div className={styles.bar}>
        Loading info...
      </div>
    )
  }

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

      <div className={styles.item} onClick={() => { setEditingName(true); setPetNameInput(userInfo.petName || '') }}>
  <span>🐱</span>
  {editingName ? (
    <input
      autoFocus
      value={petNameInput}
      onChange={e => setPetNameInput(e.target.value)}
      onBlur={handleNameSave}
      onKeyDown={e => e.key === 'Enter' && handleNameSave()}
      onClick={e => e.stopPropagation()}
      style={{ fontSize: '14px', borderRadius: '6px', border: '1px solid #f4a261', padding: '2px 6px', width: '100px' }}
    />
  ) : (
    <span>Pet: {userInfo.petName || 'Your Pet'}</span>
  )}
</div>
    </div>
  )
}