const express = require("express");
const Profile = require("../models/Profile");

const router = express.Router();

// GET /api/tickets/verify/:ticketId — public
router.get("/verify/:ticketId", async (req, res) => {
  try {
    const profile = await Profile.findOne({ ticketId: req.params.ticketId });
    if (!profile) {
      return res.status(404).json({ valid: false, message: "Invalid ticket." });
    }
    res.json({
      valid: true,
      user: { name: `${profile.firstName} ${profile.lastName}`, role: profile.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
