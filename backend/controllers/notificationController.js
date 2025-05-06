import NotificationModel from "../models/notificationModel.js";

// Create Notification
export const createNotification = async (req, res) => {
    try {
        const { userId, message, type } = req.body;

        const notification = new NotificationModel({ userId, message, type });
        await notification.save();

        res.json({ success: true, notification });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get Notifications
export const getNotifications = async (req, res) => {
    try {
        const { userId } = req.body; // Extract userId from req.body (set by authUser middleware)
        
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is missing" });
        }

        const notifications = await NotificationModel.find({ userId }).sort({ createdAt: -1 });

        res.json({ success: true, notifications });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Mark Notification as Read
export const markNotificationAsRead = async (req, res) => {
    try {
        const { notificationId } = req.body;

        await NotificationModel.findByIdAndUpdate(notificationId, { isRead: true });

        res.json({ success: true, message: "Notification marked as read" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};
