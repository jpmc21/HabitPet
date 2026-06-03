import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../globals";
import { toast } from "react-toastify";

export function useHabits(dataChanged) {
    const [habits, setHabits] = useState([]);

    useEffect(() => {
        async function fetchHabits() {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await axios.get(`${API_URL}/api/habits`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.success) {
                    setHabits(response.data.data);
                    dataChanged();
                }
            } catch (error) {
                console.error("Error fetching habits:", error);
            }
        }

        fetchHabits();
    }, []);

    async function deleteHabit(index) {
        const habitToDelete = habits[index];
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/api/habits/${habitToDelete._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setHabits((prev) => prev.filter((habit, i) => i !== index));
            dataChanged();
        } catch (error) {
            console.error("Error deleting habit:", error);
            toast.error("Failed to delete habit. Please try again.");
        }
    }

    async function editHabit(index, newText) {
        const habitToEdit = habits[index];

        if (!newText || newText.trim() === "") return;

        try {
            const token = localStorage.getItem('token');

            await axios.put(`${API_URL}/api/habits/${habitToEdit._id}`,
                { title: newText.trim() },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setHabits((prev) =>
                prev.map((habit, i) =>
                    i === index ? { ...habit, title: newText.trim() } : habit
                )
            );
            dataChanged();
        } catch (error) {
            console.error("Error editing habit:", error);
            toast.error("Failed to edit habit. Please try again.");
        }
    }

    async function addHabit(text) {
        if (text.trim() === "") return;

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_URL}/api/habits`,
                { title: text.trim() },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setHabits((prev) => [...prev, response.data.data]);
            dataChanged();
        } catch (error) {
            console.error("Error adding habit:", error);
            toast.error("Failed to add habit. Please try again.");
        }
    }

    async function toggleHabit(index) {
        const habitToToggle = habits[index];
        const token = localStorage.getItem('token');
        const alreadyDone = habitToToggle.isCompletedToday || false;

        try {
            if (!alreadyDone) {
                // mark as done
                await axios.post(`${API_URL}/api/habits/${habitToToggle._id}/complete`, 
                    {}, 
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setHabits(prev =>
                    prev.map((h, i) => i === index ? { ...h, isCompletedToday: true } : h)
                );
            } else {
                // undo
                await axios.post(`${API_URL}/api/habits/${habitToToggle._id}/undo`, 
                    {}, 
                    { headers: { Authorization: `Bearer ${token}` }
                });
                setHabits(prev =>
                    prev.map((h, i) => i === index ? { ...h, isCompletedToday: false } : h)
                );
            }
            dataChanged();
        } catch (error) {
            console.error("Error toggling habit:", error);
            toast.error("Failed to update habit. Please try again.");
        }
    }
    

    return {
        habits,
        deleteHabit,
        editHabit,
        addHabit,
        toggleHabit
    };
}