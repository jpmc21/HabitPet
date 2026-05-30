import { useState } from "react"

export function useHabits(){
    const [habits, setHabits] = useState([]);

    function deleteHabit(index) {
        setHabits((prev) => prev.filter((habit, i) => i !== index));
    }

    function editHabit(index, newText) {

        if (newText.trim() === "") return;

        setHabits((prev) => 
            prev.map((habit, i) => 
                i === index ? { ...habit, text: newText.trim() } : habit ));
    }

    function addHabit(text) {
    if (text.trim() === "") return;

    setHabits((prev) =>
        [...prev, { text: text.trim(), completed: false }]);

    }

    function toggleHabit(index) {
        setHabits((prev) =>
            prev.map((habit, i) =>
                i === index ? { ...habit, completed: !habit.completed } : habit ));
    }

    return{
        habits,
        deleteHabit,
        editHabit,
        addHabit,
        toggleHabit
    }
    
}