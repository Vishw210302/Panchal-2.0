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
    StatusBar,
    Dimensions
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { createGallery } from '../../api/user_api';
import { COLORS } from '../../styles/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useUser } from '../../context/UserContext';

const { width } = Dimensions.get('window');
const IMAGE_SIZE = (width - 64) / 3;

const CreateGallery = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { userData } = useUser();

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    const categories = [
        { id: 'events', label: 'Events', icon: 'event' },
        { id: 'community', label: 'Community', icon: 'groups' },
        { id: 'culture', label: 'Culture', icon: 'palette' },
        { id: 'celebration', label: 'Celebration', icon: 'celebration' },
        { id: 'tradition', label: 'Tradition', icon: 'auto-awesome' },
        { id: 'other', label: 'Other', icon: 'more-horiz' },
    ];

    const handleImagePicker = () => {
        if (images.length >= 10) {
            Alert.alert('Limit Reached', 'You can upload a maximum of 10 images');
            return;
        }

        const options = {
            mediaType: 'photo',
            quality: 0.8,
            selectionLimit: 10 - images.length,
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
        if (!title.trim()) {
            Alert.alert('Validation Error', 'Title is required');
            return false;
        }
        if (!description.trim()) {
            Alert.alert('Validation Error', 'Description is required');
            return false;
        }
        if (!category) {
            Alert.alert('Validation Error', 'Please select a category');
            return false;
        }
        if (images.length === 0) {
            Alert.alert('Validation Error', 'At least one image is required');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const galleryData = new FormData();
            galleryData.append('title', title);
            galleryData.append('description', description);
            galleryData.append('category', category);
            galleryData.append('createdBy', userData._id);

            // Append images - React Native specific format
            images.forEach((image, index) => {
                const imageFile = {
                    uri: Platform.OS === 'android' ? image.uri : image.uri.replace('file://', ''),
                    type: image.type || 'image/jpeg',
                    name: image.fileName || `gallery_image_${Date.now()}_${index}.jpg`,
                };
                galleryData.append('images', imageFile);
            });

            console.log('Submitting gallery data...');
            await createGallery(galleryData);
            
            setIsLoading(false);
            Alert.alert(
                'Success!',
                'Gallery created successfully.',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack(),
                    },
                ]
            );
        } catch (error) {
            setIsLoading(false);
            console.error('Gallery creation error:', error);
            Alert.alert('Error', 'Failed to create gallery. Please try again.');
        }
    };

    const renderCategoryCard = (cat) => {
        const isSelected = category === cat.id;
        return (
            <TouchableOpacity
                key={cat.id}
                style={[styles.categoryCard, isSelected && styles.categoryCardSelected]}
                onPress={() => setCategory(cat.id)}
                activeOpacity={0.7}
            >
                <Icon 
                    name={cat.icon} 
                    size={24} 
                    color={isSelected ? COLORS.primary : '#666'} 
                />
                <Text style={[styles.categoryLabel, isSelected && styles.categoryLabelSelected]}>
                    {cat.label}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
            
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Icon name="arrow-back" size={24} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Create Gallery</Text>
                <View style={styles.placeholder} />
            </View>

            <Animated.View 
                style={[
                    styles.content, 
                    { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
                ]}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Title Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Icon name="title" size={20} color={COLORS.primary} />
                            <Text style={styles.sectionTitle}>Gallery Title</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter a catchy title"
                            value={title}
                            onChangeText={setTitle}
                            placeholderTextColor="#999"
                        />
                    </View>

                    {/* Category Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Icon name="category" size={20} color={COLORS.primary} />
                            <Text style={styles.sectionTitle}>Category</Text>
                        </View>
                        <View style={styles.categoriesGrid}>
                            {categories.map(renderCategoryCard)}
                        </View>
                    </View>

                    {/* Description Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Icon name="description" size={20} color={COLORS.primary} />
                            <Text style={styles.sectionTitle}>Description</Text>
                        </View>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Tell us about this gallery..."
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                            placeholderTextColor="#999"
                        />
                    </View>

                    {/* Images Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Icon name="collections" size={20} color={COLORS.primary} />
                            <Text style={styles.sectionTitle}>
                                Photos ({images.length}/10)
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={styles.imagePickerButton}
                            onPress={handleImagePicker}
                        >
                            <View style={styles.imagePickerContent}>
                                <Icon name="add-photo-alternate" size={48} color={COLORS.primary} />
                                <Text style={styles.imagePickerTitle}>Add Photos</Text>
                                <Text style={styles.imagePickerSubtitle}>
                                    Tap to select up to {10 - images.length} more {images.length >= 10 ? '' : 'photos'}
                                </Text>
                            </View>
                        </TouchableOpacity>

                        {images.length > 0 && (
                            <View style={styles.imagesGrid}>
                                {images.map((image, index) => (
                                    <Animated.View 
                                        key={index} 
                                        style={styles.imageWrapper}
                                    >
                                        <Image 
                                            source={{ uri: image.uri }} 
                                            style={styles.gridImage} 
                                        />
                                        <TouchableOpacity
                                            style={styles.removeImageButton}
                                            onPress={() => removeImage(index)}
                                        >
                                            <Icon name="close" size={16} color="#fff" />
                                        </TouchableOpacity>
                                        <View style={styles.imageNumber}>
                                            <Text style={styles.imageNumberText}>{index + 1}</Text>
                                        </View>
                                    </Animated.View>
                                ))}
                            </View>
                        )}
                    </View>

                    <View style={{ height: 100 }} />
                </ScrollView>

                {/* Submit Button */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
                        onPress={handleSubmit}
                        disabled={isLoading}
                        activeOpacity={0.8}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <>
                                <Icon name="cloud-upload" size={24} color="#fff" />
                                <Text style={styles.submitButtonText}>Create Gallery</Text>
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
        backgroundColor: '#f8f9fa',
    },
    header: {
        backgroundColor: COLORS.primary,
        paddingTop: StatusBar.currentHeight || 40,
        paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.white,
        letterSpacing: 0.5,
    },
    placeholder: {
        width: 40,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
        color: '#333',
        backgroundColor: '#fafafa',
    },
    textArea: {
        minHeight: 120,
        paddingTop: 14,
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    categoryCard: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
        borderWidth: 2,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 12,
        minWidth: (width - 88) / 3,
        gap: 8,
    },
    categoryCardSelected: {
        backgroundColor: '#e3f2fd',
        borderColor: COLORS.primary,
    },
    categoryLabel: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
        textAlign: 'center',
    },
    categoryLabelSelected: {
        color: COLORS.primary,
        fontWeight: '600',
    },
    imagePickerButton: {
        borderWidth: 2,
        borderColor: COLORS.primary,
        borderStyle: 'dashed',
        borderRadius: 16,
        paddingVertical: 32,
        marginBottom: 20,
        backgroundColor: '#f0f8ff',
    },
    imagePickerContent: {
        alignItems: 'center',
    },
    imagePickerTitle: {
        fontSize: 18,
        color: COLORS.primary,
        fontWeight: '600',
        marginTop: 12,
    },
    imagePickerSubtitle: {
        fontSize: 13,
        color: '#666',
        marginTop: 4,
    },
    imagesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    imageWrapper: {
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
        position: 'relative',
        borderRadius: 12,
        overflow: 'hidden',
    },
    gridImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#f0f0f0',
    },
    removeImageButton: {
        position: 'absolute',
        top: 6,
        right: 6,
        backgroundColor: 'rgba(244, 67, 54, 0.9)',
        borderRadius: 12,
        width: 28,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 4,
    },
    imageNumber: {
        position: 'absolute',
        bottom: 6,
        left: 6,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    imageNumberText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '600',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
    },
    submitButton: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        gap: 10,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
});

export default CreateGallery;