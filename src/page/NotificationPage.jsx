import React, { useEffect, useState } from 'react';
import { Bell, Check, Clock, Trash2 } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'https://localhost:7119';

const getToken = () => {
  const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
  return match ? match[2] : null;
};

export default function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const token = getToken();
      const res = await axios.get(`${API_BASE}/api/notification`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const markAsRead = async (id) => {
    try {
      const token = getToken();
      await axios.patch(`${API_BASE}/api/notification/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) =>
        prev.map((n) => (n.notificationID === id ? { ...n, isRead: true } : n))
      );
      if (window.updateUnreadCount) window.updateUnreadCount(-1);
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = getToken();
      await axios.patch(`${API_BASE}/api/notification/mark-all-read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const unread = notifications.filter((n) => !n.isRead).length;
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      if (window.updateUnreadCount) window.updateUnreadCount(-unread);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const token = getToken();
      await axios.delete(`${API_BASE}/api/notification/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchNotifications(); // 🔄 refresh from backend after delete
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  if (loading) return <div className="text-white text-center py-16">Loading notifications...</div>;

  return (
    <div className="bg-gray-800 p-6 max-w-2xl mx-auto mt-8 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Bell className="text-gray-400" size={24} />
          <h2 className="text-2xl font-semibold text-white">Notifications</h2>
        </div>
        <button
          className="text-sm text-blue-400 hover:text-blue-300"
          onClick={markAllAsRead}
        >
          Mark all as read
        </button>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <Bell className="mx-auto mb-3" size={32} />
            No notifications yet
          </div>
        )}

        {notifications.map((n) => (
          <div
            key={n.notificationID}
            className={`p-4 rounded-lg ${n.isRead ? 'bg-gray-700' : 'bg-gray-700/50'} hover:bg-gray-600 transition-colors`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-gray-300 text-sm">{n.message}</p>
                <div className="flex items-center space-x-2 mt-2 text-sm text-gray-400">
                  <Clock size={14} />
                  <span>{formatDate(n.createdAt)}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {n.isRead ? (
                  <Check className="text-green-400" size={20} />
                ) : (
                  <div
                    onClick={() => markAsRead(n.notificationID)}
                    className="h-3 w-3 rounded-full bg-blue-500 cursor-pointer"
                  ></div>
                )}
                <button
                  onClick={() => deleteNotification(n.notificationID)}
                  className="text-red-500 hover:text-red-400"
                  title="Delete notification"
                >
                  <Trash2 size={20} /> 
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
