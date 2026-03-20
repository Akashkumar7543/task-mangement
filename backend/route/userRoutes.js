import express from "express"
import { adminOnly, protect } from "../middlewares/authMiddleware.js";
import { getAllUser, getUserById } from "../controller/userController.js";

const route = express.Router();

route.get("/", protect, adminOnly, getAllUser)
route.get("/:id", protect, adminOnly, getUserById)
    // route.delete("/", protect, adminOnly, deleteUser)

export default route;