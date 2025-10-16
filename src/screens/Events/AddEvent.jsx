import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { createEvent } from '../../api/user_api';
import { COLORS } from '../../styles/colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useUser } from '../../context/UserContext';

const AddEvent = ({navigation}) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        titleE: '',
        descriptionE: '',
        location: '',
        date: new Date(),
        time: new Date(),
    });
    const [imageData, setImageData] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const {userData} = useUser()

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleImagePicker = () => {
        const options = {
            mediaType: 'photo',
            quality: 0.8,
            maxWidth: 1024,
            maxHeight: 1024,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                Alert.alert('Error', response.errorMessage || 'Failed to pick image');
            } else if (response.assets && response.assets[0]) {
                setImageData(response.assets[0]);
            }
        });
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setFormData(prev => ({
                ...prev,
                date: selectedDate
            }));
        }
    };

    const handleTimeChange = (event, selectedTime) => {
        setShowTimePicker(false);
        if (selectedTime) {
            setFormData(prev => ({
                ...prev,
                time: selectedTime
            }));
        }
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (time) => {
        return time.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const validateForm = () => {
        if (!formData.titleE.trim()) {
            Alert.alert('Validation Error', 'Please enter event title');
            return false;
        }
        if (!formData.descriptionE.trim()) {
            Alert.alert('Validation Error', 'Please enter event description');
            return false;
        }
        if (!formData.location.trim()) {
            Alert.alert('Validation Error', 'Please enter event location');
            return false;
        }
        if (!imageData) {
            Alert.alert('Validation Error', 'Please select an event image');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);
            const parsedUserData = JSON.parse(userData);
            const createdBy = `${parsedUserData.firstname} ${parsedUserData.lastname}`;

            // Prepare form data for multipart/form-data
            const eventFormData = new FormData();
            eventFormData.append('createdBy', createdBy);
            eventFormData.append('titleE', formData.titleE);
            eventFormData.append('descriptionE', formData.descriptionE);
            eventFormData.append('location', formData.location);
            eventFormData.append('date', formData.date.toISOString().split('T')[0]);
            eventFormData.append('time', formatTime(formData.time));

            // Append image
            if (imageData) {
                const imageFile = {
                    uri: imageData.uri,
                    type: imageData.type || 'image/jpeg',
                    name: imageData.fileName || `event_${Date.now()}.jpg`,
                };
                eventFormData.append('image', imageFile);
            }

            // Call API
            const response = await createEvent(eventFormData);
            
            Alert.alert(
                'Success',
                'Event created successfully!',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack()
                    }
                ]
            );
        } catch (error) {
            console.error('Create event error:', error);
            Alert.alert(
                'Error',
                error.message || 'Failed to create event. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity 
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <Text style={styles.backButtonText}>← Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Create New Event</Text>
                </View>

                {/* Image Picker */}
                <TouchableOpacity 
                    style={styles.imagePicker}
                    onPress={handleImagePicker}
                    activeOpacity={0.8}
                >
                    {imageData ? (
                        <Image 
                            source={{ uri: imageData.uri }} 
                            style={styles.selectedImage}
                        />
                    ) : (
                        <View style={styles.imagePickerPlaceholder}>
                            <Text style={styles.imagePickerIcon}>📷</Text>
                            <Text style={styles.imagePickerText}>Tap to select event image</Text>
                        </View>
                    )}
                </TouchableOpacity>

                {/* Form Fields */}
                <View style={styles.formContainer}>
                    {/* Title */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Event Title *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter event title"
                            placeholderTextColor={COLORS.gray}
                            value={formData.titleE}
                            onChangeText={(text) => handleInputChange('titleE', text)}
                        />
                    </View>

                    {/* Description */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Description *</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Enter event description"
                            placeholderTextColor={COLORS.gray}
                            value={formData.descriptionE}
                            onChangeText={(text) => handleInputChange('descriptionE', text)}
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                        />
                    </View>

                    {/* Location */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Location *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter event location"
                            placeholderTextColor={COLORS.gray}
                            value={formData.location}
                            onChangeText={(text) => handleInputChange('location', text)}
                        />
                    </View>

                    {/* Date */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Date *</Text>
                        <TouchableOpacity 
                            style={styles.dateTimeButton}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Text style={styles.dateTimeText}>
                                📅 {formatDate(formData.date)}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {showDatePicker && (
                        <DateTimePicker
                            value={formData.date}
                            mode="date"
                            display="default"
                            onChange={handleDateChange}
                            minimumDate={new Date()}
                        />
                    )}

                    {/* Time */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Time *</Text>
                        <TouchableOpacity 
                            style={styles.dateTimeButton}
                            onPress={() => setShowTimePicker(true)}
                        >
                            <Text style={styles.dateTimeText}>
                                🕐 {formatTime(formData.time)}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {showTimePicker && (
                        <DateTimePicker
                            value={formData.time}
                            mode="time"
                            display="default"
                            onChange={handleTimeChange}
                        />
                    )}
                </View>

                {/* Submit Button */}
                <TouchableOpacity 
                    style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={loading}
                    activeOpacity={0.8}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.submitButtonText}>Create Event</Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
    },
    content: {
        padding: 16,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 24,
    },
    backButton: {
        marginBottom: 12,
    },
    backButtonText: {
        fontSize: 16,
        color: COLORS.primary || '#4A90E2',
        fontWeight: '600',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    imagePicker: {
        width: '100%',
        height: 200,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 24,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    imagePickerPlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
        borderRadius: 16,
    },
    imagePickerIcon: {
        fontSize: 48,
        marginBottom: 8,
    },
    imagePickerText: {
        fontSize: 16,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    selectedImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    formContainer: {
        marginBottom: 24,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        color: '#1A1A1A',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    textArea: {
        height: 120,
        paddingTop: 14,
    },
    dateTimeButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    dateTimeText: {
        fontSize: 16,
        color: '#1A1A1A',
    },
    submitButton: {
        backgroundColor: COLORS.primary || '#4A90E2',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: COLORS.primary || '#4A90E2',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});

export default AddEvent;