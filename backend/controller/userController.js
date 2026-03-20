import Task from "../model/Task.js"
import User from "../model/User.js"

export const getAllUser = async(req, res) => {
    try {
        const users = await User.find({ role: "member" }).select("-password");
        const userWithTaskCount = await Promise.all(
            users.map(async(user) => {
                const pendingTasks = await Task.countDocuments({
                    assignedTo: user._id,
                    status: "Pending"
                })
                const inProgressTasks = await Task.countDocuments({
                    assignedTo: user._id,
                    status: "In Progress"
                })
                const completedTasks = await Task.countDocuments({
                    assignedTo: user._id,
                    status: "Completed"
                })
                return {
                    ...user._doc,
                    pendingTasks,
                    inProgressTasks,
                    completedTasks
                }
            })
        )
        res.status(200).json(userWithTaskCount)
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

export const getUserById = async(req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password")
        if (!user) return res.status(400).json({ message: "User not found" });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

export const deleteUser = async(req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}