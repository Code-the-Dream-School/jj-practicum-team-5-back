import express from "express";
import path from "path";
import cors from "cors";
import logger from "morgan";

import mainRouter from "./routes/mainRouter.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(express.static('public'))


// routes
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));
app.use('/api/v1', mainRouter);
app.use('/api/v1/authRoutes', authRoutes);
app.use('/api/v1/projects', projectRoutes);

export default app;