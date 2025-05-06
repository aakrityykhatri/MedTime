import express from "express";
import { createNotification, getNotifications, markNotificationAsRead } from "../controllers/notificationController.js";
import authUser from "../middlewares/authUser.js";

const router = express.Router();

// Get notifications
router.get("/", authUser, getNotifications);

// Create notification
router.post("/create", authUser, createNotification);

// Mark notification as read
router.post("/mark-read", authUser, markNotificationAsRead);

export default router;
