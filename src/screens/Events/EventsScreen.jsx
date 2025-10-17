import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../styles/colors';
import { getEvents } from '../../api/user_api';
import { useEffect, useState } from 'react';
import ENV from '../../config/env';
import HeaderBack from '../../components/common/HeaderBack';


const EventsScreen = ({ navigation }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await getEvents();
            console.log('Fetched Events:', response);

            // Transform the API response to match your component structure
            const formattedEvents = response.map(event => ({
                id: event._id,
                title: event.titleE,
                date: formatDate(event.date, event.time),
                location: event.location,
                image: event.image, // You might need to add base URL prefix
                description: event.descriptionE,
                createdBy: event.createdBy,
                createdAt: event.created_at
            }));

            setEvents(formattedEvents);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    // Helper function to format date and time
    const formatDate = (dateString, timeString) => {
        try {
            const date = new Date(dateString);
            const options = { day: 'numeric', month: 'short', year: 'numeric' };
            const formattedDate = date.toLocaleDateString('en-US', options);

            // Format time if available
            if (timeString) {
                const [hours, minutes] = timeString.split(':');
                const time = new Date();
                time.setHours(parseInt(hours), parseInt(minutes));
                const formattedTime = time.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                });
                return `${formattedDate} ${' • '} ${formattedTime}`;
            }

            return formattedDate;
        } catch (error) {
            console.error('Error formatting date:', error);
            return dateString;
        }
    };

    const handleEventScreenPage = (event) => {
        navigation.navigate('EventDetailsScreen', { event });
    };

    const renderEventCard = ({ item }) => (
        <TouchableOpacity
            onPress={() => handleEventScreenPage(item)}
            style={styles.card}
            activeOpacity={0.7}
        >
            <Image
                source={{
                    uri: ENV.IMAGE_URL + item.image
                }}
                style={styles.image}
                defaultSource={require('../../../assets/images/placeholder.png')} // Add a placeholder
            />
            <View style={styles.cardContent}>
                <Text style={styles.title}>{item.title}</Text>
                <View style={styles.row}>
                    <MaterialIcons name="event" size={18} color={COLORS.primary} />
                    <Text style={styles.detailText}>{item.date}</Text>
                </View>
                <View style={styles.row}>
                    <MaterialIcons name="place" size={18} color={COLORS.secondary} />
                    <Text style={styles.detailText}>{item.location}</Text>
                </View>
                {item.createdBy && (
                    <View style={styles.row}>
                        <MaterialIcons name="person" size={18} color={COLORS.gray} />
                        <Text style={styles.detailText}>By {item.createdBy}</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );

    const handleBack = () => {
        navigation?.goBack();
    };

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <MaterialIcons name="event-busy" size={64} color={COLORS.gray} />
            <Text style={styles.emptyStateText}>No events found</Text>
            <Text style={styles.emptyStateSubText}>
                {loading ? 'Loading events...' : 'There are no events scheduled at the moment.'}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
             <HeaderBack title="Events" subTitle={`${events.length} Active Events`} icon="event" navigation={navigation} />

            {loading && events.length === 0 ? (
                <View style={styles.loadingContainer}>
                    <Text>Loading events...</Text>
                </View>
            ) : (
                <FlatList
                    data={events}
                    keyExtractor={(item) => item.id}
                    renderItem={renderEventCard}
                    contentContainerStyle={[
                        styles.listContainer,
                        events.length === 0 && styles.emptyListContainer
                    ]}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={renderEmptyState}
                    refreshing={loading}
                    onRefresh={fetchEvents}
                />
            )}
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
        color: "#fff"
    },
    listContainer: {
        padding: 16,
    },
    emptyListContainer: {
        flexGrow: 1,
        justifyContent: 'center',
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
    },
    cardContent: {
        padding: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.darkGray,
        marginBottom: 6,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    detailText: {
        marginLeft: 6,
        fontSize: 14,
        color: COLORS.gray,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyStateText: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.darkGray,
        marginTop: 16,
        marginBottom: 8,
    },
    emptyStateSubText: {
        fontSize: 14,
        color: COLORS.gray,
        textAlign: 'center',
        paddingHorizontal: 40,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default EventsScreen;
