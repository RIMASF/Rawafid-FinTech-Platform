const express = require("express");
const { body, validationResult } = require("express-validator");
const Profile = require("../models/Profile");
const { protect } = require("../middleware/auth");

const router = express.Router();

// GET /api/profile/me
router.get("/me", protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ message: "Profile not found." });
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

// PUT /api/profile/me
router.put(
  "/me",
  protect,
  [
    body("firstName").optional().notEmpty().trim(),
    body("lastName").optional().notEmpty().trim(),
    body("email").optional().isEmail().normalizeEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const allowed = [
      "firstName", "lastName", "gender", "linkedin", "phone",
      "studentId", "university", "major", "gradYear",
      "jobTitle", "yearsExperience",
    ];

    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    try {
      const profile = await Profile.findOneAndUpdate(
        { user: req.user._id },
        updates,
        { new: true, runValidators: true }
      );
      if (!profile) return res.status(404).json({ message: "Profile not found." });
      res.json(profile);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error." });
    }
  }
);

module.exports = router;
