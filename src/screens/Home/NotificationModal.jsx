import { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Modal,
    Platform,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    Vibration,
    View
} from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { COLORS } from "../../styles/colors";

const { height, width } = Dimensions.get("window");

const NotificationModal = ({ visible, onClose }) => {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: "Welcome to Panchal Samaj",
            message: "Thank you for joining our vibrant community! We're excited to have you with us on this journey of connection and growth.",
            time: "2 hours ago",
            read: false,
            type: "welcome",
            category: "general"
        },
        {
            id: 2,
            title: "🎉 Community Event Reminder",
            message: "Don't forget about our community gathering this weekend at the community center. Come join us for food, music, and celebration!",
            time: "1 day ago",
            read: false,
            type: "event",
            category: "events"
        },
        {
            id: 3,
            title: "✅ Profile Updated Successfully",
            message: "Your profile information has been updated successfully. All your changes are now live and visible to other community members.",
            time: "3 days ago",
            read: true,
            type: "success",
            category: "account"
        },
        {
            id: 4,
            title: "👋 New Member Alert",
            message: "Let's give a warm welcome to our new community member Ravi Patel! Help them feel at home in our community.",
            time: "5 days ago",
            read: true,
            type: "member",
            category: "community"
        },
        {
            id: 5,
            title: "📢 Important Community Update",
            message: "We have exciting news about upcoming festivities and celebrations. Check out the latest updates in the events section.",
            time: "1 week ago",
            read: false,
            type: "announcement",
            category: "announcements"
        },
        {
            id: 6,
            title: "💼 Business Directory Update",
            message: "Your business listing has been approved and is now live in our community directory. Start connecting with potential customers!",
            time: "2 weeks ago",
            read: true,
            type: "business",
            category: "business"
        },
        {
            id: 7,
            title: "🔔 Reminder: Monthly Meeting",
            message: "Monthly community meeting scheduled for this Friday at 7 PM. Your participation is valuable to our community growth.",
            time: "2 weeks ago",
            read: false,
            type: "reminder",
            category: "events"
        },
        {
            id: 8,
            title: "🎂 Birthday Celebrations",
            message: "Join us in celebrating birthdays of our community members this month. Let's make their day special together!",
            time: "3 weeks ago",
            read: true,
            type: "celebration",
            category: "social"
        }
    ]);

    const [selectedCategory, setSelectedCategory] = useState('all');
    const slideAnim = useRef(new Animated.Value(height)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        if (visible) {
            StatusBar.setBarStyle('light-content');
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    tension: 100,
                    friction: 8,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 120,
                    friction: 8,
                    useNativeDriver: true,
                })
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: height,
                    duration: 250,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [visible]);

    const categories = [
        { id: 'all', name: 'All', icon: 'notifications', color: '#FF6B35' },
        { id: 'events', name: 'Events', icon: 'event', color: '#4ECDC4' },
        { id: 'account', name: 'Account', icon: 'account-circle', color: '#45B7D1' },
        { id: 'community', name: 'Community', icon: 'group', color: '#96CEB4' },
        { id: 'business', name: 'Business', icon: 'business', color: '#FFEAA7' }
    ];

    const getNotificationIcon = (type) => {
        const icons = {
            welcome: 'waving-hand',
            event: 'event',
            success: 'check-circle',
            member: 'person-add',
            announcement: 'campaign',
            business: 'business',
            reminder: 'schedule',
            celebration: 'celebration',
            general: 'notifications'
        };
        return icons[type] || 'notifications';
    };

    const getNotificationColor = (type, read) => {
        const colors = {
            welcome: '#FF6B35',
            event: '#4ECDC4',
            success: '#27AE60',
            member: '#9B59B6',
            announcement: '#E74C3C',
            business: '#F39C12',
            reminder: '#3498DB',
            celebration: '#E91E63',
            general: '#95A5A6'
        };
        return read ? '#BDC3C7' : (colors[type] || '#95A5A6');
    };

    const markAllAsRead = () => {
        if (Platform.OS === 'ios') {
            Vibration.vibrate();
        }
        const filteredNotifications = getFilteredNotifications();
        setNotifications(prev =>
            prev.map(notification =>
                filteredNotifications.some(filtered => filtered.id === notification.id)
                    ? { ...notification, read: true }
                    : notification
            )
        );
    };

    const markSingleAsRead = (id) => {
        if (Platform.OS === 'ios') {
            Vibration.vibrate(100);
        }
        setNotifications(prev =>
            prev.map(notification =>
                notification.id === id
                    ? { ...notification, read: true }
                    : notification
            )
        );
    };

    const deleteNotification = (id) => {
        if (Platform.OS === 'ios') {
            Vibration.vibrate([0, 100, 50, 100]);
        }
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    };

    const getFilteredNotifications = () => {
        if (selectedCategory === 'all') {
            return notifications;
        }
        return notifications.filter(notification => notification.category === selectedCategory);
    };

    const getUnreadCount = () => {
        const filtered = getFilteredNotifications();
        return filtered.filter(notification => !notification.read).length;
    };

    const clearAllNotifications = () => {
        if (Platform.OS === 'ios') {
            Vibration.vibrate([0, 100, 50, 200]);
        }
        const filteredNotifications = getFilteredNotifications();
        if (selectedCategory === 'all') {
            setNotifications([]);
        } else {
            setNotifications(prev =>
                prev.filter(notification =>
                    !filteredNotifications.some(filtered => filtered.id === notification.id)
                )
            );
        }
    };

    const filteredNotifications = getFilteredNotifications();
    const unreadCount = getUnreadCount();

    const NotificationItem = ({ notification, index }) => {
        const itemAnim = useRef(new Animated.Value(0)).current;
        const [showActions, setShowActions] = useState(false);

        useEffect(() => {
            Animated.timing(itemAnim, {
                toValue: 1,
                duration: 300,
                delay: index * 50,
                useNativeDriver: true,
            }).start();
        }, []);

        return (
            <Animated.View
                style={{
                    opacity: itemAnim,
                    transform: [{
                        translateX: itemAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [50, 0]
                        })
                    }]
                }}
            >
                <TouchableOpacity
                    style={[
                        styles.notificationItem,
                        !notification.read && styles.notificationItemUnread
                    ]}
                    onPress={() => markSingleAsRead(notification.id)}
                    onLongPress={() => setShowActions(!showActions)}
                    activeOpacity={0.8}
                    delayLongPress={500}
                >
                    <View style={styles.notificationContent}>
                        <View style={styles.notificationHeader}>
                            <View style={styles.notificationIconContainer}>
                                <View style={[
                                    styles.notificationIcon,
                                    { backgroundColor: getNotificationColor(notification.type, notification.read) + '20' }
                                ]}>
                                    <MaterialIcons
                                        name={getNotificationIcon(notification.type)}
                                        size={20}
                                        color={getNotificationColor(notification.type, notification.read)}
                                    />
                                </View>
                            </View>
                            <View style={styles.notificationTextContainer}>
                                <View style={styles.titleRow}>
                                    <Text style={[
                                        styles.notificationTitle,
                                        notification.read && styles.readTitle
                                    ]}>
                                        {notification.title}
                                    </Text>
                                    {!notification.read && (
                                        <View style={[
                                            styles.unreadDot,
                                            { backgroundColor: getNotificationColor(notification.type, false) }
                                        ]} />
                                    )}
                                </View>
                                <Text style={[
                                    styles.notificationMessage,
                                    notification.read && styles.readMessage
                                ]}>
                                    {notification.message}
                                </Text>
                                <View style={styles.notificationFooter}>
                                    <Text style={styles.notificationTime}>
                                        {notification.time}
                                    </Text>
                                    <Text style={[
                                        styles.categoryBadge,
                                        { backgroundColor: getNotificationColor(notification.type, false) + '20' }
                                    ]}>
                                        {notification.category}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {showActions && (
                        <Animated.View style={styles.actionButtons}>
                            <TouchableOpacity
                                style={[styles.actionButton, { backgroundColor: '#27AE60' }]}
                                onPress={() => {
                                    markSingleAsRead(notification.id);
                                    setShowActions(false);
                                }}
                            >
                                <MaterialIcons name="check" size={16} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.actionButton, { backgroundColor: '#E74C3C' }]}
                                onPress={() => {
                                    deleteNotification(notification.id);
                                    setShowActions(false);
                                }}
                            >
                                <MaterialIcons name="delete" size={16} color="#fff" />
                            </TouchableOpacity>
                        </Animated.View>
                    )}
                </TouchableOpacity>
            </Animated.View>
        );
    };

    const CategoryFilter = () => (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryContainer}
            contentContainerStyle={styles.categoryContent}
        >
            {categories.map((category) => {
                const isSelected = selectedCategory === category.id;
                const categoryCount = category.id === 'all'
                    ? notifications.length
                    : notifications.filter(n => n.category === category.id).length;

                return (
                    <TouchableOpacity
                        key={category.id}
                        style={[
                            styles.categoryButton,
                            isSelected && { backgroundColor: category.color + '20' }
                        ]}
                        onPress={() => setSelectedCategory(category.id)}
                        activeOpacity={0.7}
                    >
                        <MaterialIcons
                            name={category.icon}
                            size={18}
                            color={isSelected ? category.color : '#6B7280'}
                        />
                        <Text style={[
                            styles.categoryText,
                            isSelected && { color: category.color }
                        ]}>
                            {category.name}
                        </Text>
                        {categoryCount > 0 && (
                            <View style={[
                                styles.categoryBadgeCount,
                                { backgroundColor: isSelected ? category.color : '#E5E7EB' }
                            ]}>
                                <Text style={[
                                    styles.categoryBadgeText,
                                    { color: isSelected ? '#fff' : '#6B7280' }
                                ]}>
                                    {categoryCount}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );

    const styles = {
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            justifyContent: 'flex-end',
        },
        notificationModalContent: {
            maxHeight: height * 0.9,
            backgroundColor: '#fff',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingBottom: Platform.OS === 'ios' ? 34 : 20,
            elevation: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.25,
            shadowRadius: 12,
        },
        modalHandle: {
            width: 40,
            height: 4,
            backgroundColor: '#E5E7EB',
            borderRadius: 2,
            alignSelf: 'center',
            marginTop: 12,
            marginBottom: 8,
        },
        modalHeader: {
            paddingHorizontal: 24,
            paddingVertical: 20,
            borderBottomWidth: 1,
            borderBottomColor: '#F3F4F6',
        },
        modalHeaderGradient: {
            paddingHorizontal: 24,
            paddingVertical: 20,
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(255,255,255,0.2)',
        },
        headerTop: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
        },
        titleContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        modalTitle: {
            fontSize: 24,
            fontWeight: '800',
            color: '#1F2937',
        },
        modalTitleGradient: {
            fontSize: 24,
            fontWeight: '800',
            color: '#fff',
        },
        unreadCounter: {
            fontSize: 14,
            color: COLORS.primary,
            marginLeft: 8,
            fontWeight: '600',
            backgroundColor: COLORS.primary + '20',
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 12,
        },
        unreadCounterGradient: {
            fontSize: 14,
            color: '#fff',
            marginLeft: 8,
            fontWeight: '600',
            backgroundColor: 'rgba(255,255,255,0.2)',
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 12,
        },
        closeButton: {
            padding: 8,
            borderRadius: 20,
            backgroundColor: '#F3F4F6',
        },
        closeButtonGradient: {
            padding: 8,
            borderRadius: 20,
            backgroundColor: 'rgba(255,255,255,0.2)',
        },
        headerSubtitle: {
            fontSize: 14,
            color: '#6B7280',
            fontWeight: '400',
        },
        headerSubtitleGradient: {
            fontSize: 14,
            color: 'rgba(255,255,255,0.8)',
            fontWeight: '400',
        },
        categoryContainer: {
            maxHeight: 60,
            marginBottom: 8,
        },
        categoryContent: {
            paddingHorizontal: 24,
            paddingVertical: 8,
        },
        categoryButton: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 8,
            marginRight: 12,
            borderRadius: 20,
            backgroundColor: '#F9FAFB',
            borderWidth: 1,
            borderColor: '#E5E7EB',
        },
        categoryText: {
            fontSize: 14,
            color: '#6B7280',
            marginLeft: 6,
            fontWeight: '500',
        },
        categoryBadgeCount: {
            backgroundColor: '#E5E7EB',
            borderRadius: 10,
            marginLeft: 6,
            minWidth: 20,
            height: 20,
            justifyContent: 'center',
            alignItems: 'center',
        },
        categoryBadgeText: {
            fontSize: 12,
            fontWeight: '600',
            color: '#6B7280',
        },
        scrollView: {
            flex: 1,
            paddingHorizontal: 20,
            paddingTop: 8,
        },
        emptyState: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 80,
        },
        emptyStateIcon: {
            marginBottom: 16,
            opacity: 0.6,
        },
        emptyStateText: {
            fontSize: 18,
            color: '#6B7280',
            textAlign: 'center',
            fontWeight: '600',
            lineHeight: 26,
        },
        emptyStateSubtext: {
            fontSize: 14,
            color: '#9CA3AF',
            textAlign: 'center',
            marginTop: 8,
            lineHeight: 20,
        },
        notificationItem: {
            backgroundColor: '#fff',
            borderRadius: 16,
            padding: 16,
            marginVertical: 6,
            marginHorizontal: 4,
            borderWidth: 1,
            borderColor: '#F3F4F6',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
            position: 'relative',
        },
        notificationItemUnread: {
            backgroundColor: '#FEFEFE',
            borderLeftWidth: 4,
            borderLeftColor: COLORS.primary,
            borderColor: COLORS.primary + '20',
        },
        notificationContent: {
            flex: 1,
        },
        notificationHeader: {
            flexDirection: 'row',
            alignItems: 'flex-start',
        },
        notificationIconContainer: {
            marginRight: 12,
            marginTop: 2,
        },
        notificationIcon: {
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
        },
        notificationTextContainer: {
            flex: 1,
        },
        titleRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 6,
        },
        notificationTitle: {
            fontSize: 16,
            fontWeight: '700',
            color: '#1F2937',
            flex: 1,
            marginRight: 8,
            lineHeight: 22,
        },
        readTitle: {
            color: '#6B7280',
            fontWeight: '600',
        },
        unreadDot: {
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: COLORS.primary,
            marginTop: 6,
        },
        notificationMessage: {
            fontSize: 14,
            color: '#4B5563',
            lineHeight: 20,
            marginBottom: 12,
            textAlign: 'justify',
        },
        readMessage: {
            color: '#9CA3AF',
        },
        notificationFooter: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        notificationTime: {
            fontSize: 12,
            color: '#9CA3AF',
            fontWeight: '500',
        },
        categoryBadge: {
            fontSize: 11,
            color: '#6B7280',
            backgroundColor: '#F3F4F6',
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 10,
            textTransform: 'capitalize',
            fontWeight: '600',
        },
        actionButtons: {
            position: 'absolute',
            right: 16,
            top: '50%',
            flexDirection: 'row',
            gap: 8,
            transform: [{ translateY: -16 }],
        },
        actionButton: {
            width: 32,
            height: 32,
            borderRadius: 16,
            justifyContent: 'center',
            alignItems: 'center',
        },
        modalFooter: {
            paddingHorizontal: 24,
            paddingTop: 20,
            borderTopWidth: 1,
            borderTopColor: '#F3F4F6',
        },
        footerButtons: {
            flexDirection: 'row',
            gap: 12,
        },
        footerButton: {
            flex: 1,
            borderRadius: 12,
            paddingVertical: 14,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
        },
        primaryButton: {
            backgroundColor: COLORS.primary,
        },
        secondaryButton: {
            backgroundColor: '#6B7280',
        },
        singleButton: {
            backgroundColor: '#E74C3C',
        },
        buttonText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: '700',
        },
        footerStats: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 16,
            paddingVertical: 8,
        },
        statItem: {
            alignItems: 'center',
            marginHorizontal: 20,
        },
        statNumber: {
            fontSize: 18,
            fontWeight: '800',
            color: COLORS.primary,
        },
        statLabel: {
            fontSize: 12,
            color: '#6B7280',
            marginTop: 2,
            fontWeight: '500',
        },
    };

    return (
        <Modal
            visible={visible}
            animationType="none"
            transparent={true}
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
                <TouchableOpacity
                    style={{ flex: 1 }}
                    activeOpacity={1}
                    onPress={onClose}
                />
                <Animated.View
                    style={[
                        styles.notificationModalContent,
                        {
                            transform: [
                                { translateY: slideAnim },
                                { scale: scaleAnim }
                            ]
                        }
                    ]}
                >
                    <View style={styles.modalHandle} />

                    <LinearGradient
                        colors={['#FF6B35', '#F7931E', '#FFB74D']}
                        style={styles.modalHeaderGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <View style={styles.headerTop}>
                            <View style={styles.titleContainer}>
                                <Text style={styles.modalTitleGradient}>
                                    Notifications
                                </Text>
                                {unreadCount > 0 && (
                                    <Text style={styles.unreadCounterGradient}>
                                        {unreadCount} new
                                    </Text>
                                )}
                            </View>
                            <TouchableOpacity
                                onPress={onClose}
                                style={styles.closeButtonGradient}
                                activeOpacity={0.8}
                            >
                                <MaterialIcons name="close" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.headerSubtitleGradient}>
                            Stay updated with your community
                        </Text>
                    </LinearGradient>

                    <CategoryFilter />

                    <ScrollView
                        style={styles.scrollView}
                        showsVerticalScrollIndicator={false}
                        bounces={true}
                    >
                        {filteredNotifications.length === 0 ? (
                            <View style={styles.emptyState}>
                                <View style={styles.emptyStateIcon}>
                                    <MaterialIcons name="notifications-off" size={64} color="#D1D5DB" />
                                </View>
                                <Text style={styles.emptyStateText}>
                                    No notifications here
                                </Text>
                                <Text style={styles.emptyStateSubtext}>
                                    {selectedCategory === 'all'
                                        ? "You're all caught up! 🎉"
                                        : `No ${selectedCategory} notifications yet`
                                    }
                                </Text>
                            </View>
                        ) : (
                            filteredNotifications.map((notification, index) => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                    index={index}
                                />
                            ))
                        )}
                    </ScrollView>

                    {filteredNotifications.length > 0 && (
                        <View style={styles.modalFooter}>
                            <View style={styles.footerStats}>
                                <View style={styles.statItem}>
                                    <Text style={styles.statNumber}>{filteredNotifications.length}</Text>
                                    <Text style={styles.statLabel}>Total</Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Text style={styles.statNumber}>{unreadCount}</Text>
                                    <Text style={styles.statLabel}>Unread</Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Text style={styles.statNumber}>
                                        {filteredNotifications.length - unreadCount}
                                    </Text>
                                    <Text style={styles.statLabel}>Read</Text>
                                </View>
                            </View>

                            <View style={styles.footerButtons}>
                                {unreadCount > 0 ? (
                                    <>
                                        <TouchableOpacity
                                            style={[styles.footerButton, styles.primaryButton]}
                                            onPress={markAllAsRead}
                                            activeOpacity={0.8}
                                        >
                                            <Text style={styles.buttonText}>
                                                Mark All Read
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.footerButton, styles.secondaryButton]}
                                            onPress={clearAllNotifications}
                                            activeOpacity={0.8}
                                        >
                                            <Text style={styles.buttonText}>
                                                Clear All
                                            </Text>
                                        </TouchableOpacity>
                                    </>
                                ) : (
                                    <TouchableOpacity
                                        style={[styles.footerButton, styles.singleButton]}
                                        onPress={clearAllNotifications}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={styles.buttonText}>
                                            Clear All Notifications
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    )}
                </Animated.View>
            </Animated.View>
        </Modal>
    );
};

export default NotificationModal;