import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getVillagesListing } from '../../api/user_api';
import { COLORS } from '../../styles/colors';

const RegisterScreen = ({ route }) => {

  const [formData, setFormData] = useState({
    firstname: { value: '', label: '' },
    middlename: { value: '', label: '' },
    lastname: { value: '', label: '' },
    email: { value: '', label: '' },
    password: { value: '', label: '' },
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
    relationship: { value: '', label: '' },
    device_token: { value: '', label: '' },
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSelector, setCurrentSelector] = useState('');
  const [selectorOptions, setSelectorOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [villageOptions, setVillageOptions] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const totalSteps = 4;
  const navigation = useNavigation();

  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
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
    getVillagesListing()
      .then((res) => {
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
        } else {
          setVillageOptions([]);
        }
      })
      .catch((err) => {
        console.error('Fetch villages failed:', err);
        setVillageOptions([]);
      });
  }, [])

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

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.firstname?.value?.trim()) {
          newErrors.firstname = 'First name is required';
        } else if (formData.firstname.value.trim().length < 2) {
          newErrors.firstname = 'First name must be at least 2 characters';
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
        break;

      case 2:
        if (!formData.email?.value?.trim()) {
          newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email.value.trim())) {
          newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password?.value?.trim()) {
          newErrors.password = 'Password is required';
        } else if (formData.password.value.length < 6) {
          newErrors.password = 'Password must be at least 6 characters long';
        } else if (formData.password.value.length > 20) {
          newErrors.password = 'Password must not exceed 20 characters';
        }

        if (!formData.mobile_number?.value?.trim()) {
          newErrors.mobile_number = 'Mobile number is required';
        } else if (!validatePhone(formData.mobile_number.value)) {
          newErrors.mobile_number = 'Please enter a valid 10-digit mobile number';
        }
        break;

      case 3:
        if (formData.job?.value && formData.job.value.trim().length < 2) {
          newErrors.job = 'Job title must be at least 2 characters if provided';
        }
        break;

      case 4:
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
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      console.log("Error of Validation")
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      Alert.alert(
        'Go Back?',
        'Are you sure you want to go back? Your progress will be saved.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Go Back', onPress: prevStep }
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      const deviceToken = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const finalFormData = {
        ...formData,
        device_token: { value: deviceToken, label: 'Device Token' }
      };

      console.log('DOB as string value:', finalFormData.dob.value);
      console.log('DOB type:', typeof finalFormData.dob.value);
      console.log('DOB Date object:', finalFormData.dob.dateObject);

      navigation.navigate('RegisterPayment', {
        registrationData: finalFormData
      });
    } else {
      console.log("Validation Error - Please fill all required fields correctly.")
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

  const renderPersonalInfo = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Personal Information</Text>
        <Text style={styles.stepSubtitle}>Step {currentStep} of {totalSteps}</Text>
      </View>

      {renderInputField('First Name', 'firstname', 'Enter your first name', { required: true, autoCapitalize: 'words' })}
      {renderInputField('Middle Name', 'middlename', 'Enter your middle name (optional)', { autoCapitalize: 'words' })}
      {renderInputField('Last Name', 'lastname', 'Enter your last name', { required: true, autoCapitalize: 'words' })}
      {renderDatePickerField('Date of Birth', 'dob', 'Select your date of birth', true)}
      {renderSelectorField('Gender', 'gender', 'Select your gender', genderOptions, true)}
    </View>
  );

  const renderContactInfo = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Contact Information</Text>
        <Text style={styles.stepSubtitle}>Step {currentStep} of {totalSteps}</Text>
      </View>

      {renderInputField('Email', 'email', 'Enter your email address', {
        required: true,
        keyboardType: 'email-address',
        autoCapitalize: 'none',
        autoCorrect: false
      })}

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Password <Text style={styles.required}>*</Text>
        </Text>
        <View style={[
          styles.passwordContainer,
          errors.password && styles.inputError
        ]}>
          <TextInput
            style={styles.passwordInput}
            value={formData.password?.value || ''}
            onChangeText={(text) => updateField('password', text, 'Password')}
            placeholder="Enter your password"
            placeholderTextColor={COLORS.gray}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <MaterialIcons
              name={showPassword ? 'visibility' : 'visibility-off'}
              size={20}
              color={COLORS.gray}
            />
          </TouchableOpacity>
        </View>
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
      </View>

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
    </View>
  );

  const renderProfessionalInfo = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Professional Information</Text>
        <Text style={styles.stepSubtitle}>Step {currentStep} of {totalSteps}</Text>
      </View>

      {renderSelectorField('Education', 'education', 'Select your education level', educationOptions)}
      {renderInputField('Job/Occupation', 'job', 'Enter your current job or occupation', { autoCapitalize: 'words' })}
      {renderSelectorField('Marital Status', 'marital_status', 'Select your marital status', maritalStatusOptions)}
    </View>
  );

  const renderLocationInfo = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Location Information</Text>
        <Text style={styles.stepSubtitle}>Step {currentStep} of {totalSteps}</Text>
      </View>

      {renderInputField('State', 'state', 'Enter your state', { required: true, autoCapitalize: 'words' })}
      {renderInputField('City', 'city', 'Enter your city', { required: true, autoCapitalize: 'words' })}
      {renderSelectorField('Village', 'village', 'Select your village', villageOptions)}
      {renderInputField('Pincode', 'pincode', 'Enter 6-digit pincode', {
        required: true,
        keyboardType: 'numeric',
        maxLength: 6
      })}
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalInfo();
      case 2:
        return renderContactInfo();
      case 3:
        return renderProfessionalInfo();
      case 4:
        return renderLocationInfo();
      default:
        return renderPersonalInfo();
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} activeOpacity={0.7} style={styles.backButton}>
            <MaterialIcons name="arrow-back-ios" color={COLORS.white} size={24} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Create Account</Text>
            <Text style={styles.headerSubtitle}>Join us and get started</Text>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {renderCurrentStep()}
        </ScrollView>

        <View style={styles.buttonContainer}>
          <View style={styles.buttonRow}>
            {currentStep > 1 && (
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.secondaryButton}
                onPress={prevStep}
              >
                <Text style={styles.secondaryButtonText}>Previous</Text>
              </TouchableOpacity>
            )}

            {currentStep < totalSteps ? (
              <TouchableOpacity
                style={[styles.primaryButton, currentStep === 1 && styles.fullWidthButton]}
                onPress={nextStep}
                activeOpacity={0.7}
              >
                <Text style={styles.primaryButtonText}>Next</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.primaryButton}
                onPress={handleSubmit}
              >
                <Text style={styles.primaryButtonText}>Complete Registration</Text>
              </TouchableOpacity>
            )}
          </View>
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
  header: {
    backgroundColor: COLORS.primary,
    paddingBottom: 24,
    height: 140,
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
    marginRight: 3
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
  stepContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  stepHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.darkGray,
    marginBottom: 6,
    textAlign: 'center',
  },
  stepSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '500',
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: COLORS.darkGray,
  },
  eyeButton: {
    padding: 12,
    paddingRight: 16,
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  primaryButton: {
    flex: 1,
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
  fullWidthButton: {
    flex: 1,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 52,
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: COLORS.darkGray,
    fontSize: 16,
    fontWeight: '600',
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
    color: COLORS.primary,
  },
});

export default RegisterScreen;