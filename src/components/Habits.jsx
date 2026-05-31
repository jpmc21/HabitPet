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
                    <li style={styles.habitItem} key={index}>
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
