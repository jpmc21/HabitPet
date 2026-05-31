import { useState } from "react"
import { useHabits } from "../hooks/useHabits";
import HabitModal from "./HabitModal";


export default function Habits() {
    const {
        habits,
        addHabit,
        deleteHabit,
        editHabit,
        toggleHabit,
        } = useHabits();

    const[isModalOpen, setIsModalOpen] =useState(false);
    const[modalText, setModalText] = useState("");
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
        
        <button onClick={openAddModal}>
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

        <ul style={styles.habitList}>
            {habits.map((habit, index) => (
            <li style={styles.habitItem} key={habit.id}>
                <input
                    type="checkbox"
                    checked={habit.isCompletedToday || false}
                    onChange={() => toggleHabit(index)}
                />
                <span
                    onClick={() => openEditModal(index)}
                    style={styles.habitText}
                >
                    {habit.title}
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
