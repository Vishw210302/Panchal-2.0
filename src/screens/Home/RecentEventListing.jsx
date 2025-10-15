import { useNavigation } from '@react-navigation/native';
import { useEffect, useState, useRef } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    Dimensions,
    ScrollView
} from 'react-native';
import { getEvents } from '../../api/user_api';
import ENV from '../../config/env';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 60;
const CARD_MARGIN = 15;

const RecentEventListing = () => {
    const navigation = useNavigation();
    const [eventListing, setEventListing] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollViewRef = useRef(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const res = await getEvents();
                // Get only first 3 events
                setEventListing(res.slice(0, 3));
            } catch (err) {
                console.error("Fetch events failed:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const stripHtmlTags = (str) => {
        if (!str) return "";
        return str.replace(/<\/?[^>]+(>|$)/g, "").trim();
    };

    const handleEventPress = (eventId) => {
        const selectedEvent = eventListing.find(event => event._id === eventId);
        console.log(eventId, "selectedEvent");
        navigation.navigate('EventDetailsScreen', { event: selectedEvent });

    };

    const handleScroll = (event) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollPosition / (CARD_WIDTH + CARD_MARGIN * 2));
        setActiveIndex(index);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4A90E2" />
            </View>
        );
    }

    if (eventListing.length === 0) {
        return null;
    }

    return (
        <View style={styles.wrapper}>
            <View style={styles.headerContainer}>
                <Text style={styles.sectionTitle}>Upcoming Events</Text>
                <TouchableOpacity>
                    <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled={false}
                showsHorizontalScrollIndicator={false}
                decelerationRate="fast"
                snapToInterval={CARD_WIDTH + CARD_MARGIN * 2}
                snapToAlignment="center"
                contentContainerStyle={styles.scrollContent}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                {eventListing.map((event, index) => (
                    <TouchableOpacity
                        key={event._id}
                        activeOpacity={0.9}
                        onPress={() => handleEventPress(event._id)}
                        style={styles.cardWrapper}
                    >
                        <View style={styles.card}>
                            <Image
                                source={{ uri: `${ENV.IMAGE_URL}${event.image}` }}
                                style={styles.image}
                            />
                            <View style={styles.gradientOverlay} />

                            <View style={styles.contentOverlay}>
                                <View style={styles.dateBadge}>
                                    <Text style={styles.dateBadgeText}>
                                        {new Date(event.date).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </Text>
                                </View>

                                <Text style={styles.title} numberOfLines={2}>
                                    {stripHtmlTags(event.titleE || event.title)}
                                </Text>

                                {event.location && (
                                    <View style={styles.locationContainer}>
                                        <Text style={styles.locationIcon}>📍</Text>
                                        <Text style={styles.locationText} numberOfLines={1}>
                                            {event.location}
                                        </Text>
                                    </View>
                                )}

                                <View style={styles.footer}>
                                    <Text style={styles.learnMore}>Learn More →</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Pagination Dots */}
            {eventListing.length > 1 && (
                <View style={styles.pagination}>
                    {eventListing.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.paginationDot,
                                index === activeIndex && styles.paginationDotActive
                            ]}
                        />
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: "#F9F9F9",
        paddingVertical: 20,
    },
    loadingContainer: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    viewAllText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4A90E2',
    },
    scrollContent: {
        paddingHorizontal: 16,
    },
    cardWrapper: {
        marginHorizontal: CARD_MARGIN,
    },
    card: {
        width: CARD_WIDTH,
        height: 320,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    gradientOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    contentOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
    },
    dateBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#4A90E2',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        marginBottom: 12,
    },
    dateBadgeText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 8,
        lineHeight: 26,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    locationIcon: {
        fontSize: 14,
        marginRight: 4,
    },
    locationText: {
        fontSize: 14,
        color: '#FFFFFF',
        opacity: 0.9,
        flex: 1,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    learnMore: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#D1D5DB',
        marginHorizontal: 4,
    },
    paginationDotActive: {
        width: 24,
        backgroundColor: '#4A90E2',
    },
});

export default RecentEventListing;