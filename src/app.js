const express = require('express');
const path = require('path');
const app = express();

const cors = require('cors');
const favicon = require('express-favicon');
const logger = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const photoUpload = require("./middlewares/photoUpload");

dotenv.config();


const mainRouter = require('./routes/mainRouter');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');


// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(express.static('public'));
app.use(favicon(__dirname + '/public/favicon.ico'));

// uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// routes
app.use('/api/v1', mainRouter);
app.use('/api/v1/authRoutes', authRoutes);
app.use("/api/projects", projectRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

// upload route
app.post("/api/upload", photoUpload.single("image"), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    res.json({ url: `/uploads/${req.file.filename}` });
});


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

module.exports = app;
