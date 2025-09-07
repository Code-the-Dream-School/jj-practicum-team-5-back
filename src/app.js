const express = require("express");
const path = require("path");
const app = express();

const cors = require("cors");
const favicon = require("express-favicon");
const logger = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const photoUpload = require("./middlewares/photoUpload");

dotenv.config();

// routes
const mainRouter = require("./routes/mainRouter");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const stepsRouter = require("./routes/stepsRouter.js");

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use(express.static("public"));
app.use(favicon(__dirname + "/public/favicon.ico"));

// uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// routes
app.use("/api/v1", mainRouter);

app.use("/api/v1/steps", stepsRouter);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/auth", authRoutes);


// upload route
app.post("/api/upload", photoUpload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  res.json({ url: `/uploads/${req.file.filename}` });
});

// 404
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
