import { useState } from "react"
import { useHabits } from "../hooks/useHabits";
import HabitModal from "./HabitModal";
import styles from "./Habits.module.css";
import background from '../assets/background.png'

export default function Habits({ dataChanged }) {
    const {
        habits,
        addHabit,
        deleteHabit,
        editHabit,
        toggleHabit,
    } = useHabits(dataChanged);

    const emptyHabit = {
        title: "",
        description: "",
        frequency: "daily"
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalHabit, setModalHabit] = useState(emptyHabit);
    const [modalMode, setModalMode] = useState("add");
    const [editingIndex, setEditingIndex] = useState(null);
    const [openDescription, setOpenDescription] = useState(null);

    const openAddModal = () => {
        setModalMode("add");
        setModalHabit(emptyHabit);
        setEditingIndex(null);
        setIsModalOpen(true);
    }

    const openEditModal = (index) => {
        setModalMode("edit");
       
        setModalHabit({
            title: habits[index].title || "",
            description: habits[index].description || "",
            frequency: habits[index].frequency || "daily",
        });

        setEditingIndex(index);
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setModalHabit(emptyHabit);
        setEditingIndex(null);
        setIsModalOpen(false);
    }

    const handleSaveHabit = (habit) => {
        if (modalHabit.title.trim() === "") return;

        if (modalMode === "add") {
            addHabit(modalHabit);
        } else {
            editHabit(editingIndex, modalHabit);
        }

       closeModal();
    }

    const toggleDescription = (index) => {
    setOpenDescription((prevIndex) =>
        prevIndex === index ? null : index
    );
};

    return (
        <div className={styles.container} style={{ backgroundImage: `url(${background})` }}>
            <h1>My Habits</h1>

            <button className={styles.addButton} onClick={openAddModal}>
                Add Habit
            </button>

            {isModalOpen && (
                <HabitModal
                    mode={modalMode}
                    habit={modalHabit}
                    setHabit={setModalHabit}
                    onSave={handleSaveHabit}
                    onCancel={closeModal}
                />
            )}

            <ul className={styles.habitList}>
                {habits.map((habit, index) => (
                    <li className={styles.habitItem} key={habit._id || index}>
                        <button
                            type="button"
                            onClick={() => toggleDescription(index)}
                            className={styles.descriptionToggle}
                        >
                            {openDescription === index ? "Hide" : "Details"}
                        </button>

                        <button
                            data-testid={`toggle-btn-${index}`}
                            onClick={() => toggleHabit(index)}
                            className={habit.isCompletedToday ? styles.undoBtn : styles.doneBtn}
                        >
                            {habit.isCompletedToday ? "Undo" : "Done"}
                        </button>
                    
                        <span
                            data-testid={`habit-text-${index}`}
                            onClick={() => !habit.isCompletedToday && openEditModal(index)}
                            className={`${styles.habitText} ${habit.isCompletedToday ? styles.completed : ""}`}
                        >
                            {habit.title}
                        </span>

                        <span className={styles.habitReward}>
                            {habit.reward}
                        </span>

                        <button
                            data-testid={`delete-btn-${index}`}
                            onClick={() => deleteHabit(index)}
                            className={styles.deleteButton}
                        >
                            Delete
                        </button>
                        {openDescription === index && (
                            <div className={styles.habitDescription}>
                            {habit.description || "No description added."}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}