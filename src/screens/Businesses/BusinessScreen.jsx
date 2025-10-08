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
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getBusinesListing } from '../../api/user_api';
import { COLORS } from '../../styles/colors';
import ENV from '../../config/env';
const BusinessScreen = ({ navigation }) => {

    const [businessListing, setBusinessListing] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const handleBack = () => {
        navigation?.goBack();
    };

    const fetchBusinessListing = useCallback(async () => {
        try {
            setError(null);
            const res = await getBusinesListing();
            if (Array.isArray(res)) {
                setBusinessListing(res);
            } else if (res && res.data && Array.isArray(res.data)) {
                setBusinessListing(res.data);
            } else {
                setBusinessListing([]);
                console.warn("API response is not in expected format:", res);
            }
        } catch (err) {
            console.error('Fetch business listing failed:', err);
            setError(err.message || 'Failed to load business listings');
            setBusinessListing([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBusinessListing();
    }, [fetchBusinessListing]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchBusinessListing();
        setRefreshing(false);
    }, [fetchBusinessListing]);

    const handleBusinessDetailsPage = useCallback((item) => {
        navigation.navigate('BusinessDetailsScreen', { business: item });
    }, [navigation]);

    const getImageSource = useCallback((images) => {
        if (images && images.length > 0) {
            const imageUrl = images[0];
            if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
                return { uri: imageUrl };
            }
            return { uri: `${ENV.IMAGE_URL}/${imageUrl}` };
        }
        return null;
    }, []);

    const formatPrice = useCallback((price) => {
        if (typeof price === 'number') {
            return `₹${price.toLocaleString()}`;
        }
        return price ? `₹${price}` : 'Price not available';
    }, []);

    const renderBusinessCard = useCallback(({ item }) => {
        const imageSource = getImageSource(item.images);

        return (
            <TouchableOpacity
                style={styles.card}
                activeOpacity={0.8}
                onPress={() => handleBusinessDetailsPage(item)}
            >
                {imageSource ? (
                    <Image
                        source={imageSource}
                        style={styles.image}
                    />
                ) : (
                    <View style={[styles.image, styles.placeholderImage]}>
                        <MaterialIcons name="business" size={50} color={COLORS.gray} />
                    </View>
                )}
                <View style={styles.cardContent}>
                    <Text style={styles.title} numberOfLines={2}>
                        {item.businessName || 'Unnamed Business'}
                    </Text>

                    {item.category && (
                        <View style={styles.row}>
                            <MaterialIcons name="category" size={18} color={COLORS.primary} />
                            <Text style={styles.detailText}>{item.category}</Text>
                        </View>
                    )}

                    {item.description && (
                        <View style={styles.row}>
                            <MaterialIcons name="info" size={18} color={COLORS.secondary} />
                            <Text style={styles.detailText} numberOfLines={2}>
                                {item.description.replace(/<[^>]*>/g, '').trim() || 'No description'}
                            </Text>
                        </View>
                    )}

                    {item.package && item.price && (
                        <View style={styles.row}>
                            <MaterialIcons name="local-offer" size={18} color={COLORS.accent} />
                            <Text style={styles.detailText}>
                                {item.package} - {formatPrice(item.price)}
                            </Text>
                        </View>
                    )}

                    {item.status && (
                        <View style={styles.row}>
                            <MaterialIcons
                                name={item.status === 'approved' ? "check-circle" :
                                    item.status === 'pending' ? "pending" :
                                        item.status === 'rejected' ? "cancel" : "help"}
                                size={18}
                                color={item.status === 'approved' ? '#4CAF50' :
                                    item.status === 'pending' ? '#FF9800' :
                                        item.status === 'rejected' ? '#F44336' : COLORS.gray}
                            />
                            <Text style={[styles.detailText, {
                                color: item.status === 'approved' ? '#4CAF50' :
                                    item.status === 'pending' ? '#FF9800' :
                                        item.status === 'rejected' ? '#F44336' : COLORS.gray,
                                textTransform: 'capitalize'
                            }]}>
                                {item.status}
                            </Text>
                        </View>
                    )}

                    {item.subscriptionEnd && (
                        <View style={styles.row}>
                            <MaterialIcons name="schedule" size={18} color={COLORS.gray} />
                            <Text style={[styles.detailText, styles.subscriptionText]}>
                                Expires: {new Date(item.subscriptionEnd).toLocaleDateString()}
                            </Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        );
    }, [getImageSource, handleBusinessDetailsPage, formatPrice]);

    const keyExtractor = useCallback((item) => item._id || item.id || Math.random().toString(), []);

    const renderEmptyComponent = useCallback(() => {
        if (loading) return null;

        return (
            <View style={styles.emptyContainer}>
                <MaterialIcons
                    name={error ? "error" : "business"}
                    size={60}
                    color={error ? COLORS.error || '#F44336' : COLORS.gray}
                />
                <Text style={styles.emptyText}>
                    {error ? 'Failed to load businesses' : 'No businesses found'}
                </Text>
                {error && (
                    <TouchableOpacity style={styles.retryButton} onPress={fetchBusinessListing}>
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    }, [loading, error, fetchBusinessListing]);

    const renderFooter = useCallback(() => {
        if (businessListing.length > 10) {
            return <View style={styles.footerSpacing} />;
        }
        return null;
    }, [businessListing.length]);

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
                        <MaterialIcons name="arrow-back-ios" color="#000" size={24} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Business Directory</Text>
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Loading businesses...</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
                    <MaterialIcons name="arrow-back-ios" color="#fff" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Business Directory</Text>
            </View>
            <FlatList
                data={businessListing}
                keyExtractor={keyExtractor}
                renderItem={renderBusinessCard}
                contentContainerStyle={[
                    styles.listContainer,
                    businessListing.length === 0 && styles.emptyListContainer
                ]}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={renderEmptyComponent}
                ListFooterComponent={renderFooter}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[COLORS.primary]}
                        tintColor={COLORS.primary}
                    />
                }
                removeClippedSubviews={true}
                maxToRenderPerBatch={10}
                windowSize={10}
                initialNumToRender={5}
                getItemLayout={(data, index) => (
                    { length: 200, offset: 200 * index, index }
                )}
            />
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
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        height: 100,
        gap: 15,
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
        color: '#fff',
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: COLORS.gray,
    },
    listContainer: {
        padding: 16,
    },
    emptyListContainer: {
        flexGrow: 1,
    },
    card: {
        backgroundColor: COLORS.card,
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: COLORS.black,
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 160,
        resizeMode: 'cover',
    },
    placeholderImage: {
        backgroundColor: COLORS.lightGray || '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardContent: {
        padding: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.darkGray,
        marginBottom: 8,
        lineHeight: 22,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 6,
        minHeight: 20,
    },
    detailText: {
        marginLeft: 8,
        fontSize: 14,
        color: COLORS.gray,
        flex: 1,
        lineHeight: 18,
    },
    subscriptionText: {
        fontSize: 12,
        fontStyle: 'italic',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
    },
    emptyText: {
        fontSize: 16,
        color: COLORS.gray,
        marginTop: 10,
        textAlign: 'center',
    },
    retryButton: {
        marginTop: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: COLORS.primary,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    footerSpacing: {
        height: 20,
    },
});

export default BusinessScreen;