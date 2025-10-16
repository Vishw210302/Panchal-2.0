import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    FlatList,
    Image,
    Platform,
    RefreshControl,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    UIManager,
    View
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getBussinessListing } from '../../api/user_api';
import { COLORS } from '../../styles/colors';
import ENV from '../../config/env';
import { useUser } from '../../context/UserContext';

const IMAGE_URL = ENV.IMAGE_URL;
// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const OwnBussiness = ({ navigation }) => {
    const [BussinesListing, setBussinesListing] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const { userData } = useUser()

    useEffect(() => {
        fetchBusinesses();
    }, []);

    const fetchBusinesses = async () => {
        setLoading(true);
        try {
            const res = await getBussinessListing(userData._id);
            console.log(res, 'Business Listing fetched');
            setBussinesListing(res);
            setLoading(false);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();
        } catch (err) {
            console.error('Fetch Business Listing failed:', err);
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchBusinesses();
        setRefreshing(false);
    };

    const handleAddBusiness = () => {
        navigation.navigate('BussinesRequest');
    };

    const handleBusinessPress = (business) => {
        // Navigate to business details
        console.log('Business pressed:', business);
        // navigation.navigate('BusinessDetails', { business });
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved':
                return '#4caf50';
            case 'pending':
                return '#ff9800';
            case 'rejected':
                return '#f44336';
            default:
                return '#999';
        }
    };

    const getStatusBackgroundColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved':
                return '#e8f5e9';
            case 'pending':
                return '#fff3e0';
            case 'rejected':
                return '#ffebee';
            default:
                return '#f5f5f5';
        }
    };

    const renderBusinessCard = ({ item, index }) => {
        const memberName = item.memberId
            ? `${item.memberId.firstname} ${item.memberId.middlename || ''} ${item.memberId.lastname}`.trim()
            : 'N/A';

        const hasImages = item.images && item.images.length > 0;
        const firstImage = hasImages ? item.images[0] : null;
        console.log(firstImage, 'First Image');
        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => handleBusinessPress(item)}
                activeOpacity={0.7}
            >
                {/* Image Header */}
                {hasImages && (
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: `${IMAGE_URL}${firstImage}` }}
                            style={styles.businessImage}
                            resizeMode="cover"
                        />
                        <View style={styles.imageOverlay}>
                            <View style={styles.imageBadge}>
                                <MaterialIcons name="photo-library" size={14} color="#fff" />
                                <Text style={styles.imageBadgeText}>{item.images.length}</Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* Card Content */}
                <View style={styles.cardContent}>
                    {/* Header */}
                    <View style={styles.cardHeader}>
                        <View style={styles.iconContainer}>
                            <MaterialIcons name="business" size={28} color={COLORS.primary} />
                        </View>
                        <View style={styles.cardHeaderText}>
                            <Text style={styles.businessName} numberOfLines={1}>
                                {item.businessName || 'Business Name'}
                            </Text>
                            <Text style={styles.businessCategory} numberOfLines={1}>
                                {item.category || 'Category'}
                            </Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={24} color="#999" />
                    </View>

                    {/* Description */}
                    {item.description && (
                        <Text style={styles.description} numberOfLines={2}>
                            {item.description.replace(/<[^>]*>/g, '')}
                        </Text>
                    )}

                    <View style={styles.cardDivider} />

                    {/* Contact Info */}
                    <View style={styles.cardBody}>
                        {item.contact?.address && (
                            <View style={styles.infoRow}>
                                <MaterialIcons name="location-on" size={16} color="#666" />
                                <Text style={styles.infoText} numberOfLines={1}>
                                    {item.contact.address}
                                </Text>
                            </View>
                        )}
                        {item.contact?.phone && (
                            <View style={styles.infoRow}>
                                <MaterialIcons name="phone" size={16} color="#666" />
                                <Text style={styles.infoText}>{item.contact.phone}</Text>
                            </View>
                        )}
                        {item.contact?.email && (
                            <View style={styles.infoRow}>
                                <MaterialIcons name="email" size={16} color="#666" />
                                <Text style={styles.infoText} numberOfLines={1}>
                                    {item.contact.email}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Subscription Info */}
                    {item.subscriptionId && (
                        <View style={styles.subscriptionContainer}>
                            <View style={styles.subscriptionBadge}>
                                <MaterialIcons name="star" size={14} color="#ffc107" />
                                <Text style={styles.subscriptionText}>
                                    {item.subscriptionId.planName}
                                </Text>
                            </View>
                            <Text style={styles.subscriptionPrice}>
                                ₹{item.subscriptionId.price} • {item.subscriptionId.durationInMonths}mo
                            </Text>
                        </View>
                    )}

                    <View style={styles.cardDivider} />

                    {/* Footer */}
                    <View style={styles.cardFooter}>
                        <View style={styles.statusContainer}>
                            <View
                                style={[
                                    styles.statusBadge,
                                    { backgroundColor: getStatusBackgroundColor(item.status) }
                                ]}
                            >
                                <View
                                    style={[
                                        styles.statusDot,
                                        { backgroundColor: getStatusColor(item.status) }
                                    ]}
                                />
                                <Text
                                    style={[
                                        styles.statusText,
                                        { color: getStatusColor(item.status) }
                                    ]}
                                >
                                    {item.status?.charAt(0).toUpperCase() + item.status?.slice(1) || 'Unknown'}
                                </Text>
                            </View>
                            {item.paymentStatus && (
                                <View style={styles.paymentBadge}>
                                    <MaterialIcons
                                        name={item.paymentStatus === 'paid' ? 'check-circle' : 'pending'}
                                        size={14}
                                        color={item.paymentStatus === 'paid' ? '#4caf50' : '#ff9800'}
                                    />
                                    <Text style={styles.paymentText}>
                                        {item.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                                    </Text>
                                </View>
                            )}
                        </View>
                        <Text style={styles.ownerText} numberOfLines={1}>
                            <MaterialIcons name="person" size={12} color="#999" /> {memberName}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
                <MaterialIcons name="business-center" size={80} color="#ddd" />
            </View>
            <Text style={styles.emptyTitle}>No Businesses Yet</Text>
            <Text style={styles.emptyText}>
                Start growing your network by adding your first business listing
            </Text>
            <TouchableOpacity
                style={styles.emptyButton}
                onPress={handleAddBusiness}
                activeOpacity={0.8}
            >
                <MaterialIcons name="add" size={20} color={COLORS.primary} />
                <Text style={styles.emptyButtonText}>Add Business</Text>
            </TouchableOpacity>
        </View>
    );

    const renderHeader = () => (
        <View style={styles.listHeader}>
            <View style={styles.statsContainer}>
                <View style={styles.statBox}>
                    <Text style={styles.statNumber}>{BussinesListing.length}</Text>
                    <Text style={styles.statLabel}>Total</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={[styles.statNumber, { color: '#4caf50' }]}>
                        {BussinesListing.filter(b => b.status === 'approved').length}
                    </Text>
                    <Text style={styles.statLabel}>Approved</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={[styles.statNumber, { color: '#ff9800' }]}>
                        {BussinesListing.filter(b => b.status === 'pending').length}
                    </Text>
                    <Text style={styles.statLabel}>Pending</Text>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>My Businesses</Text>
                    <Text style={styles.headerSubtitle}>
                        {BussinesListing.length} {BussinesListing.length === 1 ? 'Business' : 'Businesses'}
                    </Text>
                </View>
                <TouchableOpacity style={styles.headerButton} onPress={onRefresh}>
                    <MaterialIcons name="refresh" size={24} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            {/* Business List */}
            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <MaterialIcons name="hourglass-empty" size={48} color="#ddd" />
                        <Text style={styles.loadingText}>Loading businesses...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={BussinesListing}
                        renderItem={renderBusinessCard}
                        keyExtractor={(item, index) => item._id?.toString() || index.toString()}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={renderEmptyState}
                        ListHeaderComponent={BussinesListing.length > 0 ? renderHeader : null}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={[COLORS.primary]}
                                tintColor={COLORS.primary}
                            />
                        }
                    />
                )}
            </Animated.View>

            {/* Add Business Button */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleAddBusiness}
                    activeOpacity={0.8}
                >
                    <MaterialIcons name="add" size={24} color="#fff" />
                    <Text style={styles.addButtonText}>Add New Business</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f8ff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
    },
    listHeader: {
        marginBottom: 8,
    },
    statsContainer: {
        flexDirection: 'row',
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
    statBox: {
        flex: 1,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
    },
    listContent: {
        padding: 16,
        paddingBottom: 100,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        overflow: 'hidden',
    },
    imageContainer: {
        width: '100%',
        height: 180,
        position: 'relative',
    },
    businessImage: {
        width: '100%',
        height: '100%',
    },
    imageOverlay: {
        position: 'absolute',
        top: 12,
        right: 12,
    },
    imageBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 4,
    },
    imageBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    cardContent: {
        padding: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#f0f8ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    cardHeaderText: {
        flex: 1,
    },
    businessName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    businessCategory: {
        fontSize: 14,
        color: '#666',
    },
    description: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 12,
    },
    cardDivider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginVertical: 12,
    },
    cardBody: {
        gap: 8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
        flex: 1,
    },
    subscriptionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fffbf0',
        padding: 12,
        borderRadius: 8,
        marginTop: 8,
    },
    subscriptionBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    subscriptionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    subscriptionPrice: {
        fontSize: 13,
        color: '#666',
    },
    cardFooter: {
        gap: 8,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    paymentBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 4,
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
    },
    paymentText: {
        fontSize: 11,
        color: '#666',
        fontWeight: '500',
    },
    ownerText: {
        fontSize: 12,
        color: '#999',
        fontStyle: 'italic',
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
    addButton: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
        marginTop: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 80,
        paddingHorizontal: 40,
    },
    emptyIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 24,
    },
    emptyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: COLORS.primary,
        backgroundColor: '#f0f8ff',
    },
    emptyButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.primary,
    },
});

export default OwnBussiness;