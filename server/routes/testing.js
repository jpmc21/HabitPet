const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.delete('/cleanup-user', async (req, res) => {
    try {
        const deleteUser = await User.findOneAndDelete({ username: req.body.username });

        if (!deleteUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ success: true, message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;