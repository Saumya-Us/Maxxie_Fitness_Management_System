import express from 'express';
import mongoose from 'mongoose';
import colors from "colors";
import morgan from "morgan";
import cors from "cors";
import dotenv from 'dotenv';
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

// Routes
import supplementRoutes from "./routes/supplementRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import workoutPlanRoutes from './routes/workoutPlanRoutes.js';
import dietPlanRoutes from './routes/dietPlanRoutes.js';
import membershipPlanRoutes from './routes/membershipPlanRoutes.js';
import userRouters from "./routes/user.js";
import workoutFeedbackRoutes from './routes/workoutFeedbackRoutes.js';
import appointmentRoutes from './routes/appointment.js';
import sessionRoutes from './routes/sessions.js';
import financeRoutes from './routes/finance.js';

// Load environment variables from .env
dotenv.config();

const app = express();

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan("dev"));
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Default Route
app.get("/", (req, res) => {
  res.send("Welcome to the Supplement Store API!");
});

// MongoDB Connection
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI not found in environment variables.'.red);
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...'.green.bold);
  } catch (err) {
    console.error(err.message.red);
    process.exit(1); // Exit process with failure
  }
};

// Connect to MongoDB
connectDB();

// Routes
app.use("/user", userRouters);
app.use('/api/workout-plans', workoutPlanRoutes);
app.use('/api/diet-plans', dietPlanRoutes);
app.use('/api/membership-plans', membershipPlanRoutes);
app.use("/api/supplements", supplementRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/workout-feedback', workoutFeedbackRoutes);
app.use('/api/appointment', appointmentRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/finance', financeRoutes);

import dietFeedbackRoute from './routes/dietFeedbackRoute.js';
app.use('/api/diet-feedback', dietFeedbackRoute);


// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from uploads directory
app.use("/uploads", express.static(uploadsDir));

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack.red);
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Set the port and start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`.yellow.bold));
