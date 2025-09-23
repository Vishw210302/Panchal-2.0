import { useEffect, useRef } from 'react';
import {
    Animated,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { COLORS } from '../../styles/colors';

const FailIcon = () => (
    <View style={styles.failIconContainer}>
        <View style={styles.failIcon}>
            <Text style={styles.failMark}>✕</Text>
        </View>
    </View>
);

const FailPaymentScreen = ({ navigation, route }) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const shakeAnim = useRef(new Animated.Value(0)).current;

    const failureData = route?.params || {
        amount: '$129.99',
        transactionId: 'TXN123456789',
        paymentMethod: 'Credit Card ****1234',
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        merchantName: 'Your Store Name',
        failureReason: 'Insufficient funds',
    };

    useEffect(() => {
        StatusBar.setBarStyle('light-content');

        const animationSequence = Animated.sequence([
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 50,
                    friction: 3,
                    useNativeDriver: true,
                }),
                Animated.sequence([
                    Animated.timing(shakeAnim, {
                        toValue: 10,
                        duration: 100,
                        useNativeDriver: true,
                    }),
                    Animated.timing(shakeAnim, {
                        toValue: -10,
                        duration: 100,
                        useNativeDriver: true,
                    }),
                    Animated.timing(shakeAnim, {
                        toValue: 10,
                        duration: 100,
                        useNativeDriver: true,
                    }),
                    Animated.timing(shakeAnim, {
                        toValue: 0,
                        duration: 100,
                        useNativeDriver: true,
                    }),
                ])
            ]),
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 800,
                    useNativeDriver: true,
                })
            ])
        ]);

        setTimeout(() => {
            animationSequence.start();
        }, 300);

        return () => {
            StatusBar.setBarStyle('default');
        };
    }, []);

    const handleTryAgain = () => {
        navigation?.navigate('RegisterPayment');
    };

    const handleGoHome = () => {
        navigation?.navigate('MainTabs');
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLORS.error} barStyle="light-content" />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.headerContainer}>
                    <Animated.View
                        style={[
                            styles.failIconContainerAnimated,
                            {
                                transform: [
                                    { scale: scaleAnim },
                                    { translateX: shakeAnim }
                                ]
                            }
                        ]}
                    >
                        <FailIcon />
                    </Animated.View>

                    <Animated.View
                        style={[
                            styles.headerTextContainer,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }]
                            }
                        ]}
                    >
                        <Text style={styles.failTitle}>Payment Failed</Text>
                        <Text style={styles.failSubtitle}>
                            Unfortunately, your payment could not be processed
                        </Text>
                    </Animated.View>
                </View>

                <Animated.View
                    style={[
                        styles.detailsCard,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}
                >

                    <View style={styles.detailsContainer}>
                        <DetailRow
                            label="Attempted Amount"
                            value={failureData.amount}
                        />
                        <DetailRow
                            label="Transaction ID"
                            value={failureData.transactionId}
                        />
                        <DetailRow
                            label="Payment Method"
                            value={failureData.paymentMethod}
                        />
                        <DetailRow
                            label="Date & Time"
                            value={`${failureData.date} at ${failureData.time}`}
                        />
                        <DetailRow
                            label="Merchant"
                            value={failureData.merchantName}
                        />
                    </View>
                </Animated.View>

                <Animated.View
                    style={[
                        styles.solutionsCard,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}
                >
                    <Text style={styles.solutionsTitle}>Common Solutions</Text>
                    <View style={styles.solutionsList}>
                        <SolutionItem text="Check your account balance" />
                        <SolutionItem text="Verify your card details are correct" />
                        <SolutionItem text="Ensure your card is not expired" />
                        <SolutionItem text="Contact your bank if the issue persists" />
                    </View>
                </Animated.View>

                <Animated.View
                    style={[
                        styles.actionButtonsContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}
                >
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={handleTryAgain}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.primaryButtonText}>Try Again</Text>
                    </TouchableOpacity>

                </Animated.View>

                <Animated.View
                    style={[
                        styles.homeButtonContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}
                >
                    <TouchableOpacity
                        style={styles.homeButton}
                        onPress={handleGoHome}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.homeButtonText}>Go to Home</Text>
                    </TouchableOpacity>
                </Animated.View>
            </ScrollView>
        </View>
    );
};

const DetailRow = ({ label, value }) => (
    <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
    </View>
);

const SolutionItem = ({ text }) => (
    <View style={styles.solutionItem}>
        <View style={styles.solutionBullet} />
        <Text style={styles.solutionText}>{text}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.error,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 30,
    },
    headerContainer: {
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 40,
        paddingHorizontal: 20,
    },
    failIconContainerAnimated: {
        marginBottom: 30,
    },
    failIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.black,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
    failIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.error,
        justifyContent: 'center',
        alignItems: 'center',
    },
    failMark: {
        color: COLORS.white,
        fontSize: 40,
        fontWeight: 'bold',
    },
    headerTextContainer: {
        alignItems: 'center',
    },
    failTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.white,
        textAlign: 'center',
        marginBottom: 8,
    },
    failSubtitle: {
        fontSize: 16,
        color: COLORS.white,
        textAlign: 'center',
        opacity: 0.9,
        lineHeight: 22,
        paddingHorizontal: 10,
    },
    detailsCard: {
        backgroundColor: COLORS.white,
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 24,
        marginBottom: 20,
        shadowColor: COLORS.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: 20,
    },
    detailsContainer: {
        gap: 16,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    detailLabel: {
        fontSize: 15,
        color: COLORS.gray,
        flex: 1,
    },
    detailValue: {
        fontSize: 15,
        color: COLORS.darkGray,
        fontWeight: '500',
        flex: 1.2,
        textAlign: 'right',
    },
    solutionsCard: {
        backgroundColor: COLORS.white,
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 24,
        marginBottom: 30,
        shadowColor: COLORS.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    solutionsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.darkGray,
        marginBottom: 16,
    },
    solutionsList: {
        gap: 12,
    },
    solutionItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingRight: 10,
    },
    solutionBullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.primary,
        marginTop: 8,
        marginRight: 12,
    },
    solutionText: {
        fontSize: 15,
        color: COLORS.darkGray,
        lineHeight: 22,
        flex: 1,
    },
    actionButtonsContainer: {
        paddingHorizontal: 20,
        gap: 12,
    },
    primaryButton: {
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
    primaryButtonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    secondaryButtonText: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: '600',
    },
    tertiaryButton: {
        backgroundColor: COLORS.accent,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    tertiaryButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
    },
    homeButtonContainer: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    homeButton: {
        backgroundColor: 'transparent',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.white,
    },
    homeButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
    },
});

export default FailPaymentScreen;