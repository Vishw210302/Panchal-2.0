import { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator,
    StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import RazorpayCheckout from 'react-native-razorpay';
import { launchImageLibrary } from 'react-native-image-picker';
import { postOrderCreate, verifyPayment, createBusiness, getSubscriptions } from '../../api/user_api';
import { COLORS } from '../../styles/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useUser } from '../../context/UserContext';


const BussinesRequest = ({ navigation }) => {
    const [memberId, setMemberId] = useState('');
    const [user, setUser] = useState({});
    const [businessName, setBusinessName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [images, setImages] = useState([]);
    const [selectedSubscription, setSelectedSubscription] = useState(null);
    const [subscriptions, setSubscriptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingSubscriptions, setIsLoadingSubscriptions] = useState(true);
    const { userData } = useUser()

    const fadeAnim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        initializeData();
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    const initializeData = async () => {
        try {
            // Get user data
            setUser(userData);
            const userId = userData._id;
            setMemberId(userId);

            // Fetch subscriptions
            const subs = await getSubscriptions();
            setSubscriptions(subs);
            setIsLoadingSubscriptions(false);
        } catch (err) {
            console.error('Initialization failed:', err);
            Alert.alert('Error', 'Failed to load data');
            setIsLoadingSubscriptions(false);
        }
    };

    const handleImagePicker = () => {
        const options = {
            mediaType: 'photo',
            quality: 0.8,
            selectionLimit: 5,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
                Alert.alert('Error', 'Failed to pick images');
            } else if (response.assets) {
                setImages([...images, ...response.assets]);
            }
        });
    };

    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
    };

    const validateForm = () => {
        if (!businessName.trim()) {
            Alert.alert('Validation Error', 'Business name is required');
            return false;
        }
        if (!description.trim()) {
            Alert.alert('Validation Error', 'Description is required');
            return false;
        }
        if (!category.trim()) {
            Alert.alert('Validation Error', 'Category is required');
            return false;
        }
        if (!email.trim()) {
            Alert.alert('Validation Error', 'Email is required');
            return false;
        }
        if (!phone.trim()) {
            Alert.alert('Validation Error', 'Phone is required');
            return false;
        }
        if (!address.trim()) {
            Alert.alert('Validation Error', 'Address is required');
            return false;
        }
        if (!selectedSubscription) {
            Alert.alert('Validation Error', 'Please select a subscription plan');
            return false;
        }
        return true;
    };

    const createRazorpayOrder = async (amount) => {
        try {
            const payload = {
                amount: amount,
                currency: 'INR',
                receipt: `receipt_business_${Date.now()}`,
                notes: {
                    member_id: memberId,
                    business_name: businessName,
                    subscription_id: selectedSubscription._id,
                    type: 'business_listing',
                }
            };
            const response = await postOrderCreate(payload);
            return response;
        } catch (error) {
            console.error('Error creating Razorpay order:', error);
            throw error;
        }
    };

    const handlePaymentSuccess = async (paymentData) => {
        setIsLoading(true);
        try {
            // Verify payment
            const verificationPayload = {
                order_id: paymentData.razorpay_order_id,
                payment_id: paymentData.razorpay_payment_id,
                signature: paymentData.razorpay_signature,
                registration_data: {
                    first_name: user.member.firstname,
                    last_name: user.member.lastname,
                    email: user.member.email
                },
                forReason: 'subscription',
            };
            console.log(verificationPayload)
            await verifyPayment(verificationPayload);

            // Create business listing
            const businessData = new FormData();
            businessData.append('memberId', memberId);
            businessData.append('businessName', businessName);
            businessData.append('description', description);
            businessData.append('category', category);
            businessData.append('contact', JSON.stringify({
                email,
                phone,
                address
            }));
            businessData.append('subscriptionId', selectedSubscription._id);
            businessData.append('paymentStatus', 'paid');
            businessData.append('paymentId', paymentData.razorpay_payment_id);
            businessData.append('orderId', paymentData.razorpay_order_id);

            // Append images
            images.forEach((image, index) => {
                businessData.append('images', {
                    uri: image.uri,
                    type: image.type,
                    name: image.fileName || `business_image_${index}.jpg`,
                });
            });
            console.log(businessData, 'Business Data to be sent');
            try {
                await createBusiness(businessData);
                console.log('Business created successfully')
            } catch (error) {
                console.log(error, 'Business creation error');
                throw error;
            }

            setIsLoading(false);
            Alert.alert(
                'Success!',
                'Your business listing has been created successfully.',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack(),
                    },
                ]
            );
        } catch (error) {
            setIsLoading(false);
            console.error('Business creation error:', error);
            Alert.alert('Error', 'Failed to create business listing. Please contact support.');
        }
    };

    const handlePaymentFailure = (error) => {
        setIsLoading(false);
        console.error('Payment failed:', error);
        Alert.alert(
            'Payment Failed',
            error.description || 'Payment was unsuccessful. Please try again.',
            [{ text: 'OK' }]
        );
    };

    const handlePayment = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            if (!RazorpayCheckout || typeof RazorpayCheckout.open !== 'function') {
                throw new Error('Razorpay is not properly initialized');
            }

            const orderData = await createRazorpayOrder(selectedSubscription.price);

            const options = {
                description: `Business Listing - ${selectedSubscription.planName}`,
                image: 'https://your-app-logo-url.com/logo.png',
                currency: 'INR',
                key: orderData?.order?.key,
                amount: orderData?.order?.amount,
                order_id: orderData?.order?.id,
                name: 'Panchal Samaj',
                prefill: {
                    email: email,
                    contact: phone,
                    name: businessName,
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
                    member_id: memberId,
                    business_name: businessName,
                    subscription_id: selectedSubscription._id,
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
            Alert.alert('Error', 'Failed to initialize payment. Please try again.');
        }
    };

    const renderSubscriptionCard = (subscription) => {
        const isSelected = selectedSubscription?._id === subscription._id;
        return (
            <TouchableOpacity
                key={subscription._id}
                style={[styles.subscriptionCard, isSelected && styles.subscriptionCardSelected]}
                onPress={() => setSelectedSubscription(subscription)}
                activeOpacity={0.7}
            >
                <View style={styles.subscriptionHeader}>
                    <View>
                        <Text style={styles.subscriptionName}>{subscription.planName}</Text>
                        <Text style={styles.subscriptionDuration}>
                            {subscription.durationInMonths} months
                        </Text>
                    </View>
                    <View style={styles.subscriptionPriceContainer}>
                        <Text style={styles.subscriptionPrice}>₹{subscription.price}</Text>
                        {isSelected && (
                            <MaterialIcons name="check-circle" size={24} color={COLORS.primary} />
                        )}
                    </View>
                </View>
                <View style={styles.featuresList}>
                    {subscription.features.map((feature, index) => (
                        <View key={index} style={styles.featureItem}>
                            <MaterialIcons name="check" size={16} color="#4caf50" />
                            <Text style={styles.featureText}>{feature}</Text>
                        </View>
                    ))}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
            <Animated.View style={[styles.container, { opacity: fadeAnim }]}>

                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <Icon name="arrow-back" size={24} color={COLORS.white} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Add New Business</Text>
                    <View style={styles.placeholder} />
                </View>

                <ScrollView
                    style={styles.content}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Business Details Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Business Details</Text>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Business Name *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter business name"
                                value={businessName}
                                onChangeText={setBusinessName}
                                placeholderTextColor="#999"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Category *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g., Restaurant, Retail, Services"
                                value={category}
                                onChangeText={setCategory}
                                placeholderTextColor="#999"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Description *</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Describe your business"
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                                placeholderTextColor="#999"
                            />
                        </View>
                    </View>

                    {/* Contact Information Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Contact Information</Text>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Email *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="business@example.com"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                placeholderTextColor="#999"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Phone *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter phone number"
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                                placeholderTextColor="#999"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Address *</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Enter complete address"
                                value={address}
                                onChangeText={setAddress}
                                multiline
                                numberOfLines={3}
                                textAlignVertical="top"
                                placeholderTextColor="#999"
                            />
                        </View>
                    </View>

                    {/* Images Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Business Images</Text>
                        <TouchableOpacity
                            style={styles.imagePickerButton}
                            onPress={handleImagePicker}
                        >
                            <MaterialIcons name="add-photo-alternate" size={24} color={COLORS.primary} />
                            <Text style={styles.imagePickerText}>Add Images (Max 5)</Text>
                        </TouchableOpacity>

                        {images.length > 0 && (
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesContainer}>
                                {images.map((image, index) => (
                                    <View key={index} style={styles.imagePreview}>
                                        <Image source={{ uri: image.uri }} style={styles.previewImage} />
                                        <TouchableOpacity
                                            style={styles.removeImageButton}
                                            onPress={() => removeImage(index)}
                                        >
                                            <MaterialIcons name="close" size={18} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </ScrollView>
                        )}
                    </View>

                    {/* Subscription Plans Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Select Subscription Plan *</Text>
                        {isLoadingSubscriptions ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color={COLORS.primary} />
                                <Text style={styles.loadingText}>Loading plans...</Text>
                            </View>
                        ) : (
                            <View style={styles.subscriptionsContainer}>
                                {subscriptions.map(renderSubscriptionCard)}
                            </View>
                        )}
                    </View>

                    {/* Summary Section */}
                    {selectedSubscription && (
                        <View style={styles.summarySection}>
                            <Text style={styles.summaryTitle}>Payment Summary</Text>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Plan:</Text>
                                <Text style={styles.summaryValue}>{selectedSubscription.planName}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Duration:</Text>
                                <Text style={styles.summaryValue}>
                                    {selectedSubscription.durationInMonths} months
                                </Text>
                            </View>
                            <View style={[styles.summaryRow, styles.summaryTotal]}>
                                <Text style={styles.summaryTotalLabel}>Total Amount:</Text>
                                <Text style={styles.summaryTotalValue}>₹{selectedSubscription.price}</Text>
                            </View>
                        </View>
                    )}

                    <View style={{ height: 100 }} />
                </ScrollView>

                {/* Submit Button */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
                        onPress={handlePayment}
                        disabled={isLoading}
                        activeOpacity={0.8}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <MaterialIcons name="payment" size={24} color="#fff" />
                                <Text style={styles.submitButtonText}>
                                    Proceed to Payment {selectedSubscription ? `(₹${selectedSubscription.price})` : ''}
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: COLORS.primary,
        paddingTop: StatusBar.currentHeight || 40,
        paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    placeholder: {
        width: 40,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 16,
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 15,
        color: '#333',
        backgroundColor: '#fafafa',
    },
    textArea: {
        minHeight: 100,
        paddingTop: 12,
    },
    imagePickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: COLORS.primary,
        borderStyle: 'dashed',
        borderRadius: 8,
        paddingVertical: 16,
        marginBottom: 12,
    },
    imagePickerText: {
        fontSize: 15,
        color: COLORS.primary,
        fontWeight: '500',
        marginLeft: 8,
    },
    imagesContainer: {
        flexDirection: 'row',
    },
    imagePreview: {
        marginRight: 12,
        position: 'relative',
    },
    previewImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    removeImageButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: '#f44336',
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    subscriptionsContainer: {
        gap: 12,
    },
    subscriptionCard: {
        borderWidth: 2,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        padding: 16,
        backgroundColor: '#fafafa',
    },
    subscriptionCardSelected: {
        borderColor: COLORS.primary,
        backgroundColor: '#f0f8ff',
    },
    subscriptionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    subscriptionName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    subscriptionDuration: {
        fontSize: 13,
        color: '#666',
    },
    subscriptionPriceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    subscriptionPrice: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    featuresList: {
        gap: 8,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    featureText: {
        fontSize: 14,
        color: '#666',
    },
    summarySection: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#666',
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    summaryTotal: {
        marginTop: 8,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    summaryTotalLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    summaryTotalValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    loadingContainer: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#666',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    submitButton: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
});

export default BussinesRequest;