import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import ConnectDB from "./config/ConnectDB.js";
import userRouter from "./Router/User.router.js";
import StudentRouter from "./Router/StudentRouter.js";
import userAuth from './middleware/userJwtAuth.js';
import rateLimit from 'express-rate-limit';

// DB Connection
ConnectDB();

// __dirname setup for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rate limiter
const limiter = rateLimit({
  windowMs: 1000 * 60, // 1 minute
  max: 6,
  message: "Too Many Requests from this API, Please try again later"
});

const app = express();

// Apply limiter
app.use(limiter);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use("/Uploads", express.static(path.join(__dirname, "Uploads")));

// Routes
app.use("/api/user", userRouter);
app.use(userAuth);
app.use("/api/students", StudentRouter);

// Server
const PORT = process.env.PORT || 4018;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
