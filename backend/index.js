/* eslint-disable no-undef */
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

import cors from "cors"
import { connectDB } from "./config/db.js";
import authRoute from './route/authRoutes.js'
import userRoute from './route/userRoutes.js'
import taskRoute from "./route/taskRoutes.js"
import reportRoute from "./route/reportRoutes.js"

const app = express();

//cors middelware
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://task-mangement-5ysc.vercel.app"
    ],
    credentials: true
}));

//Middelware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// database Connection
connectDB();


//Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/tasks", taskRoute);
app.use("/api/report", reportRoute);

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const port = process.env.PORT

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});