import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATION_STORAGE_KEY = '@notifications';

export const NotificationService = {
  // Get all notifications
  async getAllNotifications() {
    try {
      const notificationsJSON = await AsyncStorage.getItem(NOTIFICATION_STORAGE_KEY);
      return notificationsJSON ? JSON.parse(notificationsJSON) : [];
    } catch (error) {
      console.error('Error getting notifications:', error);
      return [];
    }
  },

  // Save a new notification
  async saveNotification(notification) {
    try {
      const notifications = await this.getAllNotifications();
      const newNotification = {
        id: Date.now().toString(),
        title: notification.title,
        body: notification.body,
        data: notification.data,
        timestamp: new Date().toISOString(),
        read: false,
      };
      
      notifications.unshift(newNotification); // Add to beginning
      await AsyncStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(notifications));
      return newNotification;
    } catch (error) {
      console.error('Error saving notification:', error);
      return null;
    }
  },

  // Mark notification as read
  async markAsRead(notificationId) {
    try {
      const notifications = await this.getAllNotifications();
      const updatedNotifications = notifications.map(notification =>
        notification.id === notificationId ? { ...notification, read: true } : notification
      );
      await AsyncStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(updatedNotifications));
      return updatedNotifications;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return null;
    }
  },

  // Mark all as read
  async markAllAsRead() {
    try {
      const notifications = await this.getAllNotifications();
      const updatedNotifications = notifications.map(notification => ({
        ...notification,
        read: true
      }));
      await AsyncStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(updatedNotifications));
      return updatedNotifications;
    } catch (error) {
      console.error('Error marking all as read:', error);
      return null;
    }
  },

  // Get unread count
  async getUnreadCount() {
    try {
      const notifications = await this.getAllNotifications();
      return notifications.filter(notification => !notification.read).length;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  },

  // Clear all notifications
  async clearAllNotifications() {
    try {
      await AsyncStorage.removeItem(NOTIFICATION_STORAGE_KEY);
      return [];
    } catch (error) {
      console.error('Error clearing notifications:', error);
      return null;
    }
  },

  // Delete single notification
  async deleteNotification(notificationId) {
    try {
      const notifications = await this.getAllNotifications();
      const filteredNotifications = notifications.filter(
        notification => notification.id !== notificationId
      );
      await AsyncStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(filteredNotifications));
      return filteredNotifications;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return null;
    }
  },
};