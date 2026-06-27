const express = require("express");
const jwt = require("jsonwebtoken");
const { randomBytes, randomUUID } = require("crypto");
const { body, validationResult } = require("express-validator");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const Profile = require("../models/Profile");
const { generateOtp, saveOtp, verifyOtp } = require("../utils/otp");
const { sendOtpEmail } = require("../utils/email");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const router = express.Router();

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

// POST /api/auth/signup
// Saves an unverified User only — Profile and ticketId are created after OTP is confirmed.
router.post(
  "/signup",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 8 }),
    body("role").isIn(["student", "employee", "other"]),
    body("firstName").notEmpty().trim(),
    body("lastName").notEmpty().trim(),
    body("gender").notEmpty(),
    body("phone").optional().matches(/^\+966\d{9}$/),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const {
      email, password, role, firstName, lastName, gender,
      phone, linkedin, studentId, university, major, gradYear,
      jobTitle, yearsExperience,
    } = req.body;

    try {
      const existing = await User.findOne({ email });
      if (existing && existing.isVerified) {
        return res.status(409).json({ message: "Email already registered." });
      }

      const resent = !!existing;
      const pendingProfile = {
        role, gender,
        ...(phone           !== undefined && { phone }),
        ...(linkedin        !== undefined && { linkedin }),
        ...(studentId       !== undefined && { studentId }),
        ...(university      !== undefined && { university }),
        ...(major           !== undefined && { major }),
        ...(gradYear        !== undefined && { gradYear }),
        ...(jobTitle        !== undefined && { jobTitle }),
        ...(yearsExperience !== undefined && { yearsExperience }),
      };

      let user = existing;
      if (!user) {
        user = new User({ email, password, firstName, lastName, pendingProfile });
        await user.save();
      } else {
        user.password    = password;
        user.firstName   = firstName;
        user.lastName    = lastName;
        user.pendingProfile = pendingProfile;
        await user.save();
      }

      const code = generateOtp();
      await saveOtp(email, code);
      res.status(201).json({ message: "Verification code sent to your email.", resent });
      sendOtpEmail(email, code).catch((err) => console.error("Email send failed:", err));
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error." });
    }
  }
);

// POST /api/auth/verify
// On success: marks user verified, creates Profile + ticketId, clears pendingProfile.
router.post(
  "/verify",
  [body("email").isEmail().normalizeEmail(), body("code").isLength({ min: 6, max: 6 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, code } = req.body;
    try {
      const result = await verifyOtp(email, code);
      if (result === "expired") {
        return res.status(400).json({ message: "Code has expired. Please request a new one.", expired: true });
      }
      if (result === "invalid") {
        return res.status(400).json({ message: "Incorrect code. Please try again." });
      }

      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found." });

      const pending = user.pendingProfile;

      // Mark verified and wipe the temp data
      await User.updateOne(
        { _id: user._id },
        { $set: { isVerified: true }, $unset: { pendingProfile: "" } }
      );

      let profile = await Profile.findOne({ user: user._id });

      if (!profile) {
        // New flow: build profile from data saved during signup
        profile = await Profile.create({
          user:     user._id,
          email:    user.email,
          firstName: user.firstName || "",
          lastName:  user.lastName  || "",
          role:     (pending && pending.role)   || "other",
          gender:   (pending && pending.gender) || "unspecified",
          ...(pending && pending.phone           && { phone:           pending.phone }),
          ...(pending && pending.linkedin        && { linkedin:        pending.linkedin }),
          ...(pending && pending.studentId       && { studentId:       pending.studentId }),
          ...(pending && pending.university      && { university:      pending.university }),
          ...(pending && pending.major           && { major:           pending.major }),
          ...(pending && pending.gradYear        && { gradYear:        pending.gradYear }),
          ...(pending && pending.jobTitle        && { jobTitle:        pending.jobTitle }),
          ...(pending && pending.yearsExperience && { yearsExperience: pending.yearsExperience }),
          ticketId: randomUUID(),
        });
      } else {
        // Transition path: profile already existed (old flow or re-verify).
        // Update with latest signup data and backfill ticketId if missing.
        if (user.firstName)                    profile.firstName   = user.firstName;
        if (user.lastName)                     profile.lastName    = user.lastName;
        if (pending && pending.role)           profile.role        = pending.role;
        if (pending && pending.gender)         profile.gender      = pending.gender;
        if (pending && pending.phone      != null) profile.phone           = pending.phone;
        if (pending && pending.linkedin   != null) profile.linkedin        = pending.linkedin;
        if (pending && pending.studentId  != null) profile.studentId       = pending.studentId;
        if (pending && pending.university != null) profile.university      = pending.university;
        if (pending && pending.major      != null) profile.major           = pending.major;
        if (pending && pending.gradYear   != null) profile.gradYear        = pending.gradYear;
        if (pending && pending.jobTitle   != null) profile.jobTitle        = pending.jobTitle;
        if (pending && pending.yearsExperience != null) profile.yearsExperience = pending.yearsExperience;
        if (!profile.ticketId) profile.ticketId = randomUUID();
        await profile.save();
      }

      const token = signToken(user._id);
      res.json({ token, profile });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error." });
    }
  }
);

// POST /api/auth/login
router.post(
  "/login",
  [body("email").isEmail().normalizeEmail(), body("password").notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ message: "Invalid email or password." });

      const match = await user.comparePassword(password);
      if (!match) return res.status(401).json({ message: "Invalid email or password." });

      if (!user.isVerified) {
        return res.status(403).json({ message: "Email not verified. Please check your inbox.", unverified: true });
      }

      let profile = await Profile.findOne({ user: user._id });
      // Backfill ticketId for accounts created before this change
      if (profile && !profile.ticketId) {
        profile.ticketId = randomUUID();
        await profile.save();
      }
      const token = signToken(user._id);
      res.json({ token, profile });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error." });
    }
  }
);

// POST /api/auth/resend-otp
router.post(
  "/resend-otp",
  [body("email").isEmail().normalizeEmail()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "No account with that email." });
      if (user.isVerified) return res.status(400).json({ message: "Account already verified." });

      const code = generateOtp();
      await saveOtp(email, code);
      res.json({ message: "New verification code sent." });
      sendOtpEmail(email, code).catch((err) => console.error("Email send failed:", err));
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error." });
    }
  }
);

// POST /api/auth/google
// Google verifies the email, so we can create User + Profile + ticketId immediately.
router.post("/google", async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ message: "Missing Google credential." });

  try {
    const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
    const { email, given_name, family_name } = ticket.getPayload();

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        password:   randomBytes(32).toString("hex"),
        firstName:  given_name  || "",
        lastName:   family_name || "",
        isVerified: true,
      });
    } else if (!user.isVerified) {
      user.isVerified = true;
      await user.save();
    }

    let profile = await Profile.findOne({ user: user._id });
    if (!profile) {
      profile = await Profile.create({
        user:      user._id,
        email,
        firstName: given_name  || "",
        lastName:  family_name || "",
        gender:    "unspecified",
        role:      "other",
        ticketId:  randomUUID(),
      });
    } else if (!profile.ticketId) {
      profile.ticketId = randomUUID();
      await profile.save();
    }

    const token = signToken(user._id);
    res.json({ token, profile });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Google sign-in failed. Please try again." });
  }
});

module.exports = router;
