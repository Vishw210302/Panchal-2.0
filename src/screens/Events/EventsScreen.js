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

const EventsScreen = ({ navigation }) => {

    const events = [
        {
            id: '1',
            title: 'Annual Cultural Festival',
            date: '12th Sept, 2025',
            location: 'Community Hall, City Center',
            image: 'https://picsum.photos/400/200?random=1',
        },
        {
            id: '2',
            title: 'Business Networking Meetup',
            date: '20th Sept, 2025',
            location: 'Hotel Grand Plaza',
            image: 'https://picsum.photos/400/200?random=2',
        },
        {
            id: '3',
            title: 'Charity Blood Donation Camp',
            date: '5th Oct, 2025',
            location: 'Red Cross Center',
            image: 'https://picsum.photos/400/200?random=3',
        },
    ];

    const handleEventScreenPage = () => {
        navigation.navigate('EventDetailsScreen');
    };

    const renderEventCard = ({ item }) => (
        <TouchableOpacity
            onPress={handleEventScreenPage}
            style={styles.card}
            activeOpacity={0.7}
        >
            <Image source={{ uri: item.image }} style={styles.image} />
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
            </View>
        </TouchableOpacity>
    );

    const handleBack = () => {
        navigation?.goBack();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
                    <MaterialIcons name="arrow-back-ios" color="#fff" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Event Screen</Text>
            </View>
            <FlatList
                data={events}
                keyExtractor={(item) => item.id}
                renderItem={renderEventCard}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
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
});

export default EventsScreen;
