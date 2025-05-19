import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const token = localStorage.getItem("token");

    const fetchNotifications = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/notifications`, {
                headers: { token },
            });
            if (data.success) {
                setNotifications(data.notifications);
                setUnreadCount(data.notifications.filter((n) => !n.isRead).length);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };    

    const markAsRead = async (notificationId) => {
        try {
            await axios.post(
                `${backendUrl}/api/notifications/mark-read`,
                { notificationId },
                { headers: { token } }
            );
            setNotifications((prev) =>
                prev.map((n) =>
                    n._id === notificationId ? { ...n, isRead: true } : n
                )
            );
            setUnreadCount((prev) => prev - 1);
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchNotifications();
        }
    }, [token]);

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, fetchNotifications, markAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationProvider;
