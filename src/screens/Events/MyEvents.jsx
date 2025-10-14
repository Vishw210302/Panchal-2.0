import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useState, useCallback } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { getMyEvents } from '../../api/user_api';
import { COLORS } from '../../styles/colors';
import ENV from '../../config/env';

const MyEvents = () => {
    const navigation = useNavigation();
    const [myEvents, setMyEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchMyEvents = async () => {
        try {
            setLoading(true);
            const res = await getMyEvents();
            setMyEvents(res);
        } catch (err) {
            console.error("Fetch my events failed:", err);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchMyEvents();
        setRefreshing(false);
    };

    // Refresh events when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            fetchMyEvents();
        }, [])
    );

    const stripHtmlTags = (str) => {
        if (!str) return "";
        return str.replace(/<\/?[^>]+(>|$)/g, "").trim();
    };

    const handleEventPress = (eventId) => {
        const selectedEvent = myEvents.find(event => event._id === eventId);
        navigation.navigate('EventDetailsScreen', {
            event: selectedEvent
        });
    };

    const handleAddEvent = () => {
        navigation.navigate('AddEvent');
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary || '#4A90E2'} />
                <Text style={styles.loadingText}>Loading your events...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Events</Text>
                <Text style={styles.headerSubtitle}>
                    {myEvents.length} {myEvents.length === 1 ? 'event' : 'events'} created
                </Text>
            </View>

            {/* Events List */}
            {myEvents.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyIcon}>📅</Text>
                    <Text style={styles.emptyTitle}>No Events Yet</Text>
                    <Text style={styles.emptyText}>
                        You haven't created any events yet. Start by creating your first event!
                    </Text>
                </View>
            ) : (
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[COLORS.primary || '#4A90E2']}
                        />
                    }
                >
                    {myEvents.map((event) => (
                        <TouchableOpacity
                            key={event._id}
                            activeOpacity={0.8}
                            onPress={() => handleEventPress(event._id)}
                            style={styles.eventCard}
                        >
                            <View style={styles.cardContent}>
                                {/* Event Image */}
                                <View style={styles.imageContainer}>
                                    <Image
                                        source={{ uri: `${ENV.IMAGE_URL}${event.image}` }}
                                        style={styles.eventImage}
                                    />
                                    <View style={styles.dateBadge}>
                                        <Text style={styles.dateBadgeText}>
                                            {formatDate(event.date)}
                                        </Text>
                                    </View>
                                </View>

                                {/* Event Details */}
                                <View style={styles.detailsContainer}>
                                    <Text style={styles.eventTitle} numberOfLines={2}>
                                        {stripHtmlTags(event.titleE || event.title)}
                                    </Text>

                                    {event.location && (
                                        <View style={styles.infoRow}>
                                            <Text style={styles.infoIcon}>📍</Text>
                                            <Text style={styles.infoText} numberOfLines={1}>
                                                {event.location}
                                            </Text>
                                        </View>
                                    )}

                                    {event.time && (
                                        <View style={styles.infoRow}>
                                            <Text style={styles.infoIcon}>🕐</Text>
                                            <Text style={styles.infoText}>
                                                {event.time}
                                            </Text>
                                        </View>
                                    )}

                                    {event.createdBy && (
                                        <View style={styles.creatorBadge}>
                                            <Text style={styles.creatorText}>
                                                Created by: {event.createdBy}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>

                            {/* Arrow Icon */}
                            <View style={styles.arrowContainer}>
                                <Text style={styles.arrowIcon}>→</Text>
                            </View>
                        </TouchableOpacity>
                    ))}

                    {/* Bottom Spacing */}
                    <View style={styles.bottomSpacing} />
                </ScrollView>
            )}

            {/* Floating Add Button */}
            <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddEvent}
                activeOpacity={0.9}
            >
                <Text style={styles.addButtonIcon}>+</Text>
                <Text style={styles.addButtonText}>Add New Event</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666666',
    },
    header: {
        padding: 20,
        paddingTop: 24,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#666666',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingTop: 80,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
        lineHeight: 24,
    },
    eventCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardContent: {
        flex: 1,
        flexDirection: 'row',
    },
    imageContainer: {
        position: 'relative',
        width: 120,
        height: 140,
    },
    eventImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    dateBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: COLORS.primary || '#4A90E2',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    dateBadgeText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '700',
    },
    detailsContainer: {
        flex: 1,
        padding: 12,
        justifyContent: 'space-between',
    },
    eventTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 8,
        lineHeight: 22,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    infoIcon: {
        fontSize: 14,
        marginRight: 6,
    },
    infoText: {
        fontSize: 14,
        color: '#666666',
        flex: 1,
    },
    creatorBadge: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    creatorText: {
        fontSize: 12,
        color: '#999999',
        fontStyle: 'italic',
    },
    arrowContainer: {
        paddingRight: 16,
    },
    arrowIcon: {
        fontSize: 24,
        color: COLORS.primary || '#4A90E2',
        fontWeight: '600',
    },
    bottomSpacing: {
        height: 100,
    },
    addButton: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: COLORS.primary || '#4A90E2',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 14,
        shadowColor: COLORS.primary || '#4A90E2',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
    addButtonIcon: {
        fontSize: 24,
        color: '#FFFFFF',
        fontWeight: '600',
        marginRight: 8,
    },
    addButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});

export default MyEvents;