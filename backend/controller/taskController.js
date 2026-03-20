import Task from "../model/Task.js"

export const getTasks = async(req, res) => {
    try {
        const { status } = req.query;
        let filter = {}

        if (status) {
            filter.status = status
        }

        let tasks;

        if (req.user.role === "admin") {
            tasks = await Task.find(filter).populate(
                "assignedTo",
                "name email profileImgUrl"
            );
        } else {
            tasks = await Task.find({
                ...filter,
                assignedTo: req.user._id, // 🔥 user filter
            }).populate(
                "assignedTo",
                "name email profileImgUrl"
            );
        }

        tasks = await Promise.all(
            tasks.map(async(task) => {
                const completedCount = task.todoChecklist.filter(
                    (items) => items.completed
                ).length
                return {
                    ...task._doc,
                    completedTodoCount: completedCount
                }
            })
        )

        const allTasks = await Task.countDocuments(
            req.user.role === "admin" ? {} : { assignedTo: req.user._id }
        )

        const pendingTasks = await Task.countDocuments({
            ...filter,
            status: "Pending",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id })
        });

        const inProgressTask = await Task.countDocuments({
            ...filter,
            status: "In Progress",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id })
        })

        const completedTasks = await Task.countDocuments({
            ...filter,
            status: "Completed",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id })
        });

        res.status(200).json({
            tasks,
            statusSummary: {
                pendingTasks,
                inProgressTask,
                completedTasks
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
        console.log(error)
    }
}

export const getTaskByID = async(req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate(
            "assignedTo",
            "name email profileImgUrl"
        )

        if (!task) return res.status(404).json({ message: "Task not found." })

        return res.status(200).json(task)

    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

export const createTasks = async(req, res) => {
    try {
        const {
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            attachments,
            todoChecklist
        } = req.body;

        if (!Array.isArray(assignedTo)) {
            return res.status(400).json({
                message: "assingend to must be an array of user ID"
            });
        }

        const tasks = await Task.create({
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            createdBy: req.user._id,
            todoChecklist,
            attachments
        });

        res.status(201).json({ message: "Taks created succesfully", tasks })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
        console.log(error);
    }
}

export const updateTask = async(req, res) => {
    try {

        const task = await Task.findById(req.params.id)

        if (!task) return res.status(404).json({ message: "Task Not found." })

        task.title = req.body.title || task.title
        task.description = req.body.title || task.description
        task.priority = req.body.priority || task.priority
        task.dueDate = req.body.dueDate || task.dueDate
        task.todoChecklist = req.body.todoChecklist || task.todoChecklist
        task.attachments = req.body.attachments || task.attachments

        if (req.body.assignedTo) {
            if (!Array.isArray(req.body.assignedTo)) {
                return res.status(400).json({ message: "assingend to must be an array of user ID" })
            }
            task.assignedTo = req.body.assignedTo
        }
        const updateTaks = await task.save();
        res.status(200).json({ message: "Task Update succesfully", updateTaks });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

export const deleteTasks = async(req, res) => {
    try {
        const taks = await Task.findById(req.params.id)
        if (!taks) return res.status(404).json({ message: "Taks Not Found" })

        await taks.deleteOne();
        res.status(200).json({ message: "Taks deleted Succesfully." })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

export const updateTaskStatus = async(req, res) => {
    try {
        const task = await Task.findById(req.params.id)
        if (!task) return res.status(404).json({ message: "Task Not Found" })

        const isAssigend = task.assignedTo.some(
            (userId) => userId.toString() === req.user._id.toString()
        );

        if (!isAssigend && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized" })
        }

        task.status = req.body.status || task.status

        if (task.status === "Completed") {
            task.todoChecklist.forEach((item) => (item.completed = true));
            task.progress = 100
        }

        await task.save();

        res.status(200).json({ message: "Task Status Updated", task })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
        console.log(error);
    }
}

export const updateTaskCheckList = async(req, res) => {
    try {
        const { todoChecklist } = req.body
        const task = await Task.findById(req.params.id)

        if (!task) return res.status(404).json({ message: "Task Not Found." })

        if (!task.assignedTo.includes(req.user._id) && req.user.role !== "admin") {
            return res.status(404).json({ message: "Not authorized to udate checklist" });
        }

        task.todoChecklist = todoChecklist

        const completedCount = task.todoChecklist.filter(
            (items) => items.completed
        ).length
        const totalItems = task.todoChecklist.length;
        task.progress = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

        if (task.progress === 100) {
            task.status = "Completed"
        } else if (task.progress > 0) {
            task.status = "In Progress"
        } else {
            task.status = "Pending"
        }

        await task.save()

        res.status(200).json({
            message: "Task checklist updated",
            task
        })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

export const getDashboadData = async(req, res) => {
    try {
        const totalTask = await Task.countDocuments();

        const pendingTask = await Task.countDocuments({ status: "Pending" });
        const completedTask = await Task.countDocuments({ status: "Completed" })

        const overdueTask = await Task.countDocuments({
            status: { $ne: "Completed" },
            dueDate: { $lt: new Date() }
        })

        const taskStatuses = ["Pending", "In Progress", "Completed"];
        const taskDistributionRaw = await Task.aggregate([{
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }])

        const taskDistribution = taskStatuses.reduce((acc, status) => {
            const formatKey = status.replace(/\s+/g, "")
            const found = taskDistributionRaw.find((item) => item._id === status);
            acc[formatKey] = found ? found.count : 0;
            return acc;
        }, {})

        taskDistribution["All"] = totalTask

        const taskPriorities = ["Low", "High", "Medium"]
        const taskPrioritiesLevelsRaw = await Task.aggregate([{
            $group: {
                _id: "$priority",
                count: { $sum: 1 }
            }
        }])

        const taskPrioritiesLevels = taskPriorities.reduce((acc, priority) => {
            const found = taskPrioritiesLevelsRaw.find((item) => item._id === priority);
            acc[priority] = found ? found.count : 0;
            return acc
        }, {});

        const recenttask = await Task.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select("title status priority dueDate createdAt")

        res.status(200).json({
            statistics: {
                totalTask,
                pendingTask,
                completedTask,
                overdueTask
            },
            chats: {
                taskDistribution,
                taskPrioritiesLevels
            },
            recenttask
        })

    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
        console.log(error);
    }
}

export const getUserDashboardData = async(req, res) => {
    try {
        const userId = req.user._id; // Only fetch data for the logged-in user

        // Fetch statistics for user-specific tasks
        const totalTasks = await Task.countDocuments({ assignedTo: userId });

        const pendingTasks = await Task.countDocuments({
            assignedTo: userId,
            status: "Pending"
        });

        const completedTasks = await Task.countDocuments({
            assignedTo: userId,
            status: "Completed"
        });

        const overdueTasks = await Task.countDocuments({
            assignedTo: userId,
            status: { $ne: "Completed" },
            dueDate: { $lt: new Date() },
        });


        // Task distribution by status
        const taskStatuses = ["Pending", "In Progress", "Completed"];

        const taskDistributionRaw = await Task.aggregate([
            { $match: { assignedTo: userId } },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        const taskDistribution = taskStatuses.reduce((acc, status) => {
            const formatKey = status.replace(/\s+/g, "");
            const found = taskDistributionRaw.find(item => item._id === status);
            acc[formatKey] = found ? found.count : 0;
            return acc;
        }, {});
        taskDistribution["All"] = totalTasks;

        // Task distribution by priority
        const taskPriorities = ["Low", "Medium", "High"];

        const taskPriorityLevelsRaw = await Task.aggregate([
            { $match: { assignedTo: userId } },
            {
                $group: {
                    _id: "$priority",
                    count: { $sum: 1 }
                }
            }
        ]);

        const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
            const found = taskPriorityLevelsRaw.find((item) => item._id === priority);
            acc[priority] = found ? found.count : 0;
            return acc;
        }, {});


        // Fetch recent 10 tasks for the logged-in user
        const recentTasks = await Task.find({ assignedTo: userId })
            .sort({ createdAt: -1 })
            .limit(10)
            .select("title status priority dueDate createdAt");


        res.status(200).json({
            statistics: {
                totalTasks,
                pendingTasks,
                completedTasks,
                overdueTasks,
            },
            charts: {
                taskDistribution,
                taskPriorityLevels,
            },
            recentTasks,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}