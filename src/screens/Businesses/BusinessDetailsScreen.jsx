import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    Dimensions,
    Linking,
} from 'react-native';
import { useEffect, useState } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../styles/colors';
import { getSingleBusines } from '../../api/user_api';
import ENV from '../../config/env';


const { width } = Dimensions.get('window');

const BusinessDetailsScreen = ({ route, navigation }) => {
    const [businessData, setBusinessData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const businessId = route?.params?.business?._id || route?.params?.businessId;

    useEffect(() => {
        fetchBusinessDetails();
    }, []);

    const fetchBusinessDetails = async () => {
        try {
            setLoading(true);
            const response = await getSingleBusines(businessId);
            setBusinessData(response.data || response);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching business details:', error);
            setLoading(false);
            alert('Failed to load business details');
        }
    };

    const handleBack = () => {
        navigation?.goBack();
    };

    const handleCall = (phone) => {
        if (phone) {
            Linking.openURL(`tel:${phone}`);
        }
    };

    const handleEmail = (email) => {
        if (email) {
            Linking.openURL(`mailto:${email}`);
        }
    };

    const handleAddress = (address) => {
        if (address) {
            const encodedAddress = encodeURIComponent(address);
            Linking.openURL(`https://maps.google.com/?q=${encodedAddress}`);
        }
    };

    const stripHtml = (html) => {
        return html?.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim() || '';
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
                        <MaterialIcons name="arrow-back-ios" color={COLORS.white} size={24} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Business Details</Text>
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            </View>
        );
    }

    if (!businessData) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
                        <MaterialIcons name="arrow-back-ios" color={COLORS.white} size={24} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Business Details</Text>
                </View>
                <View style={styles.loadingContainer}>
                    <Text style={styles.errorText}>Business not found</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
                    <MaterialIcons name="arrow-back-ios" color={COLORS.white} size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Business Details</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Image Carousel */}
                {businessData.images && businessData.images.length > 0 && (
                    <View>
                        <ScrollView
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            onMomentumScrollEnd={(e) => {
                                const index = Math.round(e.nativeEvent.contentOffset.x / width);
                                setCurrentImageIndex(index);
                            }}
                        >
                            {businessData.images.map((image, index) => (
                                <Image
                                    key={index}
                                    source={{ uri: ENV.IMAGE_URL + image }}
                                    style={styles.image}
                                    resizeMode="cover"
                                />
                            ))}
                        </ScrollView>
                        
                        {businessData.images.length > 1 && (
                            <View style={styles.pagination}>
                                {businessData.images.map((_, index) => (
                                    <View
                                        key={index}
                                        style={[
                                            styles.paginationDot,
                                            currentImageIndex === index && styles.paginationDotActive,
                                        ]}
                                    />
                                ))}
                            </View>
                        )}
                    </View>
                )}

                <View style={styles.content}>
                    {/* Business Name */}
                    <Text style={styles.title}>{businessData.businessName}</Text>

                    {/* Category */}
                    <View style={styles.row}>
                        <MaterialIcons name="category" size={20} color={COLORS.primary} />
                        <Text style={styles.detailText}>{businessData.category}</Text>
                    </View>

                    {/* Description Section */}
                    {businessData.description && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>About this Business</Text>
                            <Text style={styles.description}>
                                {stripHtml(businessData.description)}
                            </Text>
                        </View>
                    )}

                    {/* Contact Information Section */}
                    {businessData.contact && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Contact Information</Text>

                            {/* Email */}
                            {businessData.contact.email && (
                                <TouchableOpacity
                                    style={styles.contactRow}
                                    onPress={() => handleEmail(businessData.contact.email)}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.iconContainer}>
                                        <MaterialIcons name="email" size={20} color={COLORS.primary} />
                                    </View>
                                    <View style={styles.contactTextContainer}>
                                        <Text style={styles.contactLabel}>Email</Text>
                                        <Text style={styles.contactValue}>
                                            {businessData.contact.email}
                                        </Text>
                                    </View>
                                    <MaterialIcons name="chevron-right" size={24} color={COLORS.gray} />
                                </TouchableOpacity>
                            )}

                            {/* Phone */}
                            {businessData.contact.phone && (
                                <TouchableOpacity
                                    style={styles.contactRow}
                                    onPress={() => handleCall(businessData.contact.phone)}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.iconContainer}>
                                        <MaterialIcons name="phone" size={20} color={COLORS.secondary} />
                                    </View>
                                    <View style={styles.contactTextContainer}>
                                        <Text style={styles.contactLabel}>Phone</Text>
                                        <Text style={styles.contactValue}>
                                            {businessData.contact.phone}
                                        </Text>
                                    </View>
                                    <MaterialIcons name="chevron-right" size={24} color={COLORS.gray} />
                                </TouchableOpacity>
                            )}

                            {/* Address */}
                            {businessData.contact.address && (
                                <TouchableOpacity
                                    style={styles.contactRow}
                                    onPress={() => handleAddress(businessData.contact.address)}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.iconContainer}>
                                        <MaterialIcons name="place" size={20} color={COLORS.accent} />
                                    </View>
                                    <View style={styles.contactTextContainer}>
                                        <Text style={styles.contactLabel}>Address</Text>
                                        <Text style={styles.contactValue}>
                                            {businessData.contact.address}
                                        </Text>
                                    </View>
                                    <MaterialIcons name="chevron-right" size={24} color={COLORS.gray} />
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Action Buttons Footer */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.actionButton}
                    activeOpacity={0.8}
                    onPress={() => handleCall(businessData.contact?.phone)}
                >
                    <MaterialIcons name="phone" size={20} color={COLORS.white} />
                    <Text style={styles.actionButtonText}>Call</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.actionButtonSecondary]}
                    activeOpacity={0.8}
                    onPress={() => handleEmail(businessData.contact?.email)}
                >
                    <MaterialIcons name="email" size={20} color={COLORS.white} />
                    <Text style={styles.actionButtonText}>Email</Text>
                </TouchableOpacity>
            </View>
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
        elevation: 2,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginLeft: 10,
        color: COLORS.white,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
        color: COLORS.gray,
    },
    image: {
        width: width,
        height: 250,
    },
    pagination: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 10,
        alignSelf: 'center',
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        marginHorizontal: 4,
    },
    paginationDotActive: {
        backgroundColor: COLORS.white,
        width: 24,
    },
    content: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.darkGray,
        marginBottom: 12,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    detailText: {
        marginLeft: 8,
        fontSize: 15,
        color: COLORS.gray,
        fontWeight: '500',
    },
    section: {
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.black,
        marginBottom: 12,
    },
    description: {
        fontSize: 15,
        lineHeight: 24,
        color: COLORS.darkGray,
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.card,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contactTextContainer: {
        flex: 1,
        marginLeft: 12,
    },
    contactLabel: {
        fontSize: 12,
        color: COLORS.gray,
        marginBottom: 2,
    },
    contactValue: {
        fontSize: 15,
        color: COLORS.darkGray,
        fontWeight: '500',
    },
    footer: {
        flexDirection: 'row',
        padding: 16,
        borderTopWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.card,
        gap: 12,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    actionButtonSecondary: {
        backgroundColor: COLORS.secondary,
    },
    actionButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.white,
    },
});

export default BusinessDetailsScreen;