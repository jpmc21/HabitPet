const express = require("express");
const router = express.Router();
const Habit = require("../models/Habit").model; 
const User = require("../models/User");

const POINTS_ASSIGNMENT = {
  "daily": 10,
  "weekly": 70,
  "monthly": 100,
};

// needed this for the decay stuff
const { applyDecay } = require('../utils/petUtils')

// POST /api/habits - create a new habit
router.post("/", async (req, res) => {
  try {
    const { title, description, frequency, reward } = req.body;

    // title is required
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    // reward must be 10, 15, or 20 — simple, medium, hard
    const pointValue = POINTS_ASSIGNMENT[frequency] || reward || 10;

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

router.get("/stats", async (req, res) => {
  try {
    const { id } = req.query;

    // start with just getting this user's habits
    let query = { userId: req.userId };

    let habits;
    if (id) {
      habits = await Habit.findOne({ _id: req.params.id, userId: req.userId });
    } else {
      habits = await Habit.find(query).sort({ startedAt: -1 });
    }

    // const habit = await Habit.findOne({
    //   _id: req.params.id,
    //   userId: req.userId
    // });

    if (!habits) return res.status(404).json({ error: "Habit not found" });

    const now = new Date();

    // week: last 7 days
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);

    // month: last 30 days
    const monthAgo = new Date(now);
    monthAgo.setDate(now.getDate() - 30);

    // year: last 365 days
    const yearAgo = new Date(now);
    yearAgo.setFullYear(now.getFullYear() - 1);

    const output = [];
    for (let habit of habits) {
      const completionsInWeek = habit.completions.filter(d => new Date(d) >= weekAgo).length;
      const completionsInMonth = habit.completions.filter(d => new Date(d) >= monthAgo).length;
      const completionsInYear = habit.completions.filter(d => new Date(d) >= yearAgo).length;
      output.push({
        title: habit.title,
        startedAt: habit.startedAt,
        totalCompletions: habit.completions.length,
        currentStreak: habit.streak,
        week: completionsInWeek,
        month: completionsInMonth,
        year: completionsInYear,
        alltime: habit.completions.length
      });
    }

    res.json({
      success: true,
      data: output
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch habit stats" });
  }
});



// delete a habit 
router.delete("/:id", async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
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
      userId: req.userId
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
    const { search } = req.query;

    // start with just getting this user's habits
    let query = { userId: req.userId };

    // if search param exists, filter by title
    // $regex lets us do partial matches, $options: 'i' makes it case insensitive
    // used AI, prompt: "how to search by text in mongoose"
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const habits = await Habit.find(query).sort({ startedAt: -1 });

    // add isCompletedToday field to each habit
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const habitsWithStatus = habits.map(habit => {
      const habitObj = habit.toObject();
      // check if lastCompletedAt is today
      habitObj.isCompletedToday = habit.lastCompletedAt && habit.lastCompletedAt >= today;
      return habitObj;
    });

    if (habitsWithStatus.length === 0) {
      return res.json({ success: true, message: "No habits found", data: [] });
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
      userId: req.userId
    });

    if (!habit) {
      return res.status(404).json({ error: "Habit not found" });
    }

    // Update fields
    if (title) habit.title = title;
    if (description !== undefined) habit.description = description;
    if (frequency !== undefined) {
      habit.frequency = frequency;
      habit.reward = POINTS_ASSIGNMENT[frequency] || 10;
    }
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

router.get("/:id/stats", async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!habit) return res.status(404).json({ error: "Habit not found" });



      //[AI usage] prompt: how to filter an array of dates to only return previous week month etc
/*Response: 
To filter an array of dates by the previous week or month in your route, calculate the start and end dates of the previous period, then use the native JavaScript .filter() method to extract dates that fall within that range.1. Previous Week FilterThis function finds Monday and Sunday of the previous week and filters the array.
javascriptconst filterPreviousWeek = (dates) => {
  const now = new Date();
  
  // Get the start of the current week (Sunday or Monday, let's use Monday as day 1)
  const currentDay = now.getDay();
  const diffToMonday = now.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
  const startOfCurrentWeek = new Date(now.setDate(diffToMonday));
  
  // Calculate start and end of the previous week
  const startOfPrevWeek = new Date(startOfCurrentWeek);
  startOfPrevWeek.setDate(startOfPrevWeek.getDate() - 7);
  startOfPrevWeek.setHours(0, 0, 0, 0);

  const endOfPrevWeek = new Date(startOfCurrentWeek);
  endOfPrevWeek.setDate(endOfPrevWeek.getDate() - 1);
  endOfPrevWeek.setHours(23, 59, 59, 999);

  return dates.filter(date => {
    const d = new Date(date);
    return d >= startOfPrevWeek && d <= endOfPrevWeek;
  });
};
*/
      //[AI usage] reflection: i was confused on how to implement the filtering of the completions array, looking over the repsonse of the AI it had useful lines that allowed me to create the logic for these stats:
    const now = new Date();

    // week: last 7 days
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);

    // month: last 30 days
    const monthAgo = new Date(now);
    monthAgo.setDate(now.getDate() - 30);

    // year: last 365 days
    const yearAgo = new Date(now);
    yearAgo.setFullYear(now.getFullYear() - 1);


    
    const completionsInWeek  = habit.completions.filter(d => new Date(d) >= weekAgo).length;
    const completionsInMonth = habit.completions.filter(d => new Date(d) >= monthAgo).length;
    const completionsInYear  = habit.completions.filter(d => new Date(d) >= yearAgo).length;

    res.json({
      success: true,
      data: {
        title: habit.title,
        startedAt: habit.startedAt,
        totalCompletions: habit.completions.length,
        currentStreak: habit.streak,
        week:  completionsInWeek,
        month: completionsInMonth,
        year:  completionsInYear,
        alltime: habit.completions.length
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch habit stats" });
  }
});

// POST /api/habits/:id/complete - mark a habit as completed today
router.post("/:id/complete", async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    const user = await User.findById(req.userId);

    if (!habit) {
      return res.status(404).json({ error: "Habit not found" });
    }

    // Block double-completion
    if (checkIfCompletedToday(habit)) {
      return res.status(400).json({ error: "Habit already completed today" });
    }

    const now = new Date();
    habit.completions.push(now);
    // Check if streak should continue or reset
    //[AI usage] prompt: in JS route using mongoose i want to check if a daily streak is continued or not based on when previously completed
/*
  [ai usage] reponse: 
  To check if a daily streak is continued or broken, compare the date of the last completed task with the current date.Here is the logic:If the difference is exactly 1 day, the streak continues.If the difference is > 1 day, the streak is broken and resets to 1.If the task was already completed today, do nothing.
  router.post('/complete-task', async (req, res) => {
  try {
    const userId = req.user.id; // Assumes user is authenticated via middleware
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to midnight for accurate date comparison
    const lastCompleted = user.lastCompletedDate ? new Date(user.lastCompletedDate) : null;
    lastCompleted?.setHours(0, 0, 0, 0);
    let streak = user.streakCount || 0;
    if (!lastCompleted) {
      // First time completing any task
      streak = 1;
    } else {
      const timeDiff = today.getTime() - lastCompleted.getTime();
      const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Calc
 */
    //[AI usage] reflection: This implementation was difficult for me to come up with with the AI reponse i was able to peice together how to do if for this specific task.

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const lastCompleted = habit.lastCompletedAt ? new Date(habit.lastCompletedAt) : null;
    if (lastCompleted) lastCompleted.setHours(0, 0, 0, 0);

    const streakContinues = lastCompleted && lastCompleted.getTime() === yesterday.getTime();

    habit.streak = streakContinues ? habit.streak + 1 : 1;
    habit.lastCompletedAt = now;
    habit.exp += habit.reward;

    user.points += habit.reward;

    // pet gets exp when u complete a habit
    user.pet.exp += 15;

    await user.save();
    await habit.save();

    res.json({
      success: true,
      message: "Habit completed!",
      data: {
        streak: habit.streak,
        exp: habit.exp,
        reward: habit.reward
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to complete habit" });
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

// undo habit for today
router.post("/:id/undo", async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    const user = await User.findById(req.userId);

    if (!habit) {
      return res.status(404).json({ error: "Habit not found" });
    }
    // cant undo if not completed today
    if (!checkIfCompletedToday(habit)) {
      return res.status(400).json({ error: "not completed today" });
    }

    // rollback everything
    habit.lastCompletedAt = null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    habit.completions = habit.completions.filter(d => {
      const cd = new Date(d);
      cd.setHours(0, 0, 0, 0);
      return cd.getTime() !== today.getTime();
    });

    habit.streak = Math.max(0, habit.streak - 1);
    habit.exp = Math.max(0, habit.exp - habit.reward);
    user.points = Math.max(0, user.points - habit.reward);
    // take away exp if u undo the habit
    user.pet.exp = Math.max(0, user.pet.exp - 15);
    if (user.pet.exp < 0) user.pet.exp = 0;
    habit.markModified('completions');
    await habit.save();
    await user.save();

    res.json({
      success: true,
      message: "undone",
      data: {
        streak: habit.streak,
        exp: habit.exp,
        reward: habit.reward
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to undo habit" });
  }
});

module.exports = router;

