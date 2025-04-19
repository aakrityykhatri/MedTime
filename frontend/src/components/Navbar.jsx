import { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { NotificationContext } from "../context/NotificationContext";

const Navbar = () => {
    const navigate = useNavigate();
    const { token, setToken, userData } = useContext(AppContext);
    const { notifications, unreadCount, markAsRead } = useContext(NotificationContext);
    const [showMenu, setShowMenu] = useState(false);
    const [isNotificationsVisible, setIsNotificationsVisible] = useState(false); // Toggle state for notifications

    const toggleNotifications = () => {
        setIsNotificationsVisible((prev) => !prev); // Toggle visibility
    };

    const logout = () => {
        setToken(false);
        localStorage.removeItem('token');
    };

    const defaultProfilePic = assets.profile_pic; // Default profile picture if none exists

    return (
        <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-300">
            {/* Logo + Notifications */}
            <div className="flex items-center">
                {/* Logo */}
                <img
                    onClick={() => navigate('/')}
                    className="w-24 cursor-pointer"
                    src={assets.logo}
                    alt="Logo"
                />

                {/* Notifications */}
{token && (
    <div className="relative ml-2">
        {/* Notification Button */}
        <button
            onClick={toggleNotifications}
            className="relative text-primary hover:text-primary/90 transition-colors"
        >
            {/* Notification Ring Icon */}
            <span className="text-sm">🔔</span>
            {/* Unread Notification Badge */}
            {unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[9px] rounded-full px-1">
                    {unreadCount}
                </span>
            )}
        </button>

        {/* Notifications Dropdown */}
        {isNotificationsVisible && (
            <div className="absolute left-0 mt-2 w-72 bg-white shadow-lg rounded-lg z-20">
                {/* Dropdown Header */}
                <div className="flex justify-between items-center bg-primary text-white px-4 py-3 rounded-t-lg">
                    <h3 className="text-sm font-semibold">Notifications</h3>
                </div>

                {/* Notifications List */}
                <div className="max-h-64 overflow-y-auto">
                    {notifications.length > 0 ? (
                        notifications.map((notif) => (
                            <div
                                key={notif._id}
                                className={`flex items-start gap-3 p-3 border-b cursor-pointer ${
                                    notif.isRead ? 'bg-gray-100' : 'bg-primary/10'
                                } hover:bg-gray-50 transition-colors`}
                                onClick={() => markAsRead(notif._id)}
                            >
                                {/* Notification Details */}
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-800">{notif.message}</p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(notif.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                {/* Unread Indicator */}
                                {!notif.isRead && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="p-4 text-gray-500 text-sm">No notifications</div>
                    )}
                </div>

                {/* Dropdown Footer */}
                <div className="text-center py-2 bg-primary text-white rounded-b-lg">
                    <button
                        onClick={() => navigate('/notifications')}
                        className="text-sm font-medium hover:underline"
                    >
                        See all notifications
                    </button>
                </div>
            </div>
        )}
    </div>
)}
            </div>

            {/* Desktop Navigation */}
            <ul className="hidden md:flex items-start gap-5 font-medium">
                <NavLink
                    to="/"
                    className={({ isActive }) => (isActive ? 'text-primary' : '')}
                >
                    <li className="py-1">HOME</li>
                    <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
                </NavLink>
                <NavLink
                    to="/doctors"
                    className={({ isActive }) => (isActive ? 'text-primary' : '')}
                >
                    <li className="py-1">ALL DOCTORS</li>
                    <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
                </NavLink>
                <NavLink
                    to="/about"
                    className={({ isActive }) => (isActive ? 'text-primary' : '')}
                >
                    <li className="py-1">ABOUT</li>
                    <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
                </NavLink>
                <NavLink
                    to="/contact"
                    className={({ isActive }) => (isActive ? 'text-primary' : '')}
                >
                    <li className="py-1">CONTACT</li>
                    <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
                </NavLink>
            </ul>

            {/* Right Side - Profile/Login & Mobile Menu */}
            <div className="flex items-center gap-4">
                {/* Profile Dropdown or Login Button */}
                {token ? (
                    <div className="flex items-center gap-2 cursor-pointer group relative">
                        <img
                            className="w-8 h-8 rounded-full object-cover"
                            src={userData?.image || defaultProfilePic}
                            alt="Profile"
                            onError={(e) => {
                                e.target.src = defaultProfilePic;
                            }}
                        />
                        <img
                            className="w-2.5"
                            src={assets.dropdown_icon}
                            alt="Dropdown"
                        />
                        {/* Profile Dropdown Menu */}
                        <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
                            <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4 shadow-lg">
                                <p
                                    onClick={() => navigate('my-profile')}
                                    className="hover:text-black cursor-pointer transition-colors"
                                >
                                    My Profile
                                </p>
                                <p
                                    onClick={() => navigate('my-appointments')}
                                    className="hover:text-black cursor-pointer transition-colors"
                                >
                                    My Appointments
                                </p>
                                <p
                                    onClick={logout}
                                    className="hover:text-black cursor-pointer transition-colors"
                                >
                                    Logout
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block hover:bg-primary/90 transition-colors"
                    >
                        Login / Sign up
                    </button>
                )}

                {/* Mobile Menu Button */}
                <img
                    onClick={() => setShowMenu(true)}
                    className="w-6 md:hidden cursor-pointer"
                    src={assets.menu_icon}
                    alt="Menu"
                />

                {/* Mobile Menu Overlay */}
                <div
                    className={`${
                        showMenu ? 'fixed w-full' : 'h-0 w-0'
                    } md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all duration-300`}
                >
                    {/* Mobile Menu Header */}
                    <div className="flex items-center justify-between px-5 py-6 border-b">
                        <img
                            className="w-36"
                            src={assets.logo}
                            alt="Logo"
                        />
                        <img
                            className="w-7 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => setShowMenu(false)}
                            src={assets.cross_icon}
                            alt="Close"
                        />
                    </div>

                    {/* Mobile Menu Links */}
                    <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
                        <NavLink
                            onClick={() => setShowMenu(false)}
                            to="/"
                            className={({ isActive }) =>
                                `px-4 py-2 rounded inline-block w-full text-center ${
                                    isActive ? 'bg-primary/10 text-primary' : 'hover:bg-gray-50'
                                }`
                            }
                        >
                            HOME
                        </NavLink>
                        <NavLink
                            onClick={() => setShowMenu(false)}
                            to="/doctors"
                            className={({ isActive }) =>
                                `px-4 py-2 rounded inline-block w-full text-center ${
                                    isActive ? 'bg-primary/10 text-primary' : 'hover:bg-gray-50'
                                }`
                            }
                        >
                            ALL DOCTORS
                        </NavLink>
                        <NavLink
                            onClick={() => setShowMenu(false)}
                            to="/about"
                            className={({ isActive }) =>
                                `px-4 py-2 rounded inline-block w-full text-center ${
                                    isActive ? 'bg-primary/10 text-primary' : 'hover:bg-gray-50'
                                }`
                            }
                        >
                            ABOUT
                        </NavLink>
                        <NavLink
                            onClick={() => setShowMenu(false)}
                            to="/contact"
                            className={({ isActive }) =>
                                `px-4 py-2 rounded inline-block w-full text-center ${
                                    isActive ? 'bg-primary/10 text-primary' : 'hover:bg-gray-50'
                                }`
                            }
                        >
                            CONTACT
                        </NavLink>

                        {/* Mobile Login Button */}
                        {!token && (
                            <button
                                onClick={() => {
                                    navigate('/login');
                                    setShowMenu(false);
                                }}
                                className="bg-primary text-white px-8 py-3 rounded-full font-light w-full mt-4 hover:bg-primary/90 transition-colors"
                            >
                                Create account
                            </button>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
