
const express = require("express");
const router = express.Router();
const Habit = require("../models/Habit").model; // Adjust path as needed

// Middleware to verify user authentication (assuming you have auth middleware)
// const { authenticateUser } = require("../middleware/auth");

// Apply authentication to all habit routes
// router.use(authenticateUser);


// POST /api/habits - create a new habit
router.post("/", async (req, res) => {
    try {
        const { title, description, frequency, reward } = req.body;
        req.user = {id: "test"};
        
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

    // reward must be 10, 15, or 20 — simple, medium, hard
    const validRewards = [10, 15, 20];
    const pointValue = validRewards.includes(reward) ? reward : 10;

    const habit = new Habit({
      title,
      description,
      frequency: frequency || "daily",
      reward: pointValue,
      userId: req.userId,
      startedAt: new Date(),
      streak: 0,
      exp: 0
    });

    await habit.save();

    res.status(201).json({
      success: true,
      message: "Habit created!",
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


// GET /api/habits - get all habits, optional search by title
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

        const checkIfCompletedToday = (habit) => true;
        
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

    res.json({
      success: true,
      count: habitsWithStatus.length,
      data: habitsWithStatus
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get habits" });
  }
});


// update habit
router.put("/:id", async (req, res) => {
    try {
        const { title, description, frequency, reward } = req.body;
        
        const habit = await Habit.findOne({
            _id: req.params.id,
            userId: req.user.id
        });
        
        if (!habit) {
            return res.status(404).json({ error: "Habit not found" });
        }
        
        // Update fields
        if (title) habit.title = title;
        if (description !== undefined) habit.description = description;
        if (frequency) habit.frequency = frequency;
        if (reward) habit.reward = reward;
        
        await habit.save();
        
        res.json({
            success: true,
            message: "Habit updated successfully",
            data: habit
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update habit" });
    }
});

function checkIfCompletedToday(habit) {
    if (!habit.lastCompletedAt) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastCompleted = new Date(habit.lastCompletedAt);
    lastCompleted.setHours(0, 0, 0, 0);
    
    return lastCompleted.getTime() === today.getTime();
}

module.exports = router;

