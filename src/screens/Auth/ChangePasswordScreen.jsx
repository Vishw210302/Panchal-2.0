import { useNavigation } from '@react-navigation/native';
import { useState, useEffect, useRef } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Alert
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../../styles/colors';
import { changeCurrentPassword } from '../../api/user_api';
import { useUser } from '../../context/UserContext';
import InputField from '../../components/common/InputField';

const ChangePasswordScreen = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [memberId, setMemberId] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [secureCurrent, setSecureCurrent] = useState(true);
    const [secureNew, setSecureNew] = useState(true);
    const [secureConfirm, setSecureConfirm] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [fieldErrors, setFieldErrors] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const navigation = useNavigation();
    const {userData} = useUser()
    
    // Add refs for text inputs
    const currentPasswordRef = useRef(null);
    const newPasswordRef = useRef(null);
    const confirmPasswordRef = useRef(null);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            setIsLoading(true);
            if (userData) {
                // const parsedUserData = JSON.parse(userData);
                setMemberId(userData._id);
            } else {
                setErrorMessage('Unable to load user data. Please login again.');
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            setErrorMessage('Failed to load user data');
        } finally {
            setIsLoading(false);
        }
    };

    const clearMessages = () => {
        setErrorMessage('');
        setSuccessMessage('');
        setFieldErrors({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
    };

    const validateForm = () => {
        clearMessages();
        let isValid = true;
        const newFieldErrors = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        };

        if (!currentPassword) {
            newFieldErrors.currentPassword = 'Current password is required';
            isValid = false;
        }

        if (!newPassword) {
            newFieldErrors.newPassword = 'New password is required';
            isValid = false;
        } else if (newPassword.length < 6) {
            newFieldErrors.newPassword = 'Password must be at least 6 characters long';
            isValid = false;
        }

        if (!confirmPassword) {
            newFieldErrors.confirmPassword = 'Please confirm your password';
            isValid = false;
        } else if (newPassword !== confirmPassword) {
            newFieldErrors.confirmPassword = 'New password and confirm password do not match';
            isValid = false;
        }

        if (newPassword && currentPassword && newPassword === currentPassword) {
            newFieldErrors.newPassword = 'New password cannot be the same as current password';
            isValid = false;
        }

        if (!memberId) {
            setErrorMessage('User information not found. Please login again.');
            isValid = false;
        }

        setFieldErrors(newFieldErrors);
        return isValid;
    };

    const handleChangePassword = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            setIsLoading(true);
            clearMessages();
            
            const response = await changeCurrentPassword({
                memberId,
                currentPassword,
                newPassword
            });

            if (response.status) {
                setSuccessMessage('Your password has been changed successfully!');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                
                // Navigate back after 2 seconds
                setTimeout(() => {
                    navigation.navigate('settings');
                }, 2000);
            } else {
                setErrorMessage(response.message || 'Failed to change password');
            }
        } catch (error) {
            console.error('Password change error:', error);
            
            let errorMsg = 'Failed to change password. Please try again.';
            
            if (error.response) {
                errorMsg = error.response.data?.message || errorMsg;
            } else if (error.request) {
                errorMsg = 'Network error. Please check your connection.';
            }
            
            setErrorMessage(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        if (currentPassword || newPassword || confirmPassword) {
            // Use Alert instead of setErrorMessage to avoid re-render
            Alert.alert(
                'Unsaved Changes',
                'You have unsaved changes. Are you sure you want to go back?',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel'
                    },
                    {
                        text: 'Discard',
                        style: 'destructive',
                        onPress: () => navigation.navigate('settings')
                    }
                ]
            );
            return;
        }
        navigation.navigate('settings');
    };

    if (isLoading && !memberId) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView 
            style={styles.safeArea}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
            <View style={styles.header}>
                <TouchableOpacity activeOpacity={0.7} onPress={handleBack}>
                    <MaterialIcons name="arrow-back-ios" color="#ffffffff" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Change Password</Text>
            </View>
            
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.scrollContent}
                // showsVerticalScrollIndicator={false}
                // keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.title}>Change Password</Text>
                <Text style={styles.subtitle}>
                    For your account's security, please choose a strong password with at least 6 characters.
                </Text>

                {/* Error Message */}
                {errorMessage ? (
                    <View style={styles.errorContainer}>
                        <Ionicons name="warning-outline" size={20} color={COLORS.error} />
                        <Text style={styles.errorText}>{errorMessage}</Text>
                    </View>
                ) : null}

                {/* Success Message */}
                {successMessage ? (
                    <View style={styles.successContainer}>
                        <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.success} />
                        <Text style={styles.successText}>{successMessage}</Text>
                    </View>
                ) : null}

                <InputField
                    label="Current Password"
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    secureTextEntry={secureCurrent}
                    toggleSecure={() => setSecureCurrent(!secureCurrent)}
                    error={fieldErrors.currentPassword}
                    inputRef={currentPasswordRef}
                    onSubmitEditing={() => newPasswordRef.current?.focus()}
                />

                <InputField
                    label="New Password"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={secureNew}
                    toggleSecure={() => setSecureNew(!secureNew)}
                    error={fieldErrors.newPassword}
                    inputRef={newPasswordRef}
                    onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                />

                <InputField
                    label="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={secureConfirm}
                    toggleSecure={() => setSecureConfirm(!secureConfirm)}
                    error={fieldErrors.confirmPassword}
                    inputRef={confirmPasswordRef}
                />

                <TouchableOpacity
                    style={[
                        styles.button,
                        isLoading && styles.buttonDisabled
                    ]}
                    onPress={handleChangePassword}
                    activeOpacity={0.7}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color={COLORS.white} size="small" />
                    ) : (
                        <Text style={styles.buttonText}>Update Password</Text>
                    )}
                </TouchableOpacity>

                <View style={styles.passwordRequirements}>
                    <Text style={styles.requirementsTitle}>Password Requirements:</Text>
                    <Text style={styles.requirement}>• At least 6 characters long</Text>
                    <Text style={styles.requirement}>• Different from current password</Text>
                    <Text style={styles.requirement}>• New and confirm password must match</Text>
                </View>

            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: COLORS.gray,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 80,
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
        color: COLORS.white,
        marginLeft: 15,
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    scrollContent: {
        paddingVertical: 30,
        flexGrow: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.darkGray,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.gray,
        marginBottom: 25,
        lineHeight: 20,
    },
    // Error and Success Messages
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFE6E6',
        padding: 12,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.error,
        marginBottom: 20,
    },
    errorText: {
        color: COLORS.error,
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 8,
        flex: 1,
    },
    successContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E6FFE6',
        padding: 12,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.success,
        marginBottom: 20,
    },
    successText: {
        color: COLORS.success,
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 8,
        flex: 1,
    },
    buttonDisabled: {
        backgroundColor: COLORS.gray,
        opacity: 0.6,
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
      buttonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    
    passwordRequirements: {
        marginTop: 25,
        padding: 15,
        backgroundColor: COLORS.lightGray,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary,
    },
    requirementsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.darkGray,
        marginBottom: 8,
    },
    requirement: {
        fontSize: 14,
        color: COLORS.gray,
        marginBottom: 4,
        lineHeight: 16,
    },
});

export default ChangePasswordScreen;