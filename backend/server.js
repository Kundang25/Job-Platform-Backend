const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const pool = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const profileRoutes = require("./src/routes/profileRoutes");
const resumeRoutes = require("./src/routes/resumeRoutes");
const jobsRoutes = require("./src/routes/jobsRoutes");
const applicationRoutes = require("./src/routes/applicationRoutes");
const { startAutomation } = require("./src/services/automationService");
const aiRoutes = require("./src/routes/aiRoutes");
const limiter = require("./src/middleware/rateLimiter");
// const errorMiddleware = require("./src/middleware/errorMiddleware");
const { errorMiddleware, notFound } = require("./src/middleware/errorMiddleware");
const advancedAIRoutes = require("./src/routes/advancedAIRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const { startJobScraper } = require("./src/cron/jobScraperCron");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:5173"
  ],
  credentials: true
}));
app.use(helmet());
app.use(morgan("dev"));
app.use(limiter);


app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/advanced-ai", advancedAIRoutes);
app.use("/api/admin", adminRoutes);

startAutomation();
startJobScraper();


app.get("/", (req, res) => {
  res.send("AutoApply AI Backend Running");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running"
  });
});


app.use(notFound);
app.use(errorMiddleware);

const testDBConnection = async () => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("Database Connected:", result.rows[0]);
  } catch (error) {
    console.error("Database Connection Failed:", error.message);
  }
};

testDBConnection();

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});