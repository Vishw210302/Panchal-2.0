import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    LayoutAnimation,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getFAQsListing } from '../../api/user_api';
import { COLORS } from '../../styles/colors';

const FAQsPageListing = () => {

    const [expandedIndex, setExpandedIndex] = useState(null);
    const [faqsListing, setFaqsListing] = useState([]);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        getFAQsListing()
            .then((res) => {
                setFaqsListing(res);
            })
            .catch((err) => console.error('Fetch FAQs failed:', err));
    }, []);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 50,
                friction: 8,
                useNativeDriver: true,
            })
        ]).start();
    }, [fadeAnim, slideAnim]);

    const toggleFAQ = (faqIndex) => {
        const customAnimation = {
            duration: 300,
            create: {
                type: LayoutAnimation.Types.easeInEaseOut,
                property: LayoutAnimation.Properties.opacity,
            },
            update: {
                type: LayoutAnimation.Types.spring,
                springDamping: 0.8,
            },
        };
        LayoutAnimation.configureNext(customAnimation);

        const newIndex = `${faqIndex}`;
        setExpandedIndex(expandedIndex === newIndex ? null : newIndex);
    };

    const renderFAQCategory = () => (
        <Animated.View
            style={[
                styles.categoryContainer,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }]
                }
            ]}
        >
            {faqsListing.map((faq, faqIndex) => {
                const isExpanded = expandedIndex === `${faqIndex}`;
                return (
                    <View key={faq._id} style={styles.faqCard}>
                        <TouchableOpacity
                            style={styles.faqHeader}
                            onPress={() => toggleFAQ(faqIndex)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.faqQuestion}>
                                {faq.questionE}
                            </Text>
                            <MaterialIcons
                                name={isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                                size={24}
                                color={COLORS.gray}
                            />
                        </TouchableOpacity>

                        {isExpanded && (
                            <View style={styles.faqAnswerContainer}>
                                <Text style={styles.faqAnswer}>
                                    {faq.answerE.replace(/<[^>]+>/g, '')}
                                </Text>
                            </View>
                        )}
                    </View>
                );
            })}
        </Animated.View>
    );

    return (
        <View style={styles.section}>
            <View style={styles.faqHeaderSection}>
                <View style={styles.sectionTitle}>
                    <MaterialIcons name="help" size={24} color={COLORS.secondary} />
                    <Text style={styles.mainTitle}>Frequently Asked Questions</Text>
                </View>
                <Text style={styles.sectionDescription}>
                    Find quick answers to common questions
                </Text>
            </View>
            {renderFAQCategory()}
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        marginVertical: 5,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 8,
    },
    mainTitle: {
        fontSize: 21,
        fontWeight: '700',
        color: COLORS.darkGray,
    },
    sectionDescription: {
        fontSize: 15,
        color: COLORS.gray,
        marginBottom: 15,
        lineHeight: 20,
    },
    categoryContainer: {
        marginBottom: 20,
    },
    faqCard: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        marginBottom: 8,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 4,
    },
    faqHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    faqQuestion: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.darkGray,
        flex: 1,
        marginRight: 10,
    },
    faqAnswerContainer: {
        padding: 16,
        paddingTop: 0,
        borderTopWidth: 1,
        borderTopColor: COLORS.background,
    },
    faqAnswer: {
        fontSize: 14,
        color: COLORS.gray,
        lineHeight: 22,
    },
    faqHeaderSection: {
        marginBottom: 5,
    },
});

export default FAQsPageListing;
