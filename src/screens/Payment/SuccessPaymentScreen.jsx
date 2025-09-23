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

const CheckIcon = () => (
    <View style={styles.checkIconContainer}>
        <View style={styles.checkIcon}>
            <Text style={styles.checkMark}>✓</Text>
        </View>
    </View>
);

const SuccessPaymentScreen = ({ navigation, route }) => {

    const scaleAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const { registrationData } = route?.params || {};

    const defaultPaymentData = {
        amount: '$129.99',
        transactionId: 'TXN123456789',
        paymentMethod: 'Credit Card ****1234',
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        merchantName: 'Your Store Name'
    };

    useEffect(() => {
        StatusBar.setBarStyle('light-content');

        const animationSequence = Animated.sequence([
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 3,
                useNativeDriver: true,
            }),
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

    const handleDone = () => {
        navigation?.navigate('MainTabs');
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLORS.success} barStyle="light-content" />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.headerContainer}>
                    <Animated.View
                        style={[
                            styles.successIconContainer,
                            {
                                transform: [{ scale: scaleAnim }]
                            }
                        ]}
                    >
                        <CheckIcon />
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
                        <Text style={styles.successTitle}>Payment Successful!</Text>
                        <Text style={styles.successSubtitle}>
                            Your payment has been processed successfully
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
                    <View style={styles.amountContainer}>
                        <Text style={styles.amountLabel}>Amount Paid</Text>
                        <Text style={styles.amountValue}>
                            {registrationData?.amount || defaultPaymentData.amount}
                        </Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.detailsContainer}>
                        {registrationData && (
                            <>
                                <DetailRow label="Name" value={`${registrationData.first_name} ${registrationData.middle_name} ${registrationData.last_name}`} />
                                <DetailRow label="Email" value={registrationData.email} />
                                <DetailRow label="Mobile" value={registrationData.mobile_number} />

                                <DetailRow label="Payment ID" value={registrationData.payment_id} />
                                <DetailRow label="Payment Date" value={formatDate(registrationData.payment_date)} />
                            </>
                        )}
                    </View>
                </Animated.View>

                <Animated.View
                    style={[
                        styles.doneButtonContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}
                >
                    <TouchableOpacity
                        style={styles.doneButton}
                        onPress={handleDone}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.doneButtonText}>Done</Text>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.success,
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
    successIconContainer: {
        marginBottom: 30,
    },
    checkIconContainer: {
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
    checkIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.success,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkMark: {
        color: COLORS.white,
        fontSize: 40,
        fontWeight: 'bold',
    },
    headerTextContainer: {
        alignItems: 'center',
    },
    successTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.white,
        textAlign: 'center',
        marginBottom: 8,
    },
    successSubtitle: {
        fontSize: 16,
        color: COLORS.white,
        textAlign: 'center',
        opacity: 0.9,
        lineHeight: 22,
    },
    detailsCard: {
        backgroundColor: COLORS.white,
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 24,
        shadowColor: COLORS.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    amountContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    amountLabel: {
        fontSize: 16,
        color: COLORS.gray,
        marginBottom: 8,
    },
    amountValue: {
        fontSize: 36,
        fontWeight: 'bold',
        color: COLORS.success,
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
        alignItems: 'center',
    },
    detailLabel: {
        fontSize: 16,
        color: COLORS.gray,
        flex: 1,
    },
    detailValue: {
        fontSize: 16,
        color: COLORS.darkGray,
        fontWeight: '500',
        flex: 1,
        textAlign: 'right',
    },
    doneButtonContainer: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    doneButton: {
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
    doneButtonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default SuccessPaymentScreen;
