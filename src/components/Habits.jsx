import { useState } from "react"
import { useHabits } from "../hooks/useHabits";
import HabitModal from "./HabitModal";
import styles from "./Habits.module.css";
import background from '../assets/background.png'

export default function Habits({ dataChanged }) {
    //Gets habit data and habit related functions from the hook useHabits
    //Allows us to add, delete, edit, and toggle habits
    const {
        habits,
        addHabit,
        deleteHabit,
        editHabit,
        toggleHabit,
    } = useHabits(dataChanged);

    //creates a defualt empty habit object
    //so when you go to add one its empty, or it resets it after you close the modal
    const emptyHabit = {
        title: "",
        description: "",
        frequency: "daily"
    };

    //Controls if a modal is visible
    const [isModalOpen, setIsModalOpen] = useState(false);

    //Stores the hbait currently being created or edited inside the modal
    const [modalHabit, setModalHabit] = useState(emptyHabit);

    //Checks if the modal is used to edit or add a new habit
    const [modalMode, setModalMode] = useState("add");

    //Stores the index of the habit being edited
    //It is null if your adding a new habit
    const [editingIndex, setEditingIndex] = useState(null);

    //Stores which habit description is currently being open
    //Its null if no description is open
    const [openDescription, setOpenDescription] = useState(null);

    //Opens a blank modal in add mode
    const openAddModal = () => {
        setModalMode("add");
        setModalHabit(emptyHabit);
        setEditingIndex(null);
        setIsModalOpen(true);
    }

    //Opens the modal in edit mode and displays the selected habit's data
    const openEditModal = (index) => {
        setModalMode("edit");

        //Copys the habits values into modalHabit
        setModalHabit({
            title: habits[index].title || "",
            description: habits[index].description || "",
            frequency: habits[index].frequency || "daily",
        });

        setEditingIndex(index);
        setIsModalOpen(true);
    }

    //Closes the modal and resets the editing state
    const closeModal = () => {
        setModalHabit(emptyHabit);
        setEditingIndex(null);
        setIsModalOpen(false);
    }

    //Saves the habit from the modal
    //If the modal was in add mode it creates a new habit
    //If the modal was in edit mode it updates the changes to the habit
    const handleSaveHabit = () => {
        if (modalHabit.title.trim() === "") return;

        if (modalMode === "add") {
            addHabit(modalHabit);
        } else {
            editHabit(editingIndex, modalHabit);
        }

        closeModal();
    }

    //Opens or closes the description for a habit
    //GenAI prompt: Can you create a react function that toggles open a description box
    //GenAI start
    const toggleDescription = (index) => {
        setOpenDescription((prevIndex) =>
            prevIndex === index ? null : index
        );
    };
    //GenAI end
    //GenAI reflection: After reviewing the code it mainly fulfills the task I needed it to do. 
    // I changed some of the parameters

    return (
        <div className={styles.container} style={{ backgroundImage: `url(${background})` }}>
            <h1>My Habits</h1>

            {/* Button to open the modal to add a new habit */}
            <button data-testid="add-habit-btn" className={styles.addButton} onClick={openAddModal}>
                Add Habit
            </button>

            {/* Calls HabitModal to display the modal when isModalOpen is true*/}
            {isModalOpen && (
                <HabitModal
                    mode={modalMode}
                    habit={modalHabit}
                    setHabit={setModalHabit}
                    onSave={handleSaveHabit}
                    onCancel={closeModal}
                />
            )}

            {/* Displays the habits */}
            <ul className={styles.habitList}>
                {habits.map((habit, index) => (
                    <li className={styles.habitItem} key={habit._id || index}>

                        {/* Button to display or hide the description */}
                        <button
                            type="button"
                            onClick={() => toggleDescription(index)}
                            className={styles.descriptionToggle}
                            data-testid={`description-toggle-btn-${index}`}
                        >
                            {openDescription === index ? "Hide" : "Details"}
                        </button>

                        {/* Button to mark the habits as done or to undo it*/}
                        <button
                            data-testid={`toggle-btn-${index}`}
                            onClick={() => toggleHabit(index)}
                            className={habit.isCompletedToday ? styles.undoBtn : styles.doneBtn}
                        >
                            {habit.isCompletedToday ? "Undo" : "Done"}
                        </button>

                        {/* If the habit is not completed, you can click the title to edit it 
                            It will open the modal in edit mode.
                            This feature is disabled if you mark the habit as done */}
                        <span
                            data-testid={`habit-title-${index}`}
                            onClick={() => !habit.isCompletedToday && openEditModal(index)}
                            className={`${styles.habitText} ${habit.isCompletedToday ? styles.completed : ""}`}
                        >
                            {habit.title}
                        </span>

                        {/* Displays the habit reward */}
                        <span className={styles.habitReward} data-testid={`habit-reward-${index}`}>
                            {habit.reward}
                        </span>

                        {/* Button to delete the selected habit */}
                        <button
                            data-testid={`delete-btn-${index}`}
                            onClick={() => deleteHabit(index)}
                            className={styles.deleteButton}
                        >
                            Delete
                        </button>

                        {/* Displays the description when the habits details are open */}
                        {openDescription === index && (
                            <div className={styles.habitDescription} data-testid={`habit-description-${index}`}>
                                {habit.description || "No description added."}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}