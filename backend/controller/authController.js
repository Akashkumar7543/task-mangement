import bcrypt from "bcryptjs"
import User from "../model/User.js"
import { genrateToken } from "../utils/genrateToken.js";

export const register = async(req, res) => {
    try {
        const { name, email, password, profileImgUrl, adminInviteToken } = req.body;

        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: "User already exsit." });
        }

        let role = "member"
        if (adminInviteToken && adminInviteToken === process.env.ADMIN_INVITE_CODE) {
            role = "admin"
        }

        const slat = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(password, slat);

        const user = await User.create({
            name,
            email,
            password: hashpassword,
            profileImgUrl,
            role
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            password: user.hashpassword,
            profileImgUrl: user.profileImgUrl,
            role: user.role,
            token: genrateToken(user._id)
        })
    } catch (error) {
        res.status(500).json({ message: "Internal Server error", error: error.message });
    }
}

export const login = async(req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invaild Input" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invaild email or password." })
        }

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImgUrl: user.profileImgUrl,
            token: genrateToken(user._id)
        })
    } catch (error) {
        res.status(500).json({ message: "Internal Server error", error: error.message });
    }
}

export const getProfile = async(req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(401).json({ message: "USer not found" });
        }

        res.json(user)
    } catch (error) {
        res.status(500).json({ message: "Internal Server error", error: error.message });
    }
}

export const updateProfile = async(req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        user.name = req.body.name || user.name
        user.email = req.body.email || user.email

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            email: updatedUser.email,
            name: updatedUser.name,
            role: updatedUser.role,
            token: genrateToken(updatedUser._id)
        })
    } catch (error) {
        res.status(500).json({ message: "Internal Server error", error: error.message });
    }
}
export const uploadImage = async(req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const imgUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

        res.status(200).json({
            imgUrl
        });
    } catch (error) {
        res.status(500).json({
            message: "Upload failed",
            error: error.message
        });
    }
};