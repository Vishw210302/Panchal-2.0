import { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Modal,
    Dimensions,
    StatusBar,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getGallaryImages } from '../../api/user_api';
import { COLORS } from '../../styles/colors';
import ENV from '../../config/env';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 48) / 3; // 3 columns with padding

const GallaryScreen = ({ navigation }) => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const handleBack = () => {
        navigation?.goBack();
    };

    const fetchGalleryImages = useCallback(async () => {
        try {
            setError(null);
            const res = await getGallaryImages();
            console.log(res, 'gallery images');
            
            if (Array.isArray(res)) {
                setImages(res);
            } else if (res && res.data && Array.isArray(res.data)) {
                setImages(res.data);
            } else {
                setImages([]);
                console.warn("API response is not in expected format:", res);
            }
        } catch (err) {
            console.error('Fetch gallery images failed:', err);
            setError(err.message || 'Failed to load gallery images');
            setImages([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchGalleryImages();
    }, [fetchGalleryImages]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchGalleryImages();
        setRefreshing(false);
    }, [fetchGalleryImages]);

    const getImageUrl = useCallback((imagePath) => {
        if (!imagePath) return null;
        
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
            return imagePath;
        }
        
        // Remove leading slash if present to avoid double slashes
        const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
        return `${ENV.IMAGE_URL}/${cleanPath}`;
    }, []);

    const handleImagePress = useCallback((imagePath) => {
        setSelectedImage(getImageUrl(imagePath));
        setModalVisible(true);
    }, [getImageUrl]);

    const closeModal = useCallback(() => {
        setModalVisible(false);
        setTimeout(() => setSelectedImage(null), 300);
    }, []);

    const renderImageItem = useCallback(({ item }) => {
        const imageUrl = getImageUrl(item);

        return (
            <TouchableOpacity
                style={styles.imageContainer}
                activeOpacity={0.8}
                onPress={() => handleImagePress(item)}
            >
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.image}
                    resizeMode="cover"
                />
            </TouchableOpacity>
        );
    }, [getImageUrl, handleImagePress]);

    const keyExtractor = useCallback((item, index) => `${item}-${index}`, []);

    const renderEmptyComponent = useCallback(() => {
        if (loading) return null;

        return (
            <View style={styles.emptyContainer}>
                <MaterialIcons
                    name={error ? "error" : "photo-library"}
                    size={70}
                    color={error ? COLORS.error || '#F44336' : COLORS.gray}
                />
                <Text style={styles.emptyText}>
                    {error ? 'Failed to load gallery' : 'No images found'}
                </Text>
                <Text style={styles.emptySubText}>
                    {error ? 'Please check your connection and try again' : 'Check back later for new images'}
                </Text>
                {error && (
                    <TouchableOpacity style={styles.retryButton} onPress={fetchGalleryImages}>
                        <MaterialIcons name="refresh" size={20} color={COLORS.white} />
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    }, [loading, error, fetchGalleryImages]);

    const renderHeader = useCallback(() => {
        if (images.length === 0) return null;

        return (
            <View style={styles.headerInfo}>
                <MaterialIcons name="photo-library" size={24} color={COLORS.primary} />
                <Text style={styles.headerInfoText}>
                    {images.length} {images.length === 1 ? 'Image' : 'Images'}
                </Text>
            </View>
        );
    }, [images.length]);

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
                        <MaterialIcons name="arrow-back-ios" color={COLORS.white} size={24} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Gallery</Text>
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Loading gallery...</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
            
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
                    <MaterialIcons name="arrow-back-ios" color={COLORS.white} size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Gallery</Text>
            </View>

            <FlatList
                data={images}
                keyExtractor={keyExtractor}
                renderItem={renderImageItem}
                numColumns={3}
                contentContainerStyle={[
                    styles.listContainer,
                    images.length === 0 && styles.emptyListContainer
                ]}
                columnWrapperStyle={styles.columnWrapper}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={renderEmptyComponent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[COLORS.primary]}
                        tintColor={COLORS.primary}
                    />
                }
                removeClippedSubviews={true}
                maxToRenderPerBatch={15}
                windowSize={10}
                initialNumToRender={12}
            />

            {/* Full Screen Image Modal */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity 
                        style={styles.modalCloseButton}
                        onPress={closeModal}
                        activeOpacity={0.8}
                    >
                        <MaterialIcons name="close" size={30} color={COLORS.white} />
                    </TouchableOpacity>
                    
                    <Image
                        source={{ uri: selectedImage }}
                        style={styles.modalImage}
                        resizeMode="contain"
                    />
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        height: 100,
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: COLORS.primary,
        elevation: 3,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: COLORS.white,
        marginLeft: 12,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: COLORS.gray,
    },
    listContainer: {
        padding: 12,
    },
    emptyListContainer: {
        flexGrow: 1,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    headerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: COLORS.card,
        borderRadius: 10,
        marginBottom: 12,
    },
    headerInfoText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.darkGray,
        marginLeft: 10,
    },
    imageContainer: {
        width: ITEM_WIDTH,
        height: ITEM_WIDTH,
        marginBottom: 12,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: COLORS.lightGray || '#f0f0f0',
        elevation: 2,
        shadowColor: COLORS.black,
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    image: {
        width: '100%',
        height: '100%',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingTop: 100,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.darkGray,
        marginTop: 16,
        textAlign: 'center',
    },
    emptySubText: {
        fontSize: 14,
        color: COLORS.gray,
        marginTop: 8,
        textAlign: 'center',
        lineHeight: 20,
    },
    retryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 24,
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: COLORS.primary,
        borderRadius: 10,
    },
    retryButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalCloseButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 25,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalImage: {
        width: width,
        height: '80%',
    },
});

export default GallaryScreen;