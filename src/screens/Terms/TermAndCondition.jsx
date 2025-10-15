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

    // Enhanced HTML parser for CKEditor content
    const parseHTMLContent = (htmlContent) => {
        if (!htmlContent) return [];

        // Split by headings and paragraphs
        const sections = [];
        let currentSection = null;

        // Remove opening/closing <p> or <div> and split by tags
        const cleanHtml = htmlContent.replace(/<\/?p>|<\/?div>/gi, '\n');
        
        // Split by h1, h2, h3, etc.
        const parts = cleanHtml.split(/(<h[1-6][^>]*>.*?<\/h[1-6]>)/gi);

        parts.forEach(part => {
            const trimmed = part.trim();
            if (!trimmed) return;

            // Check if it's a heading
            const headingMatch = trimmed.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/i);
            if (headingMatch) {
                const title = headingMatch[1].replace(/<\/?[^>]+(>|$)/g, "").trim();
                currentSection = { title, content: [] };
                sections.push(currentSection);
            } else {
                // It's content - clean HTML tags and add to current section
                const cleanText = trimmed.replace(/<\/?[^>]+(>|$)/g, "").trim();
                if (cleanText) {
                    if (currentSection) {
                        currentSection.content.push(cleanText);
                    } else {
                        // Content before any heading
                        sections.push({ title: null, content: [cleanText] });
                    }
                }
            }
        });

        return sections;
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

        // Parse HTML content from CKEditor
        const parsedSections = termsData.content ? parseHTMLContent(termsData.content) : [];

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

                {/* Parsed Content from CKEditor */}
                {parsedSections.length > 0 && (
                    <View style={styles.sectionsContainer}>
                        {parsedSections.map((section, index) => (
                            <View key={index} style={styles.section}>
                                {section.title && (
                                    <Text style={styles.sectionTitle}>{section.title}</Text>
                                )}
                                {section.content.map((paragraph, pIndex) => (
                                    <Text key={pIndex} style={styles.contentText}>
                                        {paragraph}
                                    </Text>
                                ))}
                            </View>
                        ))}
                    </View>
                )}

                {/* Fallback: Show raw content if parsing fails */}
                {parsedSections.length === 0 && termsData.content && (
                    <View style={styles.textSection}>
                        <Text style={styles.contentText}>
                            {termsData.content.replace(/<\/?[^>]+(>|$)/g, "").trim()}
                        </Text>
                    </View>
                )}

                {/* Footer Note */}
                <View style={styles.footerNote}>
                    <MaterialIcons name="info-outline" size={16} color={COLORS.gray} />
                    <Text style={styles.footerText}>
                        By using our services, you agree to these terms and conditions.
                    </Text>
                </View>

                <View style={styles.bottomSpacing} />
            </ScrollView>
        );
    };

    return (
        <View style={styles.container}>
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
        shadowOffset: { width: 0, height: 4 },
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
        marginBottom: 12,
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