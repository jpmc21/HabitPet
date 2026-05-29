import { useState } from "react"
import styles from "./Habits.module.css" 


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
            <ul className={styles.habitList}>
                {habits.map((habit, index) => (
                    <li className={styles.habitItem} key={index}>
                        <input
                            type="checkbox"
                            checked={habit.completed}
                            onChange={() => toggleHabit(index)}
                        />
                        <span
                            onClick={() => editHabit(index)}
                            className={styles.habitText}
                        >
                            {habit.text}
                        </span>

                        <button
                            onClick={() => deleteHabit(index)}
                            className={styles.deleteButton}
                        >
                            DLT
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}
