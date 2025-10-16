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
import HeaderBack from '../../components/common/HeaderBack';

const BusinessScreen = ({ navigation }) => {
    const [businessListing, setBusinessListing] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const fetchBusinessListing = useCallback(async () => {
        try {
            setError(null);
            const res = await getBusinesListing();
            console.log(res, 'business data');
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

    const getOwnerName = useCallback((memberId) => {
        if (memberId && typeof memberId === 'object') {
            const firstName = memberId.firstname || '';
            const lastName = memberId.lastname || '';
            return `${firstName} ${lastName}`.trim() || 'Unknown Owner';
        }
        return 'Unknown Owner';
    }, []);

    const renderBusinessCard = useCallback(({ item }) => {
        const imageSource = getImageSource(item.images);
        const ownerName = getOwnerName(item.memberId);

        return (
            <TouchableOpacity
                style={styles.card}
                activeOpacity={0.7}
                onPress={() => handleBusinessDetailsPage(item)}
            >
                {imageSource ? (
                    <Image
                        source={imageSource}
                        style={styles.image}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={[styles.image, styles.placeholderImage]}>
                        <MaterialIcons name="business" size={60} color={COLORS.gray} />
                    </View>
                )}

                <View style={styles.cardContent}>
                    <Text style={styles.businessName} numberOfLines={2}>
                        {item.businessName || 'Unnamed Business'}
                    </Text>

                    <View style={styles.infoRow}>
                        <MaterialIcons name="category" size={18} color={COLORS.primary} />
                        <Text style={styles.infoText} numberOfLines={1}>
                            {item.category || 'Uncategorized'}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <MaterialIcons name="person" size={18} color={COLORS.secondary} />
                        <Text style={styles.infoText} numberOfLines={1}>
                            {ownerName}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }, [getImageSource, getOwnerName, handleBusinessDetailsPage]);

    const keyExtractor = useCallback((item) => item._id || item.id || Math.random().toString(), []);

    const renderEmptyComponent = useCallback(() => {
        if (loading) return null;

        return (
            <View style={styles.emptyContainer}>
                <MaterialIcons
                    name={error ? "error" : "business"}
                    size={70}
                    color={error ? COLORS.error || '#F44336' : COLORS.gray}
                />
                <Text style={styles.emptyText}>
                    {error ? 'Failed to load businesses' : 'No businesses found'}
                </Text>
                <Text style={styles.emptySubText}>
                    {error ? 'Please check your connection and try again' : 'Check back later for new listings'}
                </Text>
                {error && (
                    <TouchableOpacity style={styles.retryButton} onPress={fetchBusinessListing}>
                        <MaterialIcons name="refresh" size={20} color={COLORS.white} />
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    }, [loading, error, fetchBusinessListing]);

    const renderFooter = useCallback(() => {
        if (businessListing.length > 0) {
            return <View style={styles.footerSpacing} />;
        }
        return null;
    }, [businessListing.length]);

    if (loading) {
        return (
            <View style={styles.container}>
                <HeaderBack title="Business Directory" navigation={navigation} />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Loading businesses...</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <HeaderBack title="Business Directory" navigation={navigation} />
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
                initialNumToRender={6}
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
        padding: 16,
    },
    emptyListContainer: {
        flexGrow: 1,
    },
    card: {
        backgroundColor: COLORS.card,
        borderRadius: 14,
        marginBottom: 16,
        shadowColor: COLORS.black,
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 4,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 200,
        backgroundColor: COLORS.lightGray || '#f0f0f0',
    },
    placeholderImage: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardContent: {
        padding: 16,
    },
    businessName: {
        fontSize: 19,
        fontWeight: '700',
        color: COLORS.darkGray,
        marginBottom: 12,
        lineHeight: 24,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoText: {
        marginLeft: 10,
        fontSize: 15,
        color: COLORS.gray,
        flex: 1,
        fontWeight: '500',
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
    footerSpacing: {
        height: 16,
    },
});

export default BusinessScreen;