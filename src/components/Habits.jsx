import { useState } from "react"


export default function Habits() {
    const [habits, setHabits] = useState([]);
    const [input, setInput] = useState("");

    function deleteHabit(index) {
        setHabits((prev) => prev.filter((habits, i) => i !== index));
    }

    function editHabit(index) {
        const newText = prompt("Edit habit:", habits[index].text);

        if (newText === null || newText.trim() === "") return;

        setHabits((prev) => 
            prev.map((habit, i) => 
                i === index ? { ...habit, text: newText.trim() } : habit ));
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
                i === index ? { ...habit, completed: !habit.completed } : habit ));
    }

    return (
    <div>
        <h1>My Habits</h1>
        <input
            type="text"
            placeholder="Enter a habit"
            value={input}
            onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={addHabit}>
            Add Habit
        </button>
        <ul style={styles.habitList}>
            {habits.map((habit, index) => (
            <li style={styles.habitItem} key={index}>
                <input
                    type="checkbox"
                    checked={habit.completed}
                    onChange={() => toggleHabit(index)}
                />
                <span
                    onClick={() => editHabit(index)}
                    style={styles.habitText}
                >
                    {habit.text}
                </span>

                <button
                    onClick={() => deleteHabit(index)}
                    style={styles.deleteButton}
                >
                DLT
                </button>
            </li> 
        ))}
        </ul>
    </div>
    )
}

const styles = {
  habitList: {
    listStyle: "none",
    paddingLeft: 0,
  },

  habitItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "10px",
  },

  habitText: {
    minWidth: "150px",
    textAlign: "left",
    cursor: "pointer",
  },

  deleteButton: {
    marginLeft: "20px",
  },
};