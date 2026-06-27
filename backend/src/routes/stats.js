const express = require("express");
const Stats = require("../models/Stats");
const User = require("../models/User");
const { protect: authMiddleware } = require("../middleware/auth");

const router = express.Router();

// GET /api/stats — public
router.get("/", async (_req, res) => {
  try {
    let stats = await Stats.findOne();
    if (!stats) stats = await Stats.create({});

    const attendees = await User.countDocuments({ isVerified: true });

    res.json({ ...stats.toJSON(), attendees });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

// PUT /api/stats — protected, manually set fintechCompanies, speakers, opportunities
router.put("/", authMiddleware, async (req, res) => {
  const allowed = ["fintechCompanies", "speakers", "opportunities"];
  const update = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      const val = Number(req.body[key]);
      if (!Number.isFinite(val) || val < 0) {
        return res.status(400).json({ message: `Invalid value for ${key}.` });
      }
      update[key] = val;
    }
  }
  if (Object.keys(update).length === 0) {
    return res.status(400).json({ message: "No valid fields provided." });
  }
  try {
    const stats = await Stats.findOneAndUpdate(
      {},
      { $set: update },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    const attendees = await User.countDocuments({ isVerified: true });

    res.json({ ...stats.toJSON(), attendees });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
