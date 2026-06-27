const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    role: { type: String, enum: ["student", "employee", "other"], required: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    gender: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    // Student fields
    studentId: { type: String, trim: true },
    university: { type: String, trim: true },
    major: { type: String, trim: true },
    gradYear: { type: String, trim: true },
    // Employee fields
    jobTitle: { type: String, trim: true },
    yearsExperience: { type: String, trim: true },
    // Ticket
    ticketId: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

profileSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret._id;
    delete ret.__v;
    delete ret.user;
    delete ret.createdAt;
    delete ret.updatedAt;
    return ret;
  },
});

module.exports = mongoose.model("Profile", profileSchema);
