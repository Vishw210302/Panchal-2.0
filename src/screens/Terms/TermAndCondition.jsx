import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    RefreshControl
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getTermsAndCondition } from '../../api/user_api';
import { COLORS } from '../../styles/colors';

const TermsAndConditions = () => {
    const [termsData, setTermsData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const navigation = useNavigation();

    const fetchTermsAndConditions = async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setIsRefreshing(true);
            } else {
                setIsLoading(true);
            }
            setError(null);

            const response = await getTermsAndCondition();

            if (response) {
                // Handle different response structures
                if (response.allTerms) {
                    setTermsData(response.allTerms[0]);
                } else if (Array.isArray(response) && response.length > 0) {
                    setTermsData(response[0]);
                } else {
                    setTermsData(response);
                }
            } else {
                setError('No terms and conditions available');
            }
        } catch (err) {
            console.error('Error fetching terms and conditions:', err);
            setError(err.message || 'Failed to load terms and conditions');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    const stripHtmlTags = (str) => {
        if (!str) return "";
        return str.replace(/<\/?[^>]+(>|$)/g, "").trim();
    };

    const limitCharacters = (text, charLimit) => {
        return text.length > charLimit
            ? text.slice(0, charLimit).trim() + '...'
            : text;
    };

    useEffect(() => {
        fetchTermsAndConditions();
    }, []);

    const handleRefresh = () => {
        fetchTermsAndConditions(true);
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            );
        }

        if (error) {
            return (
                <View style={styles.centerContainer}>
                    <MaterialIcons name="error-outline" size={64} color={COLORS.gray} />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={() => fetchTermsAndConditions()}
                        activeOpacity={0.7}
                    >
                        <MaterialIcons name="refresh" size={20} color={COLORS.white} />
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        if (!termsData) {
            return (
                <View style={styles.centerContainer}>
                    <MaterialIcons name="description" size={64} color={COLORS.gray} />
                    <Text style={styles.emptyText}>No terms and conditions available</Text>
                </View>
            );
        }

        return (
            <ScrollView
                style={styles.contentContainer}
                contentContainerStyle={styles.contentInner}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        colors={[COLORS.primary]}
                        tintColor={COLORS.primary}
                    />
                }
            >
                {/* Title */}
                {termsData.title && (
                    <View style={styles.titleSection}>
                        <Text style={styles.mainTitle}>{termsData.title}</Text>
                    </View>
                )}

                {/* Last Updated */}
                {termsData.updatedAt && (
                    <View style={styles.metaSection}>
                        <MaterialIcons name="update" size={16} color={COLORS.gray} />
                        <Text style={styles.metaText}>
                            Last updated: {new Date(termsData.updatedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </Text>
                    </View>
                )}

                {/* Content */}
                {termsData.content && (
                    <View style={styles.textSection}>
                        <Text style={styles.contentText}>{limitCharacters(stripHtmlTags(termsData.content))}</Text>
                    </View>
                )}

                {/* Description (if separate from content) */}
                {termsData.description && termsData.description !== termsData.content && (
                    <View style={styles.textSection}>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.contentText}>{termsData.description}</Text>
                    </View>
                )}

                {/* Terms (if array of terms) */}
                {termsData.terms && Array.isArray(termsData.terms) && termsData.terms.length > 0 && (
                    <View style={styles.textSection}>
                        <Text style={styles.sectionTitle}>Terms</Text>
                        {termsData.terms.map((term, index) => (
                            <View key={index} style={styles.termItem}>
                                <View style={styles.bulletPoint} />
                                <Text style={styles.termText}>{term}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Sections (if structured data) */}
                {termsData.sections && Array.isArray(termsData.sections) && termsData.sections.length > 0 && (
                    <View style={styles.sectionsContainer}>
                        {termsData.sections.map((section, index) => (
                            <View key={index} style={styles.section}>
                                {section.title && (
                                    <Text style={styles.sectionTitle}>{section.title}</Text>
                                )}
                                {section.content && (
                                    <Text style={styles.contentText}>{section.content}</Text>
                                )}
                                {section.items && Array.isArray(section.items) && (
                                    <View style={styles.itemsList}>
                                        {section.items.map((item, itemIndex) => (
                                            <View key={itemIndex} style={styles.termItem}>
                                                <View style={styles.bulletPoint} />
                                                <Text style={styles.termText}>{item}</Text>
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>
                )}

                {/* Contact Information */}
                {termsData.contact && (
                    <View style={styles.contactSection}>
                        <Text style={styles.sectionTitle}>Contact Us</Text>
                        {termsData.contact.email && (
                            <View style={styles.contactItem}>
                                <MaterialIcons name="email" size={18} color={COLORS.primary} />
                                <Text style={styles.contactText}>{termsData.contact.email}</Text>
                            </View>
                        )}
                        {termsData.contact.phone && (
                            <View style={styles.contactItem}>
                                <MaterialIcons name="phone" size={18} color={COLORS.primary} />
                                <Text style={styles.contactText}>{termsData.contact.phone}</Text>
                            </View>
                        )}
                        {termsData.contact.address && (
                            <View style={styles.contactItem}>
                                <MaterialIcons name="location-on" size={18} color={COLORS.primary} />
                                <Text style={styles.contactText}>{termsData.contact.address}</Text>
                            </View>
                        )}
                    </View>
                )}

                {/* Footer Note */}
                <View style={styles.footerNote}>
                    <MaterialIcons name="info-outline" size={16} color={COLORS.gray} />
                    <Text style={styles.footerText}>
                        By using our services, you agree to these terms and conditions.
                    </Text>
                </View>

                {/* Bottom Spacing */}
                <View style={styles.bottomSpacing} />
            </ScrollView>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={handleBack}
                    activeOpacity={0.7}
                    style={styles.backButton}
                >
                    <MaterialIcons name="arrow-back-ios" color={COLORS.white} size={24} />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Terms & Conditions</Text>
                    <Text style={styles.headerSubtitle}>Please read carefully</Text>
                </View>
            </View>

            {/* Content */}
            {renderContent()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background || '#f5f5f5',
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
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: COLORS.gray,
        fontWeight: '500',
    },
    errorText: {
        marginTop: 16,
        fontSize: 16,
        color: COLORS.gray,
        textAlign: 'center',
        lineHeight: 24,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        color: COLORS.gray,
        textAlign: 'center',
    },
    retryButton: {
        marginTop: 20,
        backgroundColor: COLORS.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    retryButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
    },
    contentContainer: {
        flex: 1,
    },
    contentInner: {
        paddingBottom: 20,
    },
    titleSection: {
        backgroundColor: COLORS.white,
        paddingHorizontal: 24,
        paddingVertical: 24,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border || '#e0e0e0',
    },
    mainTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: COLORS.darkGray || '#333',
        lineHeight: 36,
        textAlign: 'center',
    },
    metaSection: {
        backgroundColor: COLORS.white,
        paddingHorizontal: 24,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border || '#e0e0e0',
    },
    metaText: {
        fontSize: 13,
        color: COLORS.gray,
        fontStyle: 'italic',
    },
    textSection: {
        backgroundColor: COLORS.white,
        paddingHorizontal: 24,
        paddingVertical: 20,
        marginTop: 12,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.darkGray || '#333',
        marginBottom: 12,
        lineHeight: 28,
    },
    contentText: {
        fontSize: 15,
        color: COLORS.darkGray || '#333',
        lineHeight: 24,
        textAlign: 'justify',
    },
    sectionsContainer: {
        marginTop: 12,
    },
    section: {
        backgroundColor: COLORS.white,
        paddingHorizontal: 24,
        paddingVertical: 20,
        marginBottom: 12,
    },
    termItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
        paddingLeft: 8,
    },
    bulletPoint: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.primary,
        marginTop: 8,
        marginRight: 12,
    },
    termText: {
        flex: 1,
        fontSize: 15,
        color: COLORS.darkGray || '#333',
        lineHeight: 24,
    },
    itemsList: {
        marginTop: 8,
    },
    contactSection: {
        backgroundColor: COLORS.white,
        paddingHorizontal: 24,
        paddingVertical: 20,
        marginTop: 12,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    contactText: {
        fontSize: 15,
        color: COLORS.darkGray || '#333',
        flex: 1,
    },
    footerNote: {
        backgroundColor: COLORS.lightGray || '#f9f9f9',
        paddingHorizontal: 24,
        paddingVertical: 16,
        marginTop: 12,
        marginHorizontal: 12,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    footerText: {
        flex: 1,
        fontSize: 13,
        color: COLORS.gray,
        lineHeight: 20,
        fontStyle: 'italic',
    },
    bottomSpacing: {
        height: 20,
    },
});

export default TermsAndConditions;