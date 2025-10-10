import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { getAboutUsDataListing } from '../../api/user_api';
import { COLORS } from '../../styles/colors';
import OurCodeValuesAboutUs from './OurCodeValuesAboutUs';
import WhatWeDoAboutUs from './WhatWeDoAboutUs';
import ENV from '../../config/env';
import HeaderBack from '../../components/common/HeaderBack';

const { height } = Dimensions.get('window');

const stripHtmlTags = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').trim();
};

const AboutUsScreen = ({ navigation }) => {

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const [aboutUsData, setAboutUsData] = useState(null)

    useEffect(() => {
        StatusBar.setBarStyle('dark-content');

        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            })
        ]).start();

        return () => {
            StatusBar.setBarStyle('default');
        };
    }, []);

    useEffect(() => {
        getAboutUsDataListing()
            .then((res) => {
                let data = null;
                if (res && typeof res === 'object') {
                    data = res;
                } else if (res?.data && typeof res.data === 'object') {
                    data = res.data;
                } else {
                    console.warn('Unexpected about us response:', res);
                }
                setAboutUsData(data);
            })
            .catch((err) => console.error('Fetch about us failed:', err));
    }, []);

    const handleBack = () => {
        navigation?.goBack();
    };

    const displayData = aboutUsData

    if (!displayData) {
        return (
            <View style={styles.container}>
                <HeaderBack title="About Us" navigation={navigation} />
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <HeaderBack title="About Us" navigation={navigation} />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                bounces={true}
            >
                <Animated.View
                    style={[
                        styles.bannerContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}
                >
                    {displayData.image && (
                        <Image
                            source={{
                                uri: ENV.IMAGE_URL + displayData.image
                            }}
                            style={styles.bannerImage}
                            resizeMode="cover"
                        />
                    )}
                    <View style={styles.bannerOverlay}>
                        <View style={styles.bannerContent}>
                            <Text style={styles.bannerTitle}>{displayData.titleE || 'About Us'}</Text>
                            <Text style={styles.bannerSubtitle}>Unity • Heritage • Progress</Text>
                        </View>
                    </View>
                </Animated.View>

                <Animated.View
                    style={[
                        styles.contentContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}
                >
                    <View style={styles.sectionCard}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>About {displayData.titleE || 'Us'}</Text>
                            <View style={styles.titleUnderline} />
                        </View>

                        <Text style={styles.description}>
                            {stripHtmlTags(displayData.descriptionE) || 'Loading description...'}
                        </Text>
                    </View>

                    <OurCodeValuesAboutUs />

                    <WhatWeDoAboutUs />

                </Animated.View>
            </ScrollView>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        paddingBottom: 30,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: Platform.OS === "ios" ? 90 : 100,
        paddingHorizontal: 20,
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
        fontWeight: '600',
        color: '#fff'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 18,
        color: COLORS.darkGray,
        fontWeight: '500',
    },
    bannerContainer: {
        height: height * 0.35,
        position: 'relative',
        backgroundColor: COLORS.lightGray,
    },
    bannerImage: {
        width: '100%',
        height: '100%',
    },
    bannerOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bannerContent: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    bannerTitle: {
        fontSize: 36,
        fontWeight: 'bold',
        color: COLORS.white,
        textAlign: 'center',
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.7)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    bannerSubtitle: {
        fontSize: 18,
        color: COLORS.white,
        textAlign: 'center',
        fontWeight: '500',
        letterSpacing: 2,
        textShadowColor: 'rgba(0, 0, 0, 0.7)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    contentContainer: {
        paddingTop: 20,
    },
    sectionCard: {
        backgroundColor: COLORS.white,
        marginHorizontal: 16,
        marginBottom: 20,
        borderRadius: 16,
        padding: 24,
        shadowColor: COLORS.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    sectionHeader: {
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.darkGray,
        marginBottom: 8,
        textAlign: 'center',
    },
    titleUnderline: {
        width: 60,
        height: 3,
        backgroundColor: COLORS.primary,
        borderRadius: 2,
    },
    description: {
        fontSize: 16,
        lineHeight: 26,
        color: COLORS.darkGray,
        marginBottom: 16,
        textAlign: 'justify',
    },
    visionMissionContainer: {
        gap: 20,
    },
    visionCard: {
        backgroundColor: COLORS.lightGray,
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary,
    },
    missionCard: {
        backgroundColor: COLORS.lightGray,
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        borderLeftWidth: 4,
        borderLeftColor: COLORS.secondary,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconText: {
        fontSize: 24,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.darkGray,
        marginBottom: 8,
        textAlign: 'center',
    },
    cardDescription: {
        fontSize: 14,
        lineHeight: 22,
        color: COLORS.gray,
        textAlign: 'center',
    },
    valuesContainer: {
        gap: 16,
    },
    valueItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: 8,
    },
    valueIcon: {
        fontSize: 24,
        marginRight: 16,
        marginTop: 2,
    },
    valueContent: {
        flex: 1,
    },
    valueTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.darkGray,
        marginBottom: 4,
    },
    valueDescription: {
        fontSize: 14,
        lineHeight: 20,
        color: COLORS.gray,
    },
    servicesContainer: {
        gap: 14,
    },
    serviceItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: 4,
    },
    serviceBullet: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.accent,
        marginTop: 8,
        marginRight: 12,
    },
    serviceContent: {
        flex: 1,
    },
    serviceTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.darkGray,
        marginBottom: 2,
    },
    serviceDescription: {
        fontSize: 13,
        lineHeight: 18,
        color: COLORS.gray,
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 16,
    },
    statItem: {
        width: '48%',
        alignItems: 'center',
        padding: 16,
        backgroundColor: COLORS.lightGray,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.gray,
        textAlign: 'center',
        fontWeight: '500',
    },
    connectDescription: {
        fontSize: 15,
        lineHeight: 24,
        color: COLORS.gray,
        textAlign: 'center',
        marginBottom: 20,
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        gap: 12,
    },
    socialButton: {
        flex: 1,
        alignItems: 'center',
        padding: 12,
        backgroundColor: COLORS.lightGray,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    socialIcon: {
        fontSize: 20,
        marginBottom: 4,
    },
    socialText: {
        fontSize: 12,
        color: COLORS.darkGray,
        fontWeight: '500',
    },
    actionButtonsContainer: {
        paddingHorizontal: 16,
        gap: 16,
    },
    primaryActionButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    primaryActionText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    secondaryButtonsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    secondaryActionButton: {
        flex: 1,
        backgroundColor: COLORS.white,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    secondaryActionText: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: '600',
    },
});

export default AboutUsScreen;
