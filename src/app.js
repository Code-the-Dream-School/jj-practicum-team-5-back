const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const favicon = require("express-favicon");
const logger = require("morgan");
const dotenv = require("dotenv");
const photoUpload = require("./middlewares/photoUpload");
const mongoose = require("mongoose");

dotenv.config();

const app = express();

// Routes
const mainRouter = require("./routes/mainRouter");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
// const stepsRouter = require("./routes/stepsRouter.js"); // optional, enable only if implemented

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use(express.static("public"));

// Favicon (make sure /public/favicon.ico exists)
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API routes
app.use("/api/v1", mainRouter);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/auth", authRoutes);
// app.use("/api/v1/steps", stepsRouter); // enable later if needed

// Upload endpoint
app.post("/api/upload", photoUpload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({ url: `/uploads/${req.file.filename}` });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

module.exports = app;
