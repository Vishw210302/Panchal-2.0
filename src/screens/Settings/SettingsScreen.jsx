import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import {
    Alert,
    ScrollView,
    Share,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../styles/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';



const SettingsScreen = () => {

    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [eventReminders, setEventReminders] = useState(true);
    const [newsUpdates, setNewsUpdates] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [locationServices, setLocationServices] = useState(true);
    const [autoSync, setAutoSync] = useState(true);
    const [biometricAuth, setBiometricAuth] = useState(false);
    const [twoFactorAuth, setTwoFactorAuth] = useState(false);
    const navigation = useNavigation();

    const handleProfilePress = () => {

        navigation.navigate('EditProfile');
        // Alert.alert('Profile', 'Navigate to profile editing screen');
    };

    const handleLanguagePress = () => {
        Alert.alert('Language', 'Available: English, Gujarati, Hindi');
    };
    const handleViewFamilyPress = () => {
        navigation.navigate('ViewFamilyList');
        // Alert.alert('Language', 'Available: English, Gujarati, Hindi');
    };

    const handlePrivacyPress = () => {
        navigation.navigate('OwnBussiness');
    };

    const handleTermsPress = () => {
        navigation.navigate('TermsAndConditions');
    };

    const handleShareApp = async () => {
        try {
            await Share.share({
                message: 'Join our Panchal Samaj community! Download the app: https://play.google.com/store/apps/panchal-samaj',
                title: 'Panchal Samaj App',
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleRateApp = () => {
        Alert.alert('Rate App', 'Thank you for rating our app!');
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout', style: 'destructive', onPress: () => {
                        AsyncStorage.removeItem('userData')
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Login' }],
                        });
                    }
                },
            ]
        );

    };

    const SettingsSection = ({ title, children }) => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.sectionContent}>
                {children}
            </View>
        </View>
    );

    const SettingsItem = ({
        icon,
        iconFamily = 'Ionicons',
        title,
        subtitle,
        onPress,
        rightComponent,
        showArrow = true
    }) => (
        <TouchableOpacity
            style={styles.settingsItem}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.settingsItemLeft}>
                <View style={styles.iconContainer}>
                    {iconFamily === 'Ionicons' && <Ionicons name={icon} size={22} color={COLORS.primary} />}
                    {iconFamily === 'MaterialIcons' && <MaterialIcons name={icon} size={22} color={COLORS.primary} />}
                    {iconFamily === 'Feather' && <Feather name={icon} size={22} color={COLORS.primary} />}
                </View>
                <View style={styles.settingsItemText}>
                    <Text style={styles.settingsItemTitle}>{title}</Text>
                    {subtitle && <Text style={styles.settingsItemSubtitle}>{subtitle}</Text>}
                </View>
            </View>
            <View style={styles.settingsItemRight}>
                {rightComponent}
                {showArrow && !rightComponent && (
                    <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
                )}
            </View>
        </TouchableOpacity>
    );

    const ToggleSwitch = ({ value, onValueChange }) => (
        <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{ false: COLORS.border, true: `${COLORS.primary}40` }}
            thumbColor={value ? COLORS.primary : COLORS.gray}
            ios_backgroundColor={COLORS.border}
        />
    );

    const handleBack = () => {
        navigation.navigate('MainTabs');
    };

    const settingsPageNavigation = () => {
        navigation.navigate('ChangePassword');
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

            <View style={styles.header}>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={handleBack}>
                    <MaterialIcons name="arrow-back-ios" color="#fff" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settingsss</Text>
            </View>

            <SettingsSection title="Account">
                <SettingsItem
                    icon="person-outline"
                    title="Edit Profile"
                    subtitle="Update your personal information"
                    onPress={handleProfilePress}
                />
                <SettingsItem
                    icon="shield-checkmark-outline"
                    title="View Family Member"
                    subtitle="Connect with family"
                    onPress={handleViewFamilyPress}
                />
                <SettingsItem
                    icon="shield-checkmark-outline"
                    title="Own Bussiness"
                    subtitle="Manage your account security"
                    onPress={handlePrivacyPress}
                />
                <SettingsItem
                    icon="card-outline"
                    title="Membership"
                    subtitle="Upgrade to Premium"
                    onPress={() => navigation.navigate('MembershipScreen')}
                />
            </SettingsSection>

            <SettingsSection title="Notifications">
                <SettingsItem
                    icon="notifications-outline"
                    title="Push Notifications"
                    subtitle="Receive app notifications"
                    rightComponent={
                        <ToggleSwitch
                            value={notificationsEnabled}
                            onValueChange={setNotificationsEnabled}
                        />
                    }
                    showArrow={false}
                />
                <SettingsItem
                    icon="calendar-outline"
                    title="Event Reminders"
                    subtitle="Get notified about upcoming events"
                    rightComponent={
                        <ToggleSwitch
                            value={eventReminders}
                            onValueChange={setEventReminders}
                        />
                    }
                    showArrow={false}
                />
                <SettingsItem
                    icon="newspaper-outline"
                    title="News Updates"
                    subtitle="Receive community news"
                    rightComponent={
                        <ToggleSwitch
                            value={newsUpdates}
                            onValueChange={setNewsUpdates}
                        />
                    }
                    showArrow={false}
                />
            </SettingsSection>

            <SettingsSection title="Preferences">
                <SettingsItem
                    icon="moon-outline"
                    title="Dark Mode"
                    subtitle="Switch to dark theme"
                    rightComponent={
                        <ToggleSwitch
                            value={darkMode}
                            onValueChange={setDarkMode}
                        />
                    }
                    showArrow={false}
                />
                <SettingsItem
                    icon="language-outline"
                    title="Language"
                    subtitle="English"
                    onPress={handleLanguagePress}
                />
                <SettingsItem
                    icon="location-outline"
                    title="Location Services"
                    subtitle="Find nearby events and members"
                    rightComponent={
                        <ToggleSwitch
                            value={locationServices}
                            onValueChange={setLocationServices}
                        />
                    }
                    showArrow={false}
                />
                <SettingsItem
                    icon="sync-outline"
                    title="Auto Sync"
                    subtitle="Automatically sync data"
                    rightComponent={
                        <ToggleSwitch
                            value={autoSync}
                            onValueChange={setAutoSync}
                        />
                    }
                    showArrow={false}
                />
            </SettingsSection>

            <SettingsSection title="Security">
                <SettingsItem
                    icon="finger-print"
                    iconFamily="MaterialIcons"
                    title="Biometric Authentication"
                    subtitle="Use fingerprint or face ID"
                    rightComponent={
                        <ToggleSwitch
                            value={biometricAuth}
                            onValueChange={setBiometricAuth}
                        />
                    }
                    showArrow={false}
                />
                <SettingsItem
                    icon="security"
                    iconFamily="MaterialIcons"
                    title="Two-Factor Authentication"
                    subtitle="Add an extra layer of security"
                    rightComponent={
                        <ToggleSwitch
                            value={twoFactorAuth}
                            onValueChange={setTwoFactorAuth}
                        />
                    }
                    showArrow={false}
                />
                <SettingsItem
                    icon="lock-outline"
                    title="Change Password"
                    subtitle="Update your password"
                    onPress={() => settingsPageNavigation()}
                />
            </SettingsSection>

            <SettingsSection title="Community">
                <SettingsItem
                    icon="people-outline"
                    title="Family Tree"
                    subtitle="View and manage family connections"
                    onPress={() => Alert.alert('Family Tree', 'Navigate to family tree')}
                />
                <SettingsItem
                    icon="calendar-outline"
                    title="My Events"
                    subtitle="Events you're attending"
                    onPress={() => navigation.navigate('MyEvents')}
                />
                <SettingsItem
                    icon="chatbubbles-outline"
                    title="Community Chat"
                    subtitle="Join community discussions"
                    onPress={() => Alert.alert('Community Chat', 'Join chat rooms')}
                />
                <SettingsItem
                    icon="business-outline"
                    title="Business Directory"
                    subtitle="Find Panchal community businesses"
                    onPress={() => navigation.navigate('BusinessScreen')}
                />
            </SettingsSection>

            <SettingsSection title="Support & About">
                <SettingsItem
                    icon="share-outline"
                    title="Share App"
                    subtitle="Invite friends to join"
                    onPress={handleShareApp}
                />
                <SettingsItem
                    icon="star-outline"
                    title="Rate App"
                    subtitle="Rate us on app store"
                    onPress={handleRateApp}
                />
                <SettingsItem
                    icon="document-text-outline"
                    title="Terms & Conditions"
                    subtitle="Read our terms of service"
                    onPress={handleTermsPress}
                />

            </SettingsSection>

            <View style={styles.logoutSection}>
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    <Ionicons name="log-out-outline" size={22} color={COLORS.error} />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 15,
        marginBottom: 20,
        alignItems: 'flex-end',
        textAlign: 'center',
        height: 100,
        paddingHorizontal: 30,
        paddingVertical: 15,
        backgroundColor: COLORS.primary,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    headerTitle: {
        fontSize: 21,
        color: "#fff",
        fontWeight: '600',
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 15,
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: COLORS.lightGray,
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 18,
        height: 18,
        backgroundColor: COLORS.success,
        borderRadius: 9,
        borderWidth: 3,
        borderColor: COLORS.card,
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.darkGray,
        marginBottom: 3,
    },
    profileEmail: {
        fontSize: 14,
        color: COLORS.gray,
        marginBottom: 3,
    },
    membershipType: {
        fontSize: 12,
        color: COLORS.primary,
        fontWeight: '600',
        backgroundColor: `${COLORS.primary}15`,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        alignSelf: 'flex-start',
    },
    editButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: `${COLORS.primary}15`,
        alignItems: 'center',
        justifyContent: 'center',
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.darkGray,
        marginBottom: 12,
        paddingHorizontal: 20,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    sectionContent: {
        backgroundColor: COLORS.card,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: COLORS.border,
    },
    settingsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: COLORS.card,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    settingsItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: `${COLORS.primary}15`,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    settingsItemText: {
        flex: 1,
    },
    settingsItemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.darkGray,
        marginBottom: 2,
    },
    settingsItemSubtitle: {
        fontSize: 13,
        color: COLORS.gray,
        lineHeight: 18,
    },
    settingsItemRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoutSection: {
        paddingHorizontal: 20,
        marginTop: 10,
        marginBottom: 30,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.card,
        paddingVertical: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: `${COLORS.error}30`,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.error,
        marginLeft: 10,
    },

});

export default SettingsScreen;