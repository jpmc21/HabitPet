import { useState } from "react"
import { useHabits } from "../hooks/useHabits";
import HabitModal from "./HabitModal";
import styles from "./Habits.module.css";

export default function Habits() {
    const {
        habits,
        addHabit,
        deleteHabit,
        editHabit,
        toggleHabit,
    } = useHabits();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalText, setModalText] = useState("");
    const [modalMode, setModalMode] = useState("add");
    const [editingIndex, setEditingIndex] = useState(null);

    const openAddModal = () => {
        setModalMode("add");
        setModalText("");
        setEditingIndex(null);
        setIsModalOpen(true);
    }

    const openEditModal = (index) => {
        setModalMode("edit");
        setModalText(habits[index].title);
        setEditingIndex(index);
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setModalText("");
        setEditingIndex(null);
        setIsModalOpen(false);
    }

    const handleSaveHabit = () => {
        if (modalText.trim() === "") return;

        if (modalMode === "add") {
            addHabit(modalText);
        } else {
            editHabit(editingIndex, modalText);
        }

        closeModal();
    }

    return (
        <div>
            <h1>My Habits</h1>

            <button className={styles.addButton} onClick={openAddModal}>
                Add Habit
            </button>

            {isModalOpen && (
                <HabitModal
                    mode={modalMode}
                    text={modalText}
                    setText={setModalText}
                    onSave={handleSaveHabit}
                    onCancel={closeModal}
                />
            )}

            <ul className={styles.habitList}>
                {habits.map((habit, index) => (
                    <li className={styles.habitItem} key={index}>
                        <input
                            type="checkbox"
                            checked={habit.isCompletedToday || false}
                            onChange={() => toggleHabit(index)}
                        />
                        <span
                            onClick={() => openEditModal(index)}
                            className={styles.habitText}
                        >
                            {habit.title}
                        </span>

                        <button
                            onClick={() => deleteHabit(index)}
                            className={styles.deleteButton}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}