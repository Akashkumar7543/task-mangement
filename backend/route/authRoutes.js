import express from "express"
import { getProfile, login, register, updateProfile, uploadImage } from "../controller/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddlewaare.js";
const route = express.Router();

route.post("/register", register)
route.post("/login", login)
route.get("/profile", protect, getProfile)
route.put("/profile", protect, updateProfile)
route.post("/upload-image", upload.single("image"), uploadImage)

export default route;