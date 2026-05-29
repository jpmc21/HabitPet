import { useState } from "react"

export default function Habits() {
    const [habits, setHabits] = useState([]);
    const [input, setInput] = useState("");

    function deleteHabit(index) {
        setHabits((prev) => prev.filter((habit, i) => i !== index));
    }

    function editHabit(index) {
        const newText = prompt("Edit habit:", habits[index].text);

        if (newText === null || newText.trim() === "") return;

        setHabits((prev) =>
            prev.map((habit, i) =>
                i === index ? { ...habit, text: newText.trim() } : habit));
    }

    function addHabit() {
        if (input.trim() === "") return;

        setHabits((prev) =>
            [...prev, { text: input.trim(), completed: false }]);

        setInput("");
    }

    function toggleHabit(index) {
        setHabits((prev) =>
            prev.map((habit, i) =>
                i === index ? { ...habit, completed: !habit.completed } : habit));
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
                            style={habit.completed ? styles.doneButton : styles.checkButton}
                        >
                            {habit.completed ? "Done" : "Check"}
                        </button>

                        <span
                            onClick={() => editHabit(index)}
                            style={{
                                ...styles.habitText,
                                textDecoration: habit.completed ? "line-through" : "none",
                                opacity: habit.completed ? 0.6 : 1
                            }}
                        >
                            {habit.text}
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
    )
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