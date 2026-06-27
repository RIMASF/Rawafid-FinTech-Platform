require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const User = require("./models/User");
const { startScheduler } = require("./scheduler");

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:8080")
  .split(",").map((o) => o.trim());
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.some((o) => origin.startsWith(o))) return cb(null, true);
    cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));
app.use(express.json());

app.use("/api/auth",    require("./routes/auth"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/stats",   require("./routes/stats"));
app.use("/api/tickets", require("./routes/tickets"));

app.get("/api/health", (_, res) => res.json({ status: "ok" }));

app.use((req, res) => res.status(404).json({ message: "Route not found." }));

// Deletes unverified accounts older than 2 hours to prevent DB pollution.
const cleanupUnverified = async () => {
  try {
    const cutoff = new Date(Date.now() - 2 * 60 * 60 * 1000);
    const { deletedCount } = await User.deleteMany({
      isVerified: false,
      createdAt: { $lt: cutoff },
    });
    if (deletedCount > 0) console.log(`Cleanup: removed ${deletedCount} unverified user(s)`);
  } catch (err) {
    console.error("Cleanup error:", err.message);
  }
};

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    cleanupUnverified();
    setInterval(cleanupUnverified, 60 * 60 * 1000); // re-run every hour
    startScheduler();
  })
  .catch((err) => { console.error("DB connection failed:", err); process.exit(1); });
