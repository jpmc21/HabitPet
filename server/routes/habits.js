const express = require("express");
const router = express.Router();
const Habit = require("../models/Habit").model; // Adjust path as needed

// Middleware to verify user authentication (assuming you have auth middleware)
// const { authenticateUser } = require("../middleware/auth");

// Apply authentication to all habit routes
// router.use(authenticateUser);

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


// get a single habit 
router.get("/:id", async (req, res) => {
    try {
        const habit = await Habit.findOne({
            _id: req.params.id,
            userId: req.user.id
        });
        
        if (!habit) {
            return res.status(404).json({ error: "Habit not found" });
        }
        
        const habitObj = habit.toObject();
        habitObj.isCompletedToday = checkIfCompletedToday(habit);
        
        res.json({
            success: true,
            data: habitObj
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch habit" });
    }
});



//get all habits 
router.get("/", async (req, res) => {
    try {
        const { frequency, status, sortBy = "-startedAt" } = req.query;
        
        let query = { userId: req.user.id };
        
        // Filter by frequency
        if (frequency) {
            query.frequency = frequency;
        }
        
        // Filter by status (completed today or not)
        if (status === "completed") {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            query.lastCompletedAt = { $gte: today };
        } else if (status === "pending") {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            query.$or = [
                { lastCompletedAt: { $lt: today } },
                { lastCompletedAt: null }
            ];
        }
        
        const habits = await Habit.find(query).sort(sortBy);
        
        // Add computed field for today's completion status
        const habitsWithStatus = habits.map(habit => {
            const habitObj = habit.toObject();
            habitObj.isCompletedToday = checkIfCompletedToday(habit);
            return habitObj;
        });
        
        res.json({
            success: true,
            count: habitsWithStatus.length,
            data: habitsWithStatus
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch habits" });
    }
});

module.exports = router;