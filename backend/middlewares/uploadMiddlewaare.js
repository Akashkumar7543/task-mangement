import multer from "multer";

// ✅ use memory storage (works on Render)
const storage = multer.memoryStorage();

export const upload = multer({ storage });