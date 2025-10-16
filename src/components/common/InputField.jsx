import { memo, useCallback } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../styles/colors";
import Ionicons from 'react-native-vector-icons/Ionicons';

const InputField = memo(({
    label,
    value,
    onChangeText,
    secureTextEntry,
    toggleSecure,
    error,
    editable = true,
    inputRef,
    onSubmitEditing,
}) => {
    // Memoize the change handler
    const handleChangeText = useCallback((text) => {
        console.log(text, "changeText");
        onChangeText(text);
    }, [onChangeText]);

    return (
        <View style={styles.inputContainer}>
            <Text style={styles.label}>{label}</Text>
            <View style={[
                styles.inputWrapper,
                !editable && styles.inputDisabled,
                error && styles.inputError
            ]}>
                <TextInput
                    ref={inputRef}
                    value={value}
                    onChangeText={handleChangeText}
                    placeholder={label}
                    placeholderTextColor={COLORS.gray}
                    secureTextEntry={secureTextEntry}
                    style={[styles.input, !editable && styles.textDisabled]}
                    editable={editable}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="password"
                    importantForAutofill="yes"
                    textContentType="password"
                    returnKeyType={onSubmitEditing ? "next" : "done"}
                    onSubmitEditing={onSubmitEditing}
                    blurOnSubmit={!onSubmitEditing}
                />
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={toggleSecure}
                    disabled={!editable}
                    style={styles.eyeIcon}
                >
                    <Ionicons
                        name={secureTextEntry ? 'eye-off-outline' : 'eye-outline'}
                        size={22}
                        color={editable ? COLORS.gray : COLORS.lightGray}
                    />
                </TouchableOpacity>
            </View>
            {error ? <Text style={styles.fieldErrorText}>{error}</Text> : null}
        </View>
    );
});

InputField.displayName = 'InputField';

const styles = StyleSheet.create({
    inputContainer: {
        marginBottom: 15,
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
        paddingHorizontal: 16,
        minHeight: 50,
    },
    inputError: {
        borderColor: COLORS.error,
        backgroundColor: '#FFF5F5',
    },
    inputDisabled: {
        backgroundColor: COLORS.lightBackground,
        borderColor: COLORS.lightGray,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: COLORS.darkGray,
        paddingVertical: 12,
        paddingRight: 8,
        includeFontPadding: false,
    },
    textDisabled: {
        color: COLORS.gray,
    },
    fieldErrorText: {
        color: COLORS.error,
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
        fontWeight: '500',
    },
    eyeIcon: {
        padding: 4,
        marginLeft: 4,
    },
})

export default InputField;