import express from "express"
import { adminOnly, protect } from "../middlewares/authMiddleware.js";
import { createTasks, deleteTasks, getDashboadData, getTaskByID, getTasks, getUserDashboardData, updateTask, updateTaskCheckList, updateTaskStatus } from "../controller/taskController.js";
const route = express.Router();

route.get("/dashboard-data", protect, getDashboadData)
route.get("/user-dashboard-data", protect, getUserDashboardData)

route.post("/", protect, adminOnly, createTasks);
route.get("/", protect, getTasks);
route.get("/:id", protect, getTaskByID);
route.put("/:id", protect, updateTask)
route.delete("/:id", protect, adminOnly, deleteTasks)
route.put("/:id/status", protect, updateTaskStatus)
route.put("/:id/todo", protect, updateTaskCheckList)


export default route;