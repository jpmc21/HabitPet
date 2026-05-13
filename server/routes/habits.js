const express = require("express");
const router = express.Router();
const Habit = require("../models/Habit").model; // Adjust path as needed

// Middleware to verify user authentication (assuming you have auth middleware)
const { authenticateUser } = require("../middleware/auth");

// Apply authentication to all habit routes
router.use(authenticateUser);

router.post("/", async (req, res) => {
    try {
        const { title, description, frequency, reward } = req.body;
        
        // Validation
        if (!title) {
            return res.status(400).json({ error: "Title is required" });
        }
        
        const habit = new Habit({
            title,
            description,
            frequency: frequency || "daily",
            reward: reward || 10,
            userId: req.user.id, // Assuming auth middleware sets req.user
            startedAt: new Date(),
            streak: 0,
            exp: 0
        });
          await habit.save();
        
        res.status(201).json({
            success: true,
            message: "Habit created successfully",
            data: habit
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create habit" });
    }
});



// delete an  a habit 
router.delete("/:id", async (req, res) => {
    try {
        const habit = await Habit.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });
        
        if (!habit) {
            return res.status(404).json({ error: "Habit not found" });
        }
        
        res.json({
            success: true,
            message: "Habit deleted successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete habit" });
    }
});

s






module.exports = router;