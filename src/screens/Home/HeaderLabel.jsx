import { useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import NotificationModal from './NotificationModal';
import ENV from '../../config/env';

const { height } = Dimensions.get('window');

const HeaderLabel = ({ userData, setUserData, navigation }) => {
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [notificationModalVisible, setNotificationModalVisible] =
    useState(false);
  const handleProfilePress = () => setProfileModalVisible(true);
  const handleNotificationPress = () => setNotificationModalVisible(true);
  const closeNotificationModal = () => setNotificationModalVisible(false);

  const closeProfileModal = () => {
    setUserData(null);
    navigation.navigate('Login');
    setProfileModalVisible(false);
  };

  const notificationCount = 3;

  const styles = {
    headerContainer: {
      backgroundColor: '#FF6B35',
    },
    headerInner: {
      height: Platform.OS === 'ios' ? 130 : 95,
      paddingTop: Platform.OS === 'ios' ? 25 : 30,
      backgroundColor: '#FF6B35',
      paddingBottom: 0,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    headerContent: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    leftSection: {
      flex: 1,
      justifyContent: 'center',
    },
    titleText: {
      fontSize: 21,
      fontWeight: 'bold',
      color: 'white',
      letterSpacing: 0.5,
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
    rightSection: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    notificationButton: {
      padding: 8,
      marginRight: 16,
    },
    notificationIconContainer: {
      position: 'relative',
      width: 30,
      height: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },
    notificationBadge: {
      position: 'absolute',
      top: -2,
      right: -2,
      backgroundColor: '#EF4444',
      borderRadius: 9,
      minWidth: 18,
      height: 18,
      borderWidth: 2,
      borderColor: '#FF6B35',
      alignItems: 'center',
      justifyContent: 'center',
    },
    badgeText: {
      color: 'white',
      fontSize: 10,
      fontWeight: 'bold',
    },
    profileButton: {
      padding: 4,
    },
    profileImage: {
      width: 44,
      height: 44,
      borderRadius: 22,
      borderWidth: 3,
      borderColor: 'white',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      maxHeight: height * 0.7,
      backgroundColor: 'white',
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      paddingBottom: 32,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#1F2937',
    },
    closeButton: {
      padding: 8,
    },
    profileInfo: {
      alignItems: 'center',
      paddingVertical: 32,
      paddingHorizontal: 20,
    },
    profileImageLarge: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 4,
      borderColor: '#FF6B35',
      marginBottom: 16,
    },
    profileName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#1F2937',
      marginBottom: 4,
    },
    profileEmail: {
      fontSize: 16,
      color: '#6B7280',
    },
    optionsContainer: {
      paddingHorizontal: 20,
    },
    optionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#F3F4F6',
    },
    optionText: {
      flex: 1,
      marginLeft: 12,
      fontSize: 16,
      color: '#1F2937',
    },
    optionTextDanger: {
      flex: 1,
      marginLeft: 12,
      fontSize: 16,
      color: '#EF4444',
    },
    iconFallback: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconFallbackText: {
      color: 'white',
      fontSize: 12,
      fontWeight: 'bold',
    },
  };

  const profileOptions = [
    {
      icon: 'settings',
      text: 'Settings',
      fallback: '⚙️',
      onPress: () => {
        navigation.navigate('settings');
      },
    },
    {
      icon: 'help',
      text: 'Help & Support',
      fallback: '❓',
      onPress: () => {
        navigation.navigate('HelpAndSupportScreen');
      },
    },
    {
      icon: 'logout',
      text: 'Logout',
      fallback: '🚪',
      danger: true,
      onPress: () => {
        closeProfileModal();
      },
    },
  ];

  const IconComponent = ({ name, size, color, fallback }) => {
    try {
      return <MaterialIcons name={name} size={size} color={color} />;
    } catch (error) {
      return (
        <View style={[styles.iconFallback, { width: size, height: size }]}>
          <Text style={[styles.iconFallbackText, { fontSize: size * 0.6 }]}>
            {fallback || '?'}
          </Text>
        </View>
      );
    }
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerInner}>
        <View style={styles.headerContent}>
          <View style={styles.leftSection}>
            <Text style={styles.titleText}>Panchal Samaj</Text>
          </View>
          {userData &&
          <View style={styles.rightSection}>
            <TouchableOpacity
              onPress={handleNotificationPress}
              activeOpacity={0.7}
              style={styles.notificationButton}
            >
              <View style={styles.notificationIconContainer}>
                <IconComponent
                  name="notifications"
                  color="#e9be33ff"
                  size={30}
                  fallback="🔔"
                />
                {notificationCount > 0 && (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.badgeText}>
                      {notificationCount > 99 ? '99+' : notificationCount}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>

            {userData && (
              <TouchableOpacity
                onPress={handleProfilePress}
                activeOpacity={0.7}
                style={styles.profileButton}
              >
                <Image
                  source={{
                    uri:
                      userData && userData?.photo
                        ? ENV.IMAGE_URL + userData.photo
                        : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                  }}
                  style={styles.profileImage}
                  defaultSource={{
                    uri: 'https://via.placeholder.com/44x44/cccccc/ffffff?text=U',
                  }}
                />
              </TouchableOpacity>
            )}
          </View>}
        </View>
      </View>

      <Modal
        visible={profileModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeProfileModal}
        statusBarTranslucent={true}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={0.7}
            onPress={closeProfileModal}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Profile</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={closeProfileModal}
                style={styles.closeButton}
              >
                <IconComponent
                  name="close"
                  size={24}
                  color="#333"
                  fallback="✕"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.profileInfo}>
              <Image
                source={{
                  uri:
                    userData && userData?.photo
                      ? ENV.IMAGE_URL + userData.photo
                      : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                }}
                style={styles.profileImageLarge}
                defaultSource={{
                  uri: 'https://via.placeholder.com/100x100/cccccc/ffffff?text=U',
                }}
              />
              <Text style={styles.profileName}>
                {userData
                  ? userData?.firstname + ' ' + userData?.lastname
                  : 'John Doe'}
              </Text>
              <Text style={styles.profileEmail}>
                {userData ? userData?.email : 'John Doe'}
              </Text>
            </View>

            <View style={styles.optionsContainer}>
              {profileOptions.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.optionItem}
                  onPress={item.onPress}
                  activeOpacity={0.7}
                >
                  <IconComponent
                    name={item.icon}
                    size={20}
                    color={item.danger ? '#EF4444' : '#FF6B35'}
                    fallback={item.fallback}
                  />
                  <Text
                    style={
                      item.danger ? styles.optionTextDanger : styles.optionText
                    }
                  >
                    {item.text}
                  </Text>
                  <IconComponent
                    name="chevron-right"
                    size={20}
                    color="#999"
                    fallback="›"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      <NotificationModal
        visible={notificationModalVisible}
        onClose={closeNotificationModal}
      />
    </View>
  );
};

export default HeaderLabel;
