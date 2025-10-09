import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { postOrderCreate, registerUser, verifyPayment } from '../../api/user_api';
import { COLORS } from '../../styles/colors';

const RegisterPaymentScreen = ({ route }) => {

    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const registrationData = route?.params?.registrationData || {};
    const [finalRegistrationData, setFinalRegistrationData] = useState({});

    useEffect(() => {
        const processedData = {
            first_name: registrationData.firstname?.value || '',
            middle_name: registrationData.middlename?.value || '',
            last_name: registrationData.lastname?.value || '',
            date_of_birth: registrationData.dob?.value || '',
            gender: registrationData.gender?.value || '',

            email: registrationData.email?.value || '',
            password: registrationData.password?.value || '',
            mobile_number: registrationData.mobile_number?.value || '',
            address: registrationData.address?.value || '',

            education: registrationData.education?.value || '',
            job_occupation: registrationData.job?.value || '',
            marital_status: registrationData.marital_status?.value || '',

            state: registrationData.state?.value || '',
            city: registrationData.city?.value || '',
            village: registrationData.village?.value || '',
            pincode: registrationData.pincode?.value || '',

            device_token: registrationData.device_token?.value || '',
        };
        setFinalRegistrationData(processedData);
    }, [registrationData]);

    const createRazorpayOrder = async (amount) => {
        try {
            const payload = {
                amount: amount,
                currency: 'INR',
                receipt: `receipt_${Date.now()}`,
                notes: {
                    user_id: finalRegistrationData.email,
                    registration_type: 'new_user',
                }
            };

            const response = await postOrderCreate(payload);
            return response;
        } catch (error) {
            console.error('Error creating Razorpay order:', error);
            throw error;
        }
    };

    const handlePayment = async () => {
        setIsLoading(true);
        try {
            if (!RazorpayCheckout || typeof RazorpayCheckout.open !== 'function') {
                throw new Error('Razorpay is not properly initialized');
            }

            const orderData = await createRazorpayOrder(100);

            const options = {
                description: 'Registration Fee Payment',
                image: 'https://your-app-logo-url.com/logo.png',
                currency: 'INR',
                key: orderData?.order?.key,
                amount: orderData?.order?.amount,
                order_id: orderData?.order?.id,
                name: 'Panchal Samaj',
                prefill: {
                    email: finalRegistrationData.email,
                    contact: finalRegistrationData.mobile_number,
                    name: `${finalRegistrationData.first_name} ${finalRegistrationData.last_name}`,
                },
                theme: {
                    color: COLORS.primary,
                },
                modal: {
                    ondismiss: () => {
                        setIsLoading(false);
                    },
                },
                notes: {
                    user_id: finalRegistrationData.email,
                    registration_type: 'new_user',
                },
                retry: {
                    enabled: true,
                    max_count: 3,
                },
            };

            RazorpayCheckout.open(options)
                .then((data) => {
                    handlePaymentSuccess(data);
                })
                .catch((error) => {
                    handlePaymentFailure(error);
                });

        } catch (error) {
            setIsLoading(false);
            console.error('Payment initialization error:', error);
        }
    };

    const registerHandler = (payment_id) => {
        const payloadRegister = {
            firstname: registrationData.firstname?.value || '',
            middlename: registrationData.middlename?.value || '',
            lastname: registrationData.lastname?.value || '',
            dob: registrationData.dob?.value || '',
            gender: registrationData.gender?.value || '',

            email: registrationData.email?.value || '',
            password: registrationData.password?.value || '',
            mobile_number: registrationData.mobile_number?.value || '',
            address: registrationData.address?.value || '',

            education: registrationData.education?.value || '',
            job: registrationData.job?.value || '',
            marital_status: registrationData.marital_status?.value || '',

            state: registrationData.state?.value || '',
            city: registrationData.city?.value || '',
            locations_id: registrationData.village?.value || '',
            pincode: registrationData.pincode?.value || '',

            device_token: registrationData.device_token?.value || '',
            payment_id: payment_id || '',
        }
        registerUser(payloadRegister)
            .then((response) => {
                console.log('User registered successfully:', response);
            })
            .catch((error) => {
                console.error('User registration failed:', error);
            });
    }

    const handlePaymentSuccess = async (paymentData) => {
        try {
            const payload = {
                payment_id: paymentData.razorpay_payment_id,
                order_id: paymentData.razorpay_order_id,
                signature: paymentData.razorpay_signature,
                registration_data: finalRegistrationData,
                forReason: 'registration',
            };

            const verificationResponse = await verifyPayment(payload);

            if (verificationResponse.success) {
                const updatedRegistrationData = {
                    ...finalRegistrationData,
                    payment_id: paymentData.razorpay_payment_id,
                    order_id: paymentData.razorpay_order_id,
                    payment_date: new Date().toISOString(),
                };

                registerHandler(paymentData.razorpay_payment_id);
                setIsLoading(false);

                navigation.navigate('SuccessPayment', {
                    registrationData: updatedRegistrationData,
                    paymentData,
                });
            } else {
                throw new Error('Payment verification failed');
            }
        } catch (error) {
            setIsLoading(false);
            console.error('Payment verification error:', error);

            Alert.alert(
                'Payment Verification Failed',
                'Your payment was successful but verification failed. Please contact support.',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            navigation.navigate('FailPayment', {
                                registrationData: finalRegistrationData,
                                error: 'verification_failed',
                                paymentId: paymentData.razorpay_payment_id,
                            });
                        }
                    }
                ]
            );
        }
    };

    const handlePaymentFailure = (error) => {
        setIsLoading(false);

        let errorCode = 'payment_failed';

        if (error.code === 'PAYMENT_CANCELLED') {
            errorMessage = 'Payment was cancelled.';
            errorCode = 'payment_cancelled';
        } else if (error.code === 'NETWORK_ERROR') {
            errorMessage = 'Network error. Please check your connection and try again.';
            errorCode = 'network_error';
        }

        navigation.navigate('FailPayment', {
            registrationData: finalRegistrationData,
            error: errorCode,
        });
    };

    const handleBack = () => {
        navigation?.goBack();
    };

    const handleEdit = () => {
        navigation.goBack();
    };

    const getDisplayValue = (data, fallback = 'N/A') => {
        if (!data) return fallback;
        if (typeof data === 'object') {
            return data.value || data.label || fallback;
        }
        return data || fallback;
    };

    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
                    <MaterialIcons name="arrow-back-ios" color="#fff" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Payment Confirmation</Text>
                <TouchableOpacity onPress={handleEdit} activeOpacity={0.7}>
                    <MaterialIcons name="edit" color="#fff" size={24} />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.headerRegisterPage}>
                        <Text style={styles.pageTitle}>Complete Your Registration</Text>
                        <Text style={styles.pageSubtitle}>Please review your information before payment</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Personal Information</Text>
                        <View style={styles.orderSummaryCard}>
                            <View style={styles.orderRow}>
                                <Text style={styles.orderLabel}>First Name:</Text>
                                <Text style={styles.orderValue}>{getDisplayValue(registrationData.firstname)}</Text>
                            </View>
                            {registrationData.middlename?.value && (
                                <View style={styles.orderRow}>
                                    <Text style={styles.orderLabel}>Middle Name:</Text>
                                    <Text style={styles.orderValue}>{getDisplayValue(registrationData.middlename)}</Text>
                                </View>
                            )}
                            <View style={styles.orderRow}>
                                <Text style={styles.orderLabel}>Last Name:</Text>
                                <Text style={styles.orderValue}>{getDisplayValue(registrationData.lastname)}</Text>
                            </View>
                            <View style={styles.orderRow}>
                                <Text style={styles.orderLabel}>Date of Birth:</Text>
                                <Text style={styles.orderValue}>{getDisplayValue(registrationData.dob)}</Text>
                            </View>
                            <View style={styles.orderRow}>
                                <Text style={styles.orderLabel}>Gender:</Text>
                                <Text style={styles.orderValue}>{registrationData.gender?.label || 'N/A'}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Contact Information</Text>
                        <View style={styles.orderSummaryCard}>
                            <View style={styles.orderRow}>
                                <Text style={styles.orderLabel}>Email:</Text>
                                <Text style={styles.orderValue}>{getDisplayValue(registrationData.email)}</Text>
                            </View>
                            <View style={styles.orderRow}>
                                <Text style={styles.orderLabel}>Phone Number:</Text>
                                <Text style={styles.orderValue}>{getDisplayValue(registrationData.mobile_number)}</Text>
                            </View>
                            {registrationData.address?.value && (
                                <View style={styles.orderRow}>
                                    <Text style={styles.orderLabel}>Address:</Text>
                                    <Text style={styles.orderValue}>{getDisplayValue(registrationData.address)}</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Professional Information</Text>
                        <View style={styles.orderSummaryCard}>
                            {registrationData.education?.value && (
                                <View style={styles.orderRow}>
                                    <Text style={styles.orderLabel}>Education:</Text>
                                    <Text style={styles.orderValue}>{registrationData.education?.label || 'N/A'}</Text>
                                </View>
                            )}
                            {registrationData.job?.value && (
                                <View style={styles.orderRow}>
                                    <Text style={styles.orderLabel}>Job/Occupation:</Text>
                                    <Text style={styles.orderValue}>{getDisplayValue(registrationData.job)}</Text>
                                </View>
                            )}
                            {registrationData.marital_status?.value && (
                                <View style={styles.orderRow}>
                                    <Text style={styles.orderLabel}>Marital Status:</Text>
                                    <Text style={styles.orderValue}>{registrationData.marital_status?.label || 'N/A'}</Text>
                                </View>
                            )}
                            {(!registrationData.education?.value && !registrationData.job?.value && !registrationData.marital_status?.value) && (
                                <View style={styles.orderRow}>
                                    <Text style={styles.orderValue}>No professional information provided</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Location Information</Text>
                        <View style={styles.orderSummaryCard}>
                            <View style={styles.orderRow}>
                                <Text style={styles.orderLabel}>State:</Text>
                                <Text style={styles.orderValue}>{getDisplayValue(registrationData.state)}</Text>
                            </View>
                            <View style={styles.orderRow}>
                                <Text style={styles.orderLabel}>City:</Text>
                                <Text style={styles.orderValue}>{getDisplayValue(registrationData.city)}</Text>
                            </View>
                            {registrationData.village?.value && (
                                <View style={styles.orderRow}>
                                    <Text style={styles.orderLabel}>Village:</Text>
                                    <Text style={styles.orderValue}>{registrationData.village?.label || 'N/A'}</Text>
                                </View>
                            )}
                            <View style={styles.orderRow}>
                                <Text style={styles.orderLabel}>Pincode:</Text>
                                <Text style={styles.orderValue}>{getDisplayValue(registrationData.pincode)}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Registration Fee</Text>
                        <View style={styles.orderSummaryCard}>
                            <View style={styles.orderRow}>
                                <Text style={styles.orderLabel}>Registration Fee:</Text>
                                <Text style={styles.orderValue}>₹100</Text>
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.orderRow}>
                                <Text style={styles.orderTotalLabel}>Total Amount:</Text>
                                <Text style={styles.orderTotalValue}>₹100</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Registration Summary</Text>
                        <View style={styles.summaryCard}>
                            <View style={styles.summaryRow}>
                                <MaterialIcons name="person" size={20} color={COLORS.primary} />
                                <Text style={styles.summaryText}>
                                    {finalRegistrationData.first_name} {finalRegistrationData.last_name}
                                </Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <MaterialIcons name="email" size={20} color={COLORS.primary} />
                                <Text style={styles.summaryText}>{finalRegistrationData.email}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <MaterialIcons name="phone" size={20} color={COLORS.primary} />
                                <Text style={styles.summaryText}>{finalRegistrationData.mobile_number}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <MaterialIcons name="location-on" size={20} color={COLORS.primary} />
                                <Text style={styles.summaryText}>
                                    {finalRegistrationData.city}, {finalRegistrationData.state} - {finalRegistrationData.pincode}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.paymentButton, isLoading && styles.paymentButtonDisabled]}
                        onPress={handlePayment}
                        activeOpacity={0.7}
                        disabled={isLoading}
                    >
                        <View style={styles.paymentButtonContent}>
                            {isLoading && (
                                <MaterialIcons name="hourglass-empty" size={20} color={COLORS.white} />
                            )}
                            <Text style={styles.paymentButtonText}>
                                {isLoading ? 'Processing...' : 'Pay ₹100 for Registration'}
                            </Text>
                        </View>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    keyboardView: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 120,
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
        fontSize: 20,
        fontWeight: '600',
        color: '#fff',
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 10,
    },
    headerRegisterPage: {
        alignItems: 'center',
        paddingVertical: 20,
        marginBottom: 10,
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.darkGray,
        marginBottom: 8,
        textAlign: 'center',
    },
    pageSubtitle: {
        fontSize: 16,
        color: COLORS.gray,
        textAlign: 'center',
        fontWeight: '400',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.darkGray,
        marginBottom: 12,
    },
    orderSummaryCard: {
        backgroundColor: COLORS.card || COLORS.white,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 3.84,
        elevation: 3,
    },
    orderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
        paddingVertical: 4,
    },
    orderLabel: {
        fontSize: 15,
        color: COLORS.gray,
        fontWeight: '500',
        flex: 1,
    },
    orderValue: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.darkGray,
        flex: 1.5,
        textAlign: 'right',
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: 12,
    },
    orderTotalLabel: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.darkGray,
    },
    orderTotalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.secondary || COLORS.primary,
    },
    summaryCard: {
        backgroundColor: COLORS.card || COLORS.white,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 3.84,
        elevation: 3,
    },
    summaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    summaryText: {
        fontSize: 16,
        color: COLORS.darkGray,
        fontWeight: '500',
        marginLeft: 12,
        flex: 1,
    },
    paymentButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        padding: 18,
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4.65,
        elevation: 6,
    },
    paymentButtonDisabled: {
        backgroundColor: COLORS.gray,
        shadowOpacity: 0.1,
        elevation: 2,
    },
    paymentButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    paymentButtonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: '600',
    },
    debugSection: {
        marginBottom: 20,
        opacity: 0.7,
    },
    debugTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.gray,
        marginBottom: 8,
    },
    debugCard: {
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    debugText: {
        fontSize: 10,
        color: '#666',
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
});

export default RegisterPaymentScreen;