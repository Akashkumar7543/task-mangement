import express from "express"
import { adminOnly, protect } from "../middlewares/authMiddleware.js";
import { exportTasksReport, exportUsersReport } from "../controller/reportController.js";
const route = express.Router();


route.get("/export/tasks", protect, adminOnly, exportTasksReport);
route.get("/export/users", protect, adminOnly, exportUsersReport);

export default route;