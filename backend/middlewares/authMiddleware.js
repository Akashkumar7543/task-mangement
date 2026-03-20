import jwt from "jsonwebtoken"
import User from "../model/User.js"

//protect route
export const protect = async(req, res, next) => {
    try {
        let token = req.headers.authorization

        if (token && token.startsWith("Bearer")) {
            token = token.split(" ")[1];
            const decoded = jwt.verify(token, process.env.SECRATE_KEY_JWT);
            req.user = await User.findById(decoded.id).select("-password");
            next();
        } else {
            res.status(401).json({
                message: "Not authorized, no token"
            })
        }
    } catch (error) {
        res.status(401).json({ message: "Token failed", error: error.message })
    }
}

//middleware for admin

export const adminOnly = async(req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ message: "Access denied, admin only" })
    }
};