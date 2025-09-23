import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../styles/colors';

const ChangePasswordScreen = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [secureCurrent, setSecureCurrent] = useState(true);
    const [secureNew, setSecureNew] = useState(true);
    const [secureConfirm, setSecureConfirm] = useState(true);
    const navigation = useNavigation();

    const handleChangePassword = () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'New password and confirm password do not match.');
            return;
        }
        if (newPassword.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters.');
            return;
        }
        Alert.alert('Success', 'Your password has been changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    const handleBack = () => {
        navigation.navigate('settings');
    };

    const InputField = ({
        label,
        value,
        onChangeText,
        secureTextEntry,
        toggleSecure
    }) => (
        <View style={styles.inputContainer}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.inputWrapper}>
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={label}
                    placeholderTextColor={COLORS.gray}
                    secureTextEntry={secureTextEntry}
                    style={styles.input}
                />
                <TouchableOpacity activeOpacity={0.7} onPress={toggleSecure}>
                    <Ionicons
                        name={secureTextEntry ? 'eye-off-outline' : 'eye-outline'}
                        size={22}
                        color={COLORS.gray}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity activeOpacity={0.7} onPress={handleBack}>
                    <MaterialIcons name="arrow-back-ios" color="#000" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
            </View>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.title}>Change Password</Text>
                <Text style={styles.subtitle}>
                    For your account’s security, please choose a strong password.
                </Text>

                <InputField
                    label="Current Password"
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    secureTextEntry={secureCurrent}
                    toggleSecure={() => setSecureCurrent(!secureCurrent)}
                />

                <InputField
                    label="New Password"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={secureNew}
                    toggleSecure={() => setSecureNew(!secureNew)}
                />

                <InputField
                    label="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={secureConfirm}
                    toggleSecure={() => setSecureConfirm(!secureConfirm)}
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleChangePassword}
                    activeOpacity={0.7}
                >
                    <Text style={styles.buttonText}>Update Password</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 15,
        alignItems: 'flex-end',
        textAlign: 'center',
        height: 80,
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
        fontWeight: '600',
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    scrollContent: {
        paddingVertical: 30,
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
    input: {
        flex: 1,
        fontSize: 16,
        color: COLORS.darkGray,
        paddingVertical: 12,
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
});

export default ChangePasswordScreen;
