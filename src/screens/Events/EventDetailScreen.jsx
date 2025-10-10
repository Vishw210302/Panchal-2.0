import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../styles/colors';

const EventDetailScreen = ({ route, navigation }) => {
  const event = route?.params?.event || {
    id: '1',
    title: 'Annual Cultural Festival',
    date: '12th Sept, 2025',
    location: 'Community Hall, City Center',
    description:
      'Join us for an exciting cultural festival filled with music, dance, and traditional performances. Experience the rich cultural heritage of our community and enjoy delicious food stalls and fun activities.',
    image: 'https://picsum.photos/600/300?random=1',
  };

  const handleBack = () => {
    navigation?.goBack();
  };

  const handleRegister = () => {
    alert('You have registered for this event!');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
          <MaterialIcons name="arrow-back-ios" color={COLORS.black} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event Details</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: event.image }} style={styles.image} />

        <View style={styles.content}>
          <Text style={styles.title}>{event.title}</Text>

          <View style={styles.row}>
            <MaterialIcons name="event" size={20} color={COLORS.primary} />
            <Text style={styles.detailText}>{event.date}</Text>
          </View>

          <View style={styles.row}>
            <MaterialIcons name="place" size={20} color={COLORS.secondary} />
            <Text style={styles.detailText}>{event.location}</Text>
          </View>

          <Text style={styles.sectionTitle}>About this event</Text>
          <Text style={styles.description}>{event.description}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={handleRegister}
        >
          <Text style={styles.buttonText}>Register Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    marginBottom: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 100,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: COLORS.card,
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
    color: COLORS.darkGray,
  },
  image: {
    width: '100%',
    height: 220,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.darkGray,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    marginLeft: 6,
    fontSize: 15,
    color: COLORS.gray,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
    marginTop: 16,
    marginBottom: 6,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.darkGray,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default EventDetailScreen;
