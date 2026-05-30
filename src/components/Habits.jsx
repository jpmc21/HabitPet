import { useState, useEffect } from "react";
import axios from "axios";

export default function Habits() {
    const [input, setInput] = useState("");
    const [habits, setHabits] = useState([]);

    useEffect(() => {
        async function fetchHabits() {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await axios.get("http://localhost:5000/api/habits", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                if (response.data.success) {
                    setHabits(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching habits:", error);
            }   
        }

        fetchHabits(); 
    }, []);

    async function deleteHabit(index) {
        const habitToDelete = habits[index];
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/habits/${habitToDelete._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setHabits((prev) => prev.filter((habit, i) => i !== index));
        } catch (error) {
            console.error("Error deleting habit:", error);
            alert("Failed to delete habit. Please try again.");
        }
    }

    async function editHabit(index) {
        const habitToEdit = habits[index];
        const newText = prompt("Edit habit:", habitToEdit.title);

        if (newText === null || newText.trim() === "") return;

        try {
            const token = localStorage.getItem('token');
            
            await axios.put(`http://localhost:5000/api/habits/${habitToEdit._id}`, 
                { title: newText.trim() }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            setHabits((prev) => 
                prev.map((habit, i) => 
                    i === index ? { ...habit, title: newText.trim() } : habit
                )
            );
        } catch (error) {
            console.error("Error editing habit:", error);
            alert("Failed to edit habit. Please try again.");
        }
    }

    async function addHabit() {
        if (input.trim() === "") return;
        
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post("http://localhost:5000/api/habits", 
                { title: input.trim() }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            setHabits((prev) => [...prev, response.data.data]);
            setInput("");
        } catch (error) {
            console.error("Error adding habit:", error);
            alert("Failed to add habit. Please try again.");
        }
    }

    async function toggleHabit(index) {
        const habitToToggle = habits[index];
        
        if (habitToToggle.completed || habitToToggle.isCompletedToday) {
            return; 
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:5000/api/habits/${habitToToggle._id}/complete`, 
                {}, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            setHabits((prev) =>
                prev.map((habit, i) =>
                    i === index ? { ...habit, completed: true, isCompletedToday: true } : habit
                )
            );
        } catch (error) {
            console.error("Error toggling habit:", error);
            alert("Failed to complete habit. Please try again.");
        }
    }

    return (
        <div style={styles.container}>
            <h1>My Habits</h1>

            <div style={styles.addBox}>
                <input
                    style={styles.input}
                    type="text"
                    placeholder="Enter a habit"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />

                <button style={styles.addButton} onClick={addHabit}>
                    Add Habit
                </button>
            </div>

            <ul style={styles.habitList}>
                {habits.map((habit, index) => (
                    <li style={styles.habitItem} key={index}>
                        <button
                            onClick={() => toggleHabit(index)}
                            style={(habit.completed || habit.isCompletedToday) ? styles.doneButton : styles.checkButton}
                        >
                            {(habit.completed || habit.isCompletedToday) ? "Done" : "Check"}
                        </button>

                        <span
                            onClick={() => editHabit(index)}
                            style={{
                                ...styles.habitText,
                                textDecoration: (habit.completed || habit.isCompletedToday) ? "line-through" : "none",
                                opacity: (habit.completed || habit.isCompletedToday) ? 0.6 : 1
                            }}
                        >
                            {habit.title}
                        </span>

                        <button
                            onClick={() => deleteHabit(index)}
                            style={styles.deleteButton}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

const styles = {
    container: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    addBox: {
        display: "flex",
        marginBottom: "25px",
    },
    input: {
        width: "280px",
        padding: "11px 16px",
        border: "2px solid #e6b98f",
        borderRadius: "999px 0 0 999px",
        fontSize: "18px",
        outline: "none",
        background: "rgba(255, 255, 255, 0.95)",
        color: "#3b3028",
    },
    addButton: {
        padding: "11px 20px",
        border: "2px solid #e6b98f",
        borderLeft: "none",
        borderRadius: "0 999px 999px 0",
        background: "#f4a261",
        color: "white",
        fontSize: "18px",
        fontWeight: "700",
        cursor: "pointer",
    },
    habitList: {
        listStyle: "none",
        paddingLeft: 0,
        width: "520px",
        maxWidth: "90%",
    },
    habitItem: {
        display: "flex",
        alignItems: "center",
        gap: "14px",
        marginBottom: "12px",
        padding: "12px 16px",
        borderRadius: "20px",
        background: "rgba(255, 255, 255, 0.55)",
        boxShadow: "0 3px 10px rgba(90, 60, 30, 0.08)",
    },
    habitText: {
        flex: 1,
        textAlign: "center",
        fontSize: "22px",
        color: "#3b3028",
        cursor: "pointer",
    },
    checkButton: {
        padding: "8px 14px",
        border: "none",
        borderRadius: "999px",
        background: "#ffffff",
        color: "#8a4f32",
        fontSize: "14px",
        fontWeight: "700",
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(90, 60, 30, 0.10)",
    },
    doneButton: {
        padding: "8px 14px",
        border: "none",
        borderRadius: "999px",
        background: "#f4a261",
        color: "white",
        fontSize: "14px",
        fontWeight: "700",
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(90, 60, 30, 0.10)",
    },
    deleteButton: {
        padding: "8px 14px",
        border: "none",
        borderRadius: "999px",
        background: "#ffe4d1",
        color: "#8a4f32",
        fontSize: "14px",
        fontWeight: "700",
        cursor: "pointer",
    },
};