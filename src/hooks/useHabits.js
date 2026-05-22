import { useState } from "react"

export function useHabits(){
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

    return{
        habits,
        setHabits,
        input,
        setInput,
        deleteHabit,
        editHabit,
        addHabit,
        toggleHabit
    }
    
}