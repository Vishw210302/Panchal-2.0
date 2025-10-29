import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Linking,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../styles/colors';
import FAQsPageListing from './FAQsPageListing';
import { getSettings } from '../../api/user_api';
import HeaderBack from '../../components/common/HeaderBack';


const HelpAndSupportScreen = () => {
    const navigation = useNavigation();
    const scrollY = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    // ✅ State for dynamic email and phone
    const [supportEmail, setSupportEmail] = useState('');
    const [supportPhone, setSupportPhone] = useState('');

    useEffect(() => {
        fetchSupportDetails();

        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 50,
                friction: 8,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    // ✅ Fetch from API properly
    const fetchSupportDetails = async () => {
        try {
            const email = await getSettings('support_email');
            const phone = await getSettings('support_phone');
            console.log(email[0].value, 'Settings fetched');
            console.log(phone[0].value, 'Settings fetched');
            setSupportEmail(email[0].value || 'support@panchalsamaj.com');
            setSupportPhone(phone[0].value || '+919876543210');
        } catch (error) {
            console.error('Error fetching settings:', error);
            setSupportEmail('support@panchalsamaj.com');
            setSupportPhone('+919876543210');
        }
    };

    const handleBack = () => {
        navigation?.goBack();
    };

    function openDialer() {
        if (!supportPhone) {
            Alert.alert('Error', 'Support phone number not available.');
            return;
        }

        Alert.alert(
            "Call Support",
            `Do you want to call our support team at ${supportPhone}?`,
            [
                { text: "Cancel", style: "cancel" },
                { text: "Call", onPress: () => Linking.openURL(`tel:${supportPhone}`) }
            ]
        );
    }

    function openEmail() {
        if (!supportEmail) {
            Alert.alert('Error', 'Support email not available.');
            return;
        }

        const subject = "Support Request - Panchal Samaj App";
        const body = "Hi Support Team,\n\nI need help with:\n\n";
        Linking.openURL(`mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    }

    const headerBackgroundColor = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [COLORS.primary, `${COLORS.primary}`],
        extrapolate: 'clamp',
    });

    const contactMethods = [
        {
            id: 1,
            title: "Call Support",
            subtitle: "24/7 Available",
            detail: supportPhone || 'Loading...',
            icon: "phone",
            color: COLORS.primary,
            action: openDialer,
            description: "Get instant help from our support team"
        },
        {
            id: 2,
            title: "Email Support",
            subtitle: "Response in 2-4 hours",
            detail: supportEmail || 'Loading...',
            icon: "email",
            color: COLORS.secondary,
            action: openEmail,
            description: "Send us detailed queries via email"
        },
    ];

    const renderContactCard = (contact, index) => (
        <Animated.View
            key={contact.id}
            style={[
                styles.contactCard,
                {
                    transform: [
                        {
                            translateY: slideAnim.interpolate({
                                inputRange: [0, 50],
                                outputRange: [0, index * 20],
                            })
                        }
                    ]
                }
            ]}
        >
            <TouchableOpacity
                onPress={contact.action}
                activeOpacity={0.8}
                style={styles.contactCardContent}
            >
                <View style={[styles.contactIconContainer, { backgroundColor: contact.color }]}>
                    <MaterialIcons name={contact.icon} size={28} color={COLORS.white} />
                    <View style={styles.iconGlow} />
                </View>
                <View style={styles.contactInfo}>
                    <Text style={styles.contactTitle}>{contact.title}</Text>
                    <Text style={styles.contactSubtitle}>{contact.subtitle}</Text>
                    <Text style={styles.contactDetail}>{contact.detail}</Text>
                    <Text style={styles.contactDescription}>{contact.description}</Text>
                </View>
                <MaterialIcons name="arrow-forward-ios" size={16} color={COLORS.gray} />
            </TouchableOpacity>
        </Animated.View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
            <HeaderBack title="Help & Support" navigation={navigation} />

            <Animated.ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
            >
                <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
                    <View style={styles.sectionTitle}>
                        <MaterialIcons name="support-agent" size={24} color={COLORS.primary} />
                        <Text style={styles.mainTitle}>Contact Support</Text>
                    </View>
                    <Text style={styles.sectionDescription}>
                        Choose your preferred way to reach our support team
                    </Text>
                    <View style={styles.contactContainer}>
                        {contactMethods.map(renderContactCard)}
                    </View>
                </Animated.View>

                <FAQsPageListing />
            </Animated.ScrollView>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        paddingTop: Platform.OS === 'ios' ? 45 : 45,
        paddingHorizontal: 20,
        paddingBottom: 15,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    backButton: {
        padding: 8,
        marginRight: 15,
    },
    headerTitleContainer: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 21,
        fontWeight: '700',
        color: '#fff',
    },
    scrollContainer: {
        paddingBottom: 30,
    },
    section: {
        marginVertical: 25,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 8,
    },
    mainTitle: {
        fontSize: 21,
        fontWeight: '700',
        color: COLORS.darkGray,
    },
    sectionDescription: {
        fontSize: 15,
        color: COLORS.gray,
        marginBottom: 15,
        lineHeight: 20,
    },
    contactContainer: {
        gap: 15,
    },
    contactCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        overflow: 'hidden',
    },
    contactCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 18,
    },
    contactIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        position: 'relative',
        elevation: 2,
    },
    iconGlow: {
        position: 'absolute',
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    contactInfo: {
        flex: 1,
    },
    contactTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.darkGray,
        marginBottom: 2,
    },
    contactSubtitle: {
        fontSize: 12,
        color: COLORS.accent,
        fontWeight: '500',
        marginBottom: 4,
    },
    contactDetail: {
        fontSize: 14,
        color: COLORS.gray,
        marginBottom: 4,
    },
    contactDescription: {
        fontSize: 12,
        color: COLORS.gray,
        fontStyle: 'italic',
    },
});

export default HelpAndSupportScreen;
