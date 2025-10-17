import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getVillagesListing, updateMember } from '../../api/user_api';
import { COLORS } from '../../styles/colors';
import { useUser } from '../../context/UserContext';
import HeaderBack from '../../components/common/HeaderBack';

const EditProfile = () => {
    const [formData, setFormData] = useState({
        firstname: { value: '', label: '' },
        middlename: { value: '', label: '' },
        lastname: { value: '', label: '' },
        email: { value: '', label: '' },
        mobile_number: { value: '', label: '' },
        dob: { value: '', label: '', displayValue: '', dateObject: null },
        gender: { value: '', label: '' },
        education: { value: '', label: '' },
        job: { value: '', label: '' },
        state: { value: '', label: '' },
        city: { value: '', label: '' },
        village: { value: '', label: '' },
        pincode: { value: '', label: '' },
        marital_status: { value: '', label: '' },
        address: { value: '', label: '' },
    });

    const [modalVisible, setModalVisible] = useState(false);
    const [currentSelector, setCurrentSelector] = useState('');
    const [selectorOptions, setSelectorOptions] = useState([]);
    const [errors, setErrors] = useState({});
    const [villageOptions, setVillageOptions] = useState([]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [userId, setUserId] = useState(null);
    const { userData, setUserData } = useUser()

    const navigation = useNavigation();

    const genderOptions = [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
        { label: 'Other', value: 'Other' },
    ];

    const educationOptions = [
        { label: 'Primary School', value: 'primary' },
        { label: 'High School', value: 'high_school' },
        { label: 'Higher Secondary', value: 'higher_secondary' },
        { label: 'Bachelor\'s Degree', value: 'bachelor' },
        { label: 'Master\'s Degree', value: 'master' },
        { label: 'PhD', value: 'phd' },
        { label: 'Diploma', value: 'diploma' },
        { label: 'ITI/Trade Certificate', value: 'iti' },
        { label: 'Professional Course', value: 'professional' },
        { label: 'Other', value: 'other' },
    ];

    const maritalStatusOptions = [
        { label: 'Single', value: 'single' },
        { label: 'Married', value: 'married' },
        { label: 'Divorced', value: 'divorced' },
        { label: 'Widowed', value: 'widowed' },
        { label: 'Separated', value: 'separated' },
    ];

    useEffect(() => {
        loadVillages();
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            setIsLoading(true);

            if (userData) {
                setUserId(userData._id || userData.id);

                // Parse date of birth
                let dobDate = null;
                let dobDisplay = '';
                if (userData.dob) {
                    dobDate = new Date(userData.dob);
                    dobDisplay = `${dobDate.getDate().toString().padStart(2, '0')}/${(dobDate.getMonth() + 1).toString().padStart(2, '0')}/${dobDate.getFullYear()}`;
                    setSelectedDate(dobDate);
                }

                // Find labels for dropdown values
                const genderLabel = genderOptions.find(g => g.value === userData.gender)?.label || userData.gender;
                const educationLabel = educationOptions.find(e => e.value === userData.education)?.label || userData.education;
                const maritalLabel = maritalStatusOptions.find(m => m.value === userData.marital_status)?.label || userData.marital_status;
                const userVillageId =
                    typeof userData.locations_id === "object"
                        ? userData.locations_id._id
                        : userData.locations_id;
                const selectedVillage = villageOptions.find(
                    (v) => String(v.value) === String(userVillageId)
                );


                setFormData({
                    firstname: { value: userData.firstname || '', label: 'First Name' },
                    middlename: { value: userData.middlename || '', label: 'Middle Name' },
                    lastname: { value: userData.lastname || '', label: 'Last Name' },
                    email: { value: userData.email || '', label: 'Email' },
                    mobile_number: { value: userData.mobile_number?.toString() || '', label: 'Mobile Number' },
                    dob: {
                        value: userData.dob || '',
                        label: 'Date of Birth',
                        displayValue: dobDisplay,
                        dateObject: dobDate
                    },
                    gender: { value: userData.gender || '', label: genderLabel },
                    education: { value: userData.education || '', label: educationLabel },
                    job: { value: userData.job || '', label: 'Job' },
                    state: { value: userData.state || '', label: 'State' },
                    city: { value: userData.city || '', label: 'City' },
                    village: {
                        value: userData.locations_id || '',
                        label: selectedVillage ? selectedVillage.label : 'Select Village',
                    }, pincode: { value: userData.pincode || '', label: 'Pincode' },
                    marital_status: { value: userData.marital_status || '', label: maritalLabel },
                    address: { value: userData.address || '', label: 'Address' },
                });
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            Alert.alert('Error', 'Failed to load user data');
        } finally {
            setIsLoading(false);
        }
    };

    const loadVillages = async () => {
        try {
            const res = await getVillagesListing();
            if (res && Array.isArray(res)) {
                const transformedVillages = res.map(village => ({
                    label: village.nameE,
                    value: village._id,
                    nameG: village.nameG
                }));
                setVillageOptions(transformedVillages);
            } else if (res && res.data && Array.isArray(res.data)) {
                const transformedVillages = res.data.map(village => ({
                    label: village.nameE,
                    value: village._id,
                    nameG: village.nameG
                }));
                setVillageOptions(transformedVillages);
            }
        } catch (err) {
            console.error('Fetch villages failed:', err);
        }
    };

    const updateField = (field, value, label = '') => {
        setFormData(prev => ({
            ...prev,
            [field]: {
                value: value,
                label: label || value
            }
        }));

        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const updateDOBField = (dateObject, displayValue, label) => {
        const formattedValue = dateObject ? dateObject.toISOString() : '';

        setFormData(prev => ({
            ...prev,
            dob: {
                value: formattedValue,
                displayValue: displayValue,
                label: label,
                dateObject: dateObject
            }
        }));

        if (errors.dob) {
            setErrors(prev => ({ ...prev, dob: null }));
        }
    };

    const openSelector = (field, options) => {
        setCurrentSelector(field);
        setSelectorOptions(options);
        setModalVisible(true);
    };

    const selectOption = (value, label) => {
        updateField(currentSelector, value, label);
        setModalVisible(false);
    };

    const openDatePicker = () => {
        setShowDatePicker(true);
    };

    const handleDateChange = (event, date) => {
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }

        if (date) {
            setSelectedDate(date);
            const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
            updateDOBField(date, formattedDate, 'Date of Birth');
        }
    };

    const closeDatePicker = () => {
        setShowDatePicker(false);
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^[6-9]\d{9}$/;
        return phoneRegex.test(phone.replace(/\D/g, ''));
    };

    const validatePincode = (pincode) => {
        const pincodeRegex = /^\d{6}$/;
        return pincodeRegex.test(pincode);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstname?.value?.trim()) {
            newErrors.firstname = 'First name is required';
        } else if (formData.firstname.value.trim().length < 2) {
            newErrors.firstname = 'First name must be at least 2 characters';
        }

        if (!formData.middlename?.value?.trim()) {
            newErrors.middlename = 'Middle name is required';
        } else if (formData.middlename.value.trim().length < 2) {
            newErrors.middlename = 'Middle name must be at least 2 characters';
        }

        if (!formData.lastname?.value?.trim()) {
            newErrors.lastname = 'Last name is required';
        } else if (formData.lastname.value.trim().length < 2) {
            newErrors.lastname = 'Last name must be at least 2 characters';
        }

        if (!formData.dob?.dateObject && !formData.dob?.value) {
            newErrors.dob = 'Date of birth is required';
        } else if (formData.dob?.dateObject) {
            const today = new Date();
            const hundredYearsAgo = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());

            if (formData.dob.dateObject > today) {
                newErrors.dob = 'Date of birth cannot be in the future';
            } else if (formData.dob.dateObject < hundredYearsAgo) {
                newErrors.dob = 'Please enter a valid date of birth';
            }
        }

        if (!formData.gender?.value) {
            newErrors.gender = 'Gender is required';
        }

        if (!formData.email?.value?.trim()) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email.value.trim())) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.mobile_number?.value?.trim()) {
            newErrors.mobile_number = 'Mobile number is required';
        } else if (!validatePhone(formData.mobile_number.value)) {
            newErrors.mobile_number = 'Please enter a valid 10-digit mobile number';
        }

        if (formData.job?.value && formData.job.value.trim().length < 2) {
            newErrors.job = 'Job title must be at least 2 characters if provided';
        }

        if (!formData.state?.value?.trim()) {
            newErrors.state = 'State is required';
        } else if (formData.state.value.trim().length < 2) {
            newErrors.state = 'State name must be at least 2 characters';
        }

        if (!formData.city?.value?.trim()) {
            newErrors.city = 'City is required';
        } else if (formData.city.value.trim().length < 2) {
            newErrors.city = 'City name must be at least 2 characters';
        }

        if (!formData.pincode?.value?.trim()) {
            newErrors.pincode = 'Pincode is required';
        } else if (!validatePincode(formData.pincode.value)) {
            newErrors.pincode = 'Please enter a valid 6-digit pincode';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleUpdateProfile = async () => {
        if (!validateForm()) {
            Alert.alert('Validation Error', 'Please fill all required fields correctly.');
            return;
        }

        if (!userId) {
            Alert.alert('Error', 'User ID not found. Please login again.');
            return;
        }

        try {
            setIsUpdating(true);

            const updateData = {
                id: userId,
                firstname: formData.firstname.value.trim(),
                middlename: formData.middlename.value.trim(),
                lastname: formData.lastname.value.trim(),
                email: formData.email.value.trim(),
                mobile_number: parseInt(formData.mobile_number.value.trim()),
                dob: formData.dob.value,
                gender: formData.gender.value,
                education: formData.education.value,
                job: formData.job.value.trim(),
                state: formData.state.value.trim(),
                city: formData.city.value.trim(),
                locations_id: formData.village.value,
                pincode: formData.pincode.value.trim(),
                marital_status: formData.marital_status.value,
                address: formData.address.value.trim(),
            };
            const response = await updateMember(userId, updateData);
            console.log(response && response.status, 'Update Response');
            if (response && response.status) {
                setUserData(response.member)

                Alert.alert(
                    'Success',
                    'Profile updated successfully!',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                navigation.navigate('settings');
                            }
                        }
                    ]
                );
            } else {
                Alert.alert('Error', response?.message || 'Failed to update profile');
            }
        } catch (error) {
            // console.error('Error updating profile:', error);
            Alert.alert('Error', error.message);
        } finally {
            setIsUpdating(false);
        }
    };

    const renderSelectorModal = () => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>
                            {currentSelector === 'gender' && 'Select Gender'}
                            {currentSelector === 'marital_status' && 'Select Marital Status'}
                            {currentSelector === 'village' && 'Select Village'}
                            {currentSelector === 'education' && 'Select Education'}
                        </Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                            activeOpacity={0.7}
                        >
                            <MaterialIcons name="close" size={20} color={COLORS.gray} />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={selectorOptions}
                        keyExtractor={(item) => item.value.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.optionItem,
                                    formData[currentSelector]?.value === item.value && styles.selectedOption
                                ]}
                                activeOpacity={0.7}
                                onPress={() => selectOption(item.value, item.label)}
                            >
                                <Text style={[
                                    styles.optionText,
                                    formData[currentSelector]?.value === item.value && styles.selectedOptionText
                                ]}>
                                    {item.label}
                                </Text>
                                {formData[currentSelector]?.value === item.value && (
                                    <MaterialIcons name="check" size={20} color={COLORS.primary} />
                                )}
                            </TouchableOpacity>
                        )}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
        </Modal>
    );

    const renderInputField = (label, field, placeholder, options = {}) => (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>
                {label} {options.required && <Text style={styles.required}>*</Text>}
            </Text>
            <TextInput
                style={[
                    styles.input,
                    errors[field] && styles.inputError,
                    options.multiline && styles.textArea
                ]}
                value={formData[field]?.value || ''}
                onChangeText={(text) => updateField(field, text, label)}
                placeholder={placeholder}
                placeholderTextColor={COLORS.gray}
                {...options}
            />
            {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
        </View>
    );

    const renderDatePickerField = (label, field, placeholder, required = false) => (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>
                {label} {required && <Text style={styles.required}>*</Text>}
            </Text>
            <TouchableOpacity
                activeOpacity={0.7}
                style={[
                    styles.selectorInput,
                    errors[field] && styles.inputError
                ]}
                onPress={openDatePicker}
            >
                <Text style={[
                    styles.selectorText,
                    !formData[field]?.displayValue && styles.placeholderText
                ]}>
                    {formData[field]?.displayValue || placeholder}
                </Text>
                <MaterialIcons name="date-range" size={24} color={COLORS.gray} />
            </TouchableOpacity>
            {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
            {showDatePicker && (
                <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                    minimumDate={new Date(1900, 0, 1)}
                    onTouchCancel={closeDatePicker}
                />
            )}
            {Platform.OS === 'ios' && showDatePicker && (
                <View style={styles.iosDatePickerActions}>
                    <TouchableOpacity onPress={closeDatePicker} style={styles.datePickerButton}>
                        <Text style={styles.datePickerButtonText}>Done</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );

    const renderSelectorField = (label, field, placeholder, options, required = false) => (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>
                {label} {required && <Text style={styles.required}>*</Text>}
            </Text>
            <TouchableOpacity
                activeOpacity={0.7}
                style={[
                    styles.selectorInput,
                    errors[field] && styles.inputError
                ]}
                onPress={() => openSelector(field, options)}
            >
                <Text style={[
                    styles.selectorText,
                    !formData[field]?.value && styles.placeholderText
                ]}>
                    {formData[field]?.label || placeholder}
                </Text>
                <MaterialIcons name="keyboard-arrow-down" size={24} color={COLORS.gray} />
            </TouchableOpacity>
            {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
        </View>
    );

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Loading profile...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <HeaderBack 
                    title="Update Profile" 
                    subtitle="Keep your information up to date"
                    navigation={navigation} 
                />

                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={styles.formContainer}>
                        <Text style={styles.sectionTitle}>Personal Information</Text>
                        {renderInputField('First Name', 'firstname', 'Enter your first name', { required: true, autoCapitalize: 'words' })}
                        {renderInputField('Middle Name', 'middlename', 'Enter your middle name', { required: true, autoCapitalize: 'words' })}
                        {renderInputField('Last Name', 'lastname', 'Enter your last name', { required: true, autoCapitalize: 'words' })}
                        {renderDatePickerField('Date of Birth', 'dob', 'Select your date of birth', true)}
                        {renderSelectorField('Gender', 'gender', 'Select your gender', genderOptions, true)}

                        <Text style={styles.sectionTitle}>Contact Information</Text>
                        {renderInputField('Email', 'email', 'Enter your email address', {
                            required: true,
                            keyboardType: 'email-address',
                            autoCapitalize: 'none',
                            autoCorrect: false
                        })}
                        {renderInputField('Mobile Number', 'mobile_number', 'Enter your 10-digit mobile number', {
                            required: true,
                            keyboardType: 'phone-pad',
                            maxLength: 10
                        })}
                        {renderInputField('Address', 'address', 'Enter your complete address', {
                            multiline: true,
                            numberOfLines: 3,
                            autoCapitalize: 'words'
                        })}

                        <Text style={styles.sectionTitle}>Professional Information</Text>
                        {renderSelectorField('Education', 'education', 'Select your education level', educationOptions)}
                        {renderInputField('Job/Occupation', 'job', 'Enter your current job or occupation', { autoCapitalize: 'words' })}
                        {renderSelectorField('Marital Status', 'marital_status', 'Select your marital status', maritalStatusOptions)}

                        <Text style={styles.sectionTitle}>Location Information</Text>
                        {renderInputField('State', 'state', 'Enter your state', { required: true, autoCapitalize: 'words' })}
                        {renderInputField('City', 'city', 'Enter your city', { required: true, autoCapitalize: 'words' })}
                        {renderSelectorField('Village', 'village', 'Select your village', villageOptions)}
                        {renderInputField('Pincode', 'pincode', 'Enter 6-digit pincode', {
                            required: true,
                            keyboardType: 'numeric',
                            maxLength: 6
                        })}
                    </View>
                </ScrollView>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.updateButton, isUpdating && styles.disabledButton]}
                        onPress={handleUpdateProfile}
                        activeOpacity={0.7}
                        disabled={isUpdating}
                    >
                        {isUpdating ? (
                            <View style={styles.loadingButtonContent}>
                                <ActivityIndicator size="small" color={COLORS.white} />
                                <Text style={styles.buttonText}>Updating...</Text>
                            </View>
                        ) : (
                            <Text style={styles.buttonText}>Update Profile</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {renderSelectorModal()}
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: COLORS.gray,
    },
    header: {
        backgroundColor: COLORS.primary,
        paddingBottom: 24,
        height: 100,
        shadowColor: COLORS.black,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 20,
    },
    backButton: {
        marginRight: 10,
        padding: 5,
    },
    headerContent: {
        flex: 1,
        alignItems: 'center',
        marginRight: 35,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.white,
        marginBottom: 4,
        textAlign: 'center',
    },
    headerSubtitle: {
        fontSize: 14,
        color: COLORS.white,
        opacity: 0.9,
        textAlign: 'center',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    formContainer: {
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.darkGray,
        marginTop: 20,
        marginBottom: 16,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.darkGray,
        marginBottom: 8,
    },
    required: {
        color: COLORS.error || '#ff4444',
        fontSize: 16,
    },
    input: {
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: COLORS.darkGray,
        shadowColor: COLORS.black,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    inputError: {
        borderColor: COLORS.error || '#ff4444',
        borderWidth: 2,
    },
    errorText: {
        color: COLORS.error || '#ff4444',
        fontSize: 12,
        marginTop: 4,
        fontWeight: '500',
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
        paddingTop: 14,
    },
    selectorInput: {
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: COLORS.black,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
        minHeight: 52,
    },
    selectorText: {
        fontSize: 16,
        color: COLORS.darkGray,
        flex: 1,
    },
    placeholderText: {
        color: COLORS.gray,
    },
    iosDatePickerActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingTop: 10,
    },
    datePickerButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    datePickerButtonText: {
        color: COLORS.white,
        fontWeight: '600',
        fontSize: 16,
    },
    buttonContainer: {
        padding: 20,
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    updateButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 16,
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
        minHeight: 52,
        justifyContent: 'center',
    },
    disabledButton: {
        backgroundColor: COLORS.gray,
        shadowOpacity: 0.1,
    },
    loadingButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '700',
        marginLeft: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '70%',
        shadowColor: COLORS.black,
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.darkGray,
    },
    closeButton: {
        padding: 8,
        borderRadius: 16,
        backgroundColor: COLORS.lightGray || '#f5f5f5',
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray || '#f5f5f5',
        backgroundColor: COLORS.white,
    },
    selectedOption: {
        backgroundColor: COLORS.lightGray || '#f5f5f5',
    },
    optionText: {
        fontSize: 16,
        color: COLORS.darkGray,
        flex: 1,
    },
    selectedOptionText: {
        fontWeight: '600',
    },
});

export default EditProfile;
