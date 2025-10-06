import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { changePassword, resetPassword, verifyOtp } from '../../api/user_api';
import { COLORS } from '../../styles/colors';

const ForgotPasswordScreen = () => {

    const [currentStep, setCurrentStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [otpError, setOtpError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigation = useNavigation();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        return password.length >= 8;
    };

    const handleSendResetLink = async () => {
        setEmailError('');

        if (!email) {
            setEmailError('Email address is required');
            return;
        }

        if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address');
            return;
        }

        setIsLoading(true);

        try {
            const response = await resetPassword({ email: email.trim() });

            if (response && response.status) {
                setCurrentStep(2);
            } else {
                const errorMessage = response?.message || 'Failed to send reset link. Please try again.';
                setEmailError(errorMessage);
            }
        } catch (error) {
            if (error.response) {
                const status = error.response.status;
                const responseData = error.response.data;

                if (status === 404) {
                    const errorMessage = responseData?.message || 'Email address not found. Please check and try again.';
                    setEmailError(errorMessage);
                } else if (status === 400) {
                    const errorMessage = responseData?.message || 'Invalid request. Please check your email address.';
                    setEmailError(errorMessage);
                } else if (status === 500) {
                    const errorMessage = 'Server error. Please try again later.';
                    setEmailError(errorMessage);
                } else {
                    const errorMessage = responseData?.message || `Error: ${status}. Please try again.`;
                    setEmailError(errorMessage);
                }
            } else if (error.request) {
                const errorMessage = 'Network error. Please check your internet connection and try again.';
                setEmailError(errorMessage);
            } else {
                const errorMessage = 'An unexpected error occurred. Please try again.';
                setEmailError(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        setOtpError('');

        if (!otp) {
            setOtpError('OTP is required');
            return;
        }

        if (otp.length !== 6) {
            setOtpError('Please enter a valid 6-digit OTP');
            return;
        }

        setIsLoading(true);

        try {
            const response = await verifyOtp({ email: email.trim(), otp: otp.trim() });

            if (response && response.status) {
                setCurrentStep(3);
            } else {
                const errorMessage = response?.message || 'Invalid OTP. Please try again.';
                setOtpError(errorMessage);
            }
        } catch (error) {
            if (error.response) {
                const status = error.response.status;
                const responseData = error.response.data;

                if (status === 400) {
                    const errorMessage = responseData?.message || 'Invalid or expired OTP. Please try again.';
                    setOtpError(errorMessage);
                } else if (status === 404) {
                    const errorMessage = responseData?.message || 'OTP not found. Please request a new one.';
                    setOtpError(errorMessage);
                } else if (status === 500) {
                    const errorMessage = 'Server error. Please try again later.';
                    setOtpError(errorMessage);
                } else {
                    const errorMessage = responseData?.message || `Error: ${status}. Please try again.`;
                    setOtpError(errorMessage);
                }
            } else if (error.request) {
                const errorMessage = 'Network error. Please check your internet connection and try again.';
                setOtpError(errorMessage);
            } else {
                const errorMessage = 'An unexpected error occurred. Please try again.';
                setOtpError(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangePassword = async () => {
        setPasswordError('');
        setConfirmPasswordError('');

        if (!newPassword) {
            setPasswordError('New password is required');
            return;
        }

        if (!validatePassword(newPassword)) {
            setPasswordError('Password must be at least 8 characters long');
            return;
        }

        if (!confirmPassword) {
            setConfirmPasswordError('Please confirm your password');
            return;
        }

        if (newPassword !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            const response = await changePassword({
                email: email.trim(),
                password: newPassword.trim()
            });

            if (response && response.status) {
                navigation.goBack();
            } else {
                const errorMessage = response?.message || 'Failed to change password. Please try again.';
                setPasswordError(errorMessage);
            }
        } catch (error) {
            if (error.response) {
                const status = error.response.status;
                const responseData = error.response.data;

                if (status === 400) {
                    const errorMessage = responseData?.message || 'Invalid request. Please try again.';
                    setPasswordError(errorMessage);
                } else if (status === 404) {
                    const errorMessage = responseData?.message || 'Session expired. Please start over.';
                    setPasswordError(errorMessage);
                } else if (status === 500) {
                    const errorMessage = 'Server error. Please try again later.';
                    setPasswordError(errorMessage);
                } else {
                    const errorMessage = responseData?.message || `Error: ${status}. Please try again.`;
                    setPasswordError(errorMessage);
                }
            } else if (error.request) {
                const errorMessage = 'Network error. Please check your internet connection and try again.';
                setPasswordError(errorMessage);
            } else {
                const errorMessage = 'An unexpected error occurred. Please try again.';
                setPasswordError(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        } else {
            navigation?.goBack();
        }
    };

    const handleEmailChange = (text) => {
        setEmail(text);
        if (emailError) {
            setEmailError('');
        }
    };

    const handleOtpChange = (text) => {
        const numericText = text.replace(/[^0-9]/g, '');
        if (numericText.length <= 6) {
            setOtp(numericText);
            if (otpError) {
                setOtpError('');
            }
        }
    };

    const handleNewPasswordChange = (text) => {
        setNewPassword(text);
        if (passwordError) {
            setPasswordError('');
        }
    };

    const handleConfirmPasswordChange = (text) => {
        setConfirmPassword(text);
        if (confirmPasswordError) {
            setConfirmPasswordError('');
        }
    };

    const handleResendOtp = () => {
        setOtp('');
        setOtpError('');
        handleSendResetLink();
    };

    const getStepTitle = () => {
        switch (currentStep) {
            case 1:
                return 'Forgot Password';
            case 2:
                return 'Verify OTP';
            case 3:
                return 'New Password';
            default:
                return 'Forgot Password';
        }
    };

    const getStepIcon = () => {
        switch (currentStep) {
            case 1:
                return 'lock-reset';
            case 2:
                return 'security';
            case 3:
                return 'lock-outline';
            default:
                return 'lock-reset';
        }
    };

    const getStepDescription = () => {
        switch (currentStep) {
            case 1:
                return 'Enter your registered email address and we\'ll send you a verification code.';
            case 2:
                return `We've sent a 6-digit verification code to ${email}. Please enter it below.`;
            case 3:
                return 'Create a new secure password for your account.';
            default:
                return '';
        }
    };

    const renderStepIndicator = () => {
        return (
            <View style={styles.stepIndicatorContainer}>
                {[1, 2, 3].map((step) => (
                    <View key={step} style={styles.stepIndicatorRow}>
                        <View style={[
                            styles.stepCircle,
                            currentStep >= step && styles.stepCircleActive,
                            currentStep === step && styles.stepCircleCurrent
                        ]}>
                            <Text style={[
                                styles.stepNumber,
                                currentStep >= step && styles.stepNumberActive
                            ]}>
                                {step}
                            </Text>
                        </View>
                        {step < 3 && (
                            <View style={[
                                styles.stepLine,
                                currentStep > step && styles.stepLineActive
                            ]} />
                        )}
                    </View>
                ))}
            </View>
        );
    };

    const renderEmailForm = () => {
        return (
            <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email Address</Text>
                    <View style={[
                        styles.inputWrapper,
                        emailError && styles.inputWrapperError
                    ]}>
                        <Ionicons name="mail-outline" size={20} color={emailError ? COLORS.error : COLORS.gray} />
                        <TextInput
                            value={email}
                            onChangeText={handleEmailChange}
                            placeholder="Enter your email"
                            placeholderTextColor={COLORS.gray}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            editable={!isLoading}
                            style={styles.input}
                        />
                    </View>
                    {emailError ? (
                        <Text style={styles.errorText}>{emailError}</Text>
                    ) : null}
                </View>

                <TouchableOpacity
                    activeOpacity={0.7}
                    style={[
                        styles.button,
                        isLoading && styles.buttonDisabled
                    ]}
                    onPress={handleSendResetLink}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator color={COLORS.white} size="small" />
                            <Text style={styles.buttonText}>Sending...</Text>
                        </View>
                    ) : (
                        <Text style={styles.buttonText}>Send Verification Code</Text>
                    )}
                </TouchableOpacity>
            </View>
        );
    };

    const renderOtpForm = () => {
        return (
            <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Verification Code</Text>
                    <View style={[
                        styles.inputWrapper,
                        otpError && styles.inputWrapperError
                    ]}>
                        <MaterialIcons name="security" size={20} color={otpError ? COLORS.error : COLORS.gray} />
                        <TextInput
                            value={otp}
                            onChangeText={handleOtpChange}
                            placeholder="Enter 6-digit code"
                            placeholderTextColor={COLORS.gray}
                            keyboardType="number-pad"
                            maxLength={6}
                            editable={!isLoading}
                            style={[styles.input, styles.otpInput]}
                        />
                    </View>
                    {otpError ? (
                        <Text style={styles.errorText}>{otpError}</Text>
                    ) : null}
                </View>

                <TouchableOpacity
                    activeOpacity={0.7}
                    style={[
                        styles.button,
                        isLoading && styles.buttonDisabled
                    ]}
                    onPress={handleVerifyOtp}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator color={COLORS.white} size="small" />
                            <Text style={styles.buttonText}>Verifying...</Text>
                        </View>
                    ) : (
                        <Text style={styles.buttonText}>Verify Code</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.resendContainer}
                    onPress={handleResendOtp}
                    activeOpacity={0.7}
                    disabled={isLoading}
                >
                    <Text style={styles.resendText}>Didn't receive the code? </Text>
                    <Text style={[styles.resendText, styles.resendLink]}>Resend</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const renderPasswordForm = () => {
        return (
            <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>New Password</Text>
                    <View style={[
                        styles.inputWrapper,
                        passwordError && styles.inputWrapperError
                    ]}>
                        <MaterialIcons name="lock-outline" size={20} color={passwordError ? COLORS.error : COLORS.gray} />
                        <TextInput
                            value={newPassword}
                            onChangeText={handleNewPasswordChange}
                            placeholder="Enter new password"
                            placeholderTextColor={COLORS.gray}
                            secureTextEntry={!showNewPassword}
                            autoCapitalize="none"
                            autoCorrect={false}
                            editable={!isLoading}
                            style={styles.input}
                        />
                        <TouchableOpacity
                            onPress={() => setShowNewPassword(!showNewPassword)}
                            style={styles.eyeIcon}
                        >
                            <Ionicons
                                name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                                size={20}
                                color={COLORS.gray}
                            />
                        </TouchableOpacity>
                    </View>
                    {passwordError ? (
                        <Text style={styles.errorText}>{passwordError}</Text>
                    ) : null}
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Confirm Password</Text>
                    <View style={[
                        styles.inputWrapper,
                        confirmPasswordError && styles.inputWrapperError
                    ]}>
                        <MaterialIcons name="lock-outline" size={20} color={confirmPasswordError ? COLORS.error : COLORS.gray} />
                        <TextInput
                            value={confirmPassword}
                            onChangeText={handleConfirmPasswordChange}
                            placeholder="Confirm new password"
                            placeholderTextColor={COLORS.gray}
                            secureTextEntry={!showConfirmPassword}
                            autoCapitalize="none"
                            autoCorrect={false}
                            editable={!isLoading}
                            style={styles.input}
                        />
                        <TouchableOpacity
                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            style={styles.eyeIcon}
                        >
                            <Ionicons
                                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                                size={20}
                                color={COLORS.gray}
                            />
                        </TouchableOpacity>
                    </View>
                    {confirmPasswordError ? (
                        <Text style={styles.errorText}>{confirmPasswordError}</Text>
                    ) : null}
                </View>

                <TouchableOpacity
                    activeOpacity={0.7}
                    style={[
                        styles.button,
                        isLoading && styles.buttonDisabled
                    ]}
                    onPress={handleChangePassword}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator color={COLORS.white} size="small" />
                            <Text style={styles.buttonText}>Updating...</Text>
                        </View>
                    ) : (
                        <Text style={styles.buttonText}>Update Password</Text>
                    )}
                </TouchableOpacity>

                <View style={styles.passwordRequirements}>
                    <Text style={styles.requirementsTitle}>Password Requirements:</Text>
                    <Text style={styles.requirementsText}>• At least 8 characters long</Text>
                    <Text style={styles.requirementsText}>• Mix of letters and numbers recommended</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
                    <MaterialIcons name="arrow-back-ios" color="#fff" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{getStepTitle()}</Text>
            </View>

            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {renderStepIndicator()}

                <View style={styles.infoSection}>
                    <View style={styles.infoIconContainer}>
                        <MaterialIcons name={getStepIcon()} size={48} color={COLORS.primary} />
                    </View>
                    <Text style={styles.infoTitle}>{getStepTitle()}</Text>
                    <Text style={styles.infoDescription}>
                        {getStepDescription()}
                    </Text>
                </View>

                {currentStep === 1 && renderEmailForm()}
                {currentStep === 2 && renderOtpForm()}
                {currentStep === 3 && renderPasswordForm()}

                {currentStep === 1 && (
                    <TouchableOpacity
                        style={styles.backToLoginContainer}
                        onPress={handleBack}
                        activeOpacity={0.7}
                    >
                        <MaterialIcons name="arrow-back" size={18} color={COLORS.primary} />
                        <Text style={styles.backToLoginText}>Back to Login</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        height: 100,
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
        color: "#fff"
    },
    scrollContent: {
        paddingVertical: 30,
    },
    stepIndicatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
    },
    stepIndicatorRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stepCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: COLORS.lightGray,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: COLORS.border,
    },
    stepCircleActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    stepCircleCurrent: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
        transform: [{ scale: 1.1 }],
    },
    stepNumber: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.gray,
    },
    stepNumberActive: {
        color: COLORS.white,
    },
    stepLine: {
        width: 40,
        height: 2,
        backgroundColor: COLORS.border,
        marginHorizontal: 5,
    },
    stepLineActive: {
        backgroundColor: COLORS.primary,
    },
    infoSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    infoIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: `${COLORS.primary}15`,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    infoTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: COLORS.darkGray,
        marginBottom: 10,
        textAlign: 'center',
    },
    infoDescription: {
        fontSize: 14,
        color: COLORS.gray,
        textAlign: 'center',
        lineHeight: 20,
        paddingHorizontal: 10,
    },
    formContainer: {
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.darkGray,
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.card,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 2,
    },
    inputWrapperError: {
        borderColor: COLORS.error,
        borderWidth: 2,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: COLORS.darkGray,
        paddingVertical: 12,
        marginLeft: 8,
    },
    otpInput: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600',
        letterSpacing: 8,
    },
    eyeIcon: {
        padding: 5,
    },
    errorText: {
        color: COLORS.error,
        fontSize: 12,
        marginTop: 6,
        marginLeft: 4,
        fontWeight: '500',
    },
    button: {
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: COLORS.black,
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    buttonDisabled: {
        backgroundColor: COLORS.gray,
        shadowOpacity: 0.05,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginLeft: 8,
    },
    resendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        paddingVertical: 10,
    },
    resendText: {
        fontSize: 14,
        color: COLORS.gray,
    },
    resendLink: {
        color: COLORS.primary,
        fontWeight: '600',
    },
    passwordRequirements: {
        backgroundColor: `${COLORS.primary}08`,
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
        borderLeftWidth: 3,
        borderLeftColor: COLORS.primary,
    },
    requirementsTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.darkGray,
        marginBottom: 8,
    },
    requirementsText: {
        fontSize: 13,
        color: COLORS.gray,
        marginBottom: 4,
    },
    backToLoginContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        paddingVertical: 10,
    },
    backToLoginText: {
        fontSize: 15,
        color: COLORS.primary,
        fontWeight: '600',
        marginLeft: 6,
    },
});

export default ForgotPasswordScreen;
