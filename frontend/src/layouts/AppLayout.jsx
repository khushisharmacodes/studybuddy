import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Timer,
  Target,
  BookHeart,
  BarChart3,
  Bell,
  LogOut,
  GraduationCap,
  Shield,
  Menu,
  X,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { RefreshCw } from 'lucide-react';
import useAuthStore from '../store/authStore.js';
import useNotificationStore from '../store/notificationStore.js';
import usePWAUpdate from '../hooks/usePWAUpdate.js';

const baseNavItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/focus', label: 'Focus', icon: Timer },
  { path: '/goals', label: 'Goals', icon: Target },
  { path: '/journal', label: 'Journal', icon: BookHeart },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/exams', label: 'Exams', icon: GraduationCap },
];

export default function AppLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const navItems = user?.role === 'admin'
    ? [...baseNavItems, { path: '/admin', label: 'Admin', icon: Shield }]
    : baseNavItems;
  const { notifications, fetchNotifications, markAllAsRead, unreadCount } = useNotificationStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
  };

  const unread = unreadCount();
  const { isUpdateAvailable, applyUpdate } = usePWAUpdate();

  return (
    <div className="min-h-screen flex bg-gradient-mesh">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 glass border-r border-white/50 sticky top-0 h-screen z-30">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-rose-400 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                SB
              </div>
              <span className="text-xl font-display font-bold text-stone-800">StudyBuddy</span>
            </div>
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-xl hover:bg-white/60 transition-colors relative"
              >
                <Bell className="w-5 h-5 text-stone-600" />
                {unread > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </button>
              <NotificationDropdown
                isOpen={notificationsOpen}
                notifications={notifications}
                onMarkRead={handleMarkAllRead}
              />
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all duration-200
                ${isActive
                  ? 'bg-violet-500 text-white shadow-lg shadow-violet-200'
                  : 'text-stone-600 hover:bg-white/60 hover:text-violet-600'}
              `}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-stone-100">
          <div className="glass-card rounded-2xl p-4 mb-4">
            <p className="text-sm font-medium text-stone-800">{user?.name || 'Student'}</p>
            <p className="text-xs text-stone-500">{user?.college || 'NIT Kurukshetra'}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="px-2 py-0.5 bg-violet-100 text-violet-700 text-xs rounded-full font-medium">
                Lvl {user?.level || 1}
              </span>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">
                {user?.xp || 0} XP
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-stone-600 hover:bg-rose-50 hover:text-rose-600 transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 glass border-b border-white/50 z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-rose-400 flex items-center justify-center text-white font-bold text-sm shadow-lg">
            SB
          </div>
          <span className="text-lg font-display font-bold text-stone-800">StudyBuddy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-xl hover:bg-white/60 transition-colors relative"
            >
              <Bell className="w-5 h-5 text-stone-600" />
              {unread > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
            </button>
            <NotificationDropdown
              isOpen={notificationsOpen}
              notifications={notifications}
              onMarkRead={handleMarkAllRead}
            />
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-xl hover:bg-white/60">
            {mobileOpen ? <X className="w-6 h-6 text-stone-700" /> : <Menu className="w-6 h-6 text-stone-700" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden fixed top-16 left-0 right-0 bottom-0 bg-white/95 backdrop-blur-xl z-30 p-4"
        >
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all
                  ${isActive ? 'bg-violet-500 text-white' : 'text-stone-600 hover:bg-violet-50'}
                `}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <button
            onClick={handleLogout}
            className="mt-4 w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-stone-600 hover:bg-rose-50 hover:text-rose-600 font-medium"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </motion.div>
      )}

      {/* Main Content */}
      <main className="flex-1 min-w-0 pt-16 lg:pt-0">
        {isUpdateAvailable && (
          <div className="px-4 lg:px-8 pt-4">
            <div className="bg-violet-600 text-white rounded-2xl px-4 py-3 flex items-center justify-between gap-3 shadow-lg shadow-violet-200">
              <span className="text-sm font-medium">A new version of StudyBuddy is available.</span>
              <button
                onClick={applyUpdate}
                className="flex items-center gap-1.5 bg-white text-violet-700 text-sm font-bold px-3 py-1.5 rounded-xl hover:bg-violet-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Upgrade
              </button>
            </div>
          </div>
        )}
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function NotificationDropdown({ isOpen, notifications, onMarkRead }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className="absolute right-0 top-full mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-violet-100 z-50 overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
            <h3 className="font-display font-bold text-stone-800">Notifications</h3>
            {notifications.some((n) => !n.isRead) && (
              <button onClick={onMarkRead} className="text-xs text-violet-600 hover:text-violet-700 font-medium">
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-stone-400 text-sm">
                No notifications yet.
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`px-4 py-3 border-b border-stone-50 last:border-0 hover:bg-violet-50 transition-colors ${
                    !notification.isRead ? 'bg-violet-50/50' : ''
                  }`}
                >
                  <p className="text-sm font-medium text-stone-800">{notification.title}</p>
                  <p className="text-xs text-stone-500 mt-0.5">{notification.message}</p>
                  <p className="text-[10px] text-stone-400 mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
