import messaging from '@react-native-firebase/messaging';
import { createContext, useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../styles/colors';

export const FCMContext = createContext();

const { width } = Dimensions.get('window');


const NotificationModal = ({ visible, notification, onClose }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-100));

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!notification) return null;

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View
        style={[
          styles.modalOverlay,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <Animated.View
          style={[
            styles.notificationContainer,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.notificationCard}>
            <View style={styles.iconContainer}>
              <View style={styles.iconCircle}>
                <MaterialIcons name="notifications-active" size={32} color={COLORS.white} />
              </View>
            </View>

            <View style={styles.contentContainer}>
              <View style={styles.headerRow}>
                <View style={styles.headerContent}>
                  <Text style={styles.appName}>Notification</Text>
                  <Text style={styles.timestamp}>Just now</Text>
                </View>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onClose}
                  activeOpacity={0.7}
                >
                  <MaterialIcons name="close" size={20} color={COLORS.gray} />
                </TouchableOpacity>
              </View>

              <View style={styles.messageContent}>
                {notification.title && (
                  <Text style={styles.notificationTitle} numberOfLines={2}>
                    {notification.title}
                  </Text>
                )}
                {notification.body && (
                  <Text style={styles.notificationBody} numberOfLines={3}>
                    {notification.body}
                  </Text>
                )}
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={onClose}
                  activeOpacity={0.7}
                >
                  <Text style={styles.viewButtonText}>View</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dismissButton}
                  onPress={onClose}
                  activeOpacity={0.7}
                >
                  <Text style={styles.dismissButtonText}>Dismiss</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export const FCMProvider = ({ children }) => {

  const [fcmToken, setFcmToken] = useState(null);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {

      setCurrentNotification({
        title: remoteMessage.notification?.title || 'New Notification',
        body: remoteMessage.notification?.body || 'You have a new message',
        data: remoteMessage.data,
      });

      setNotificationVisible(true);

    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('FCM Message in background:', remoteMessage);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await messaging().getToken();
        setFcmToken(token);
      } catch (error) {
        console.error('Error getting FCM token:', error);
      }
    };

    getToken();
  }, []);

  const handleCloseNotification = () => {
    setNotificationVisible(false);
    setTimeout(() => {
      setCurrentNotification(null);
    }, 300);
  };

  return (
    <FCMContext.Provider value={{ fcmToken }}>
      {children}
      <NotificationModal
        visible={notificationVisible}
        notification={currentNotification}
        onClose={handleCloseNotification}
      />
    </FCMContext.Provider>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    paddingTop: 50,
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  notificationContainer: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  notificationCard: {
    width: width - 32,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
    overflow: 'hidden',
  },
  iconContainer: {
    backgroundColor: COLORS.primary,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  contentContainer: {
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerContent: {
    flex: 1,
  },
  appName: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 11,
    color: COLORS.gray,
    fontWeight: '400',
  },
  closeButton: {
    padding: 4,
    borderRadius: 12,
    backgroundColor: COLORS.lightGray,
    marginLeft: 8,
  },
  messageContent: {
    marginBottom: 16,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.darkGray,
    marginBottom: 8,
    lineHeight: 24,
  },
  notificationBody: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
    fontWeight: '400',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  viewButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  viewButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  dismissButton: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dismissButtonText: {
    color: COLORS.darkGray,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});