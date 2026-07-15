const STORAGE_KEY = "fittrack_notifications";
const MAX_NOTIFICATIONS = 50;

const isBrowser = () => typeof window !== "undefined";

const safelyParseNotifications = () => {
  if (!isBrowser()) return [];

  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

export const notificationService = {
  getNotifications() {
    return safelyParseNotifications();
  },

  saveNotifications(notifications) {
    if (!isBrowser()) return;

    const safeNotifications = Array.isArray(notifications)
      ? notifications.slice(0, MAX_NOTIFICATIONS)
      : [];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(safeNotifications));
    window.dispatchEvent(new Event("notificationsChanged"));
  },

  addNotification({ title, message, type = "info" }) {
    if (!title || !message) return;

    const notifications = this.getNotifications();

    const duplicate = notifications.find((item) => {
      const createdAt = item.createdAt ? new Date(item.createdAt).getTime() : 0;
      const isRecent = Date.now() - createdAt < 3000;

      return (
        isRecent &&
        item.title === title &&
        item.message === message &&
        item.type === type
      );
    });

    if (duplicate) return;

    const newNotification = {
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`,
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString(),
    };

    this.saveNotifications([newNotification, ...notifications]);
  },

  markAllAsRead() {
    const notifications = this.getNotifications().map((item) => ({
      ...item,
      read: true,
    }));

    this.saveNotifications(notifications);
  },

  markAsRead(id) {
    const notifications = this.getNotifications().map((item) =>
      item.id === id ? { ...item, read: true } : item,
    );

    this.saveNotifications(notifications);
  },

  deleteNotification(id) {
    const notifications = this.getNotifications().filter(
      (item) => item.id !== id,
    );

    this.saveNotifications(notifications);
  },

  clearNotifications() {
    this.saveNotifications([]);
  },

  getUnreadCount() {
    return this.getNotifications().filter((item) => !item.read).length;
  },
};
