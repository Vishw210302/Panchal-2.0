import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getEventDetails } from '../../api/user_api';
import { useEffect, useState } from 'react';
import { COLORS } from '../../styles/colors';
import ENV from '../../config/env';

const EventDetailScreen = ({ route, navigation }) => {
  const { event } = route.params;
  const [eventDetails, setEventDetails] = useState(event);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (event?._id || event?.id) {
      fetchEventDetails();
    }
  }, [event?._id, event?.id]);

  console.log('Event Details:', eventDetails);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const eventId = event?._id || event?.id;
      if (eventId) {
        const response = await getEventDetails(eventId);
        setEventDetails(response);
      }
    } catch (error) {
      console.error('Error fetching event details:', error);
      Alert.alert('Error', 'Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleShare = () => {
    Alert.alert('Share', 'Share functionality would go here');
  };

  const handleLocationPress = () => {
    if (eventDetails?.location) {
      const encodedLocation = encodeURIComponent(eventDetails.location);
      const url = `https://maps.google.com/?q=${encodedLocation}`;
      Linking.openURL(url).catch(() =>
        Alert.alert('Error', 'Could not open maps app')
      );
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Get the correct title (titleE from API or title from navigation)
  const getEventTitle = () => {
    return eventDetails?.titleE || eventDetails?.title || 'Event Title';
  };

  // Get the correct description (descriptionE from API or description from navigation)
  const getEventDescription = () => {
    return eventDetails?.descriptionE || eventDetails?.description || '';
  };

  // Get the correct date format
  const getFormattedDate = () => {
    // If date is already formatted (like from your console data)
    if (eventDetails?.date && eventDetails.date.includes('•')) {
      return eventDetails.date;
    }
    
    // If we have raw date and time from API
    if (eventDetails?.date && eventDetails?.time) {
      try {
        const date = new Date(eventDetails.date);
        const options = {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        };
        const formattedDate = date.toLocaleDateString('en-US', options);
        const formattedTime = formatTime(eventDetails.time);
        return `${formattedDate} • ${formattedTime}`;
      } catch (error) {
        console.log('Error formatting date:', error);
        return eventDetails.date;
      }
    }
    
    return eventDetails?.date || 'Date not specified';
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    try {
      const [hours, minutes] = timeString.split(':');
      const time = new Date();
      time.setHours(parseInt(hours), parseInt(minutes));
      return time.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return timeString;
    }
  };

  // Function to strip HTML tags and get plain text
  const stripHtmlTags = (html) => {
    if (!html) return '';
    return html
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace &nbsp; with spaces
      .replace(/&amp;/g, '&') // Replace &amp; with &
      .replace(/&lt;/g, '<') // Replace &lt; with <
      .replace(/&gt;/g, '>') // Replace &gt; with >
      .replace(/&quot;/g, '"') // Replace &quot; with "
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();
  };

  const getImageSource = () => {
    if (imageError || !eventDetails?.image) {
      return require('../../../assets/images/placeholder.png');
    }

    if (eventDetails.image.startsWith('http')) {
      return { uri: eventDetails.image };
    } else {
      // Use the correct environment variable for image URL
      return { uri: `${ENV.IMAGE_URL || ENV.BASE_URL}/${eventDetails.image}` };
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading event details...</Text>
      </View>
    );
  }

  if (!eventDetails) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={64} color={COLORS.gray} />
        <Text style={styles.errorText}>Event not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" color="#fff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event Details</Text>
        <TouchableOpacity
          onPress={handleShare}
          style={styles.shareButton}
          activeOpacity={0.7}
        >
          <MaterialIcons name="share" color="#fff" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Event Image */}
        <Image
          source={getImageSource()}
          style={styles.eventImage}
          onError={handleImageError}
          resizeMode="cover"
        />

        {/* Event Content */}
        <View style={styles.content}>
          {/* Event Title */}
          <Text style={styles.eventTitle}>{getEventTitle()}</Text>

          {/* Event Date & Time */}
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <MaterialIcons name="event" size={20} color={COLORS.primary} />
              <Text style={styles.infoText}>
                {getFormattedDate()}
              </Text>
            </View>

            {/* Location */}
            <TouchableOpacity
              style={styles.infoRow}
              onPress={handleLocationPress}
              activeOpacity={0.7}
            >
              <MaterialIcons name="location-on" size={20} color={COLORS.secondary} />
              <Text style={[styles.infoText, styles.locationText]}>
                {eventDetails.location || 'Location not specified'}
              </Text>
              <MaterialIcons name="open-in-new" size={16} color={COLORS.gray} />
            </TouchableOpacity>

            {/* Organizer */}
            {eventDetails.createdBy && (
              <View style={styles.infoRow}>
                <MaterialIcons name="person" size={20} color={COLORS.gray} />
                <Text style={styles.infoText}>
                  Organized by {eventDetails.createdBy}
                </Text>
              </View>
            )}
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>About this Event</Text>
            <View style={styles.descriptionContent}>
              <Text style={styles.descriptionText}>
                {getEventDescription()
                  ? stripHtmlTags(getEventDescription())
                  : 'No description available for this event.'
                }
              </Text>
            </View>
          </View>

          {/* Additional Info */}
          {(eventDetails.createdAt || eventDetails._id) && (
            <View style={styles.additionalInfo}>
              <Text style={styles.sectionTitle}>Additional Information</Text>
              <View style={styles.additionalContent}>
                {eventDetails._id && (
                  <View style={styles.infoRow}>
                    <MaterialIcons name="info" size={16} color={COLORS.gray} />
                    <Text style={styles.additionalText}>
                      Event ID: {eventDetails._id}
                    </Text>
                  </View>
                )}
                {eventDetails.createdAt && (
                  <View style={styles.infoRow}>
                    <MaterialIcons name="calendar-today" size={16} color={COLORS.gray} />
                    <Text style={styles.additionalText}>
                      Created: {new Date(parseInt(eventDetails.createdAt)).toLocaleDateString()}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              activeOpacity={0.7}
            >
              <MaterialIcons name="bookmark-border" size={20} color="#fff" />
              <Text style={styles.primaryButtonText}>Save Event</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              activeOpacity={0.7}
            >
              <MaterialIcons name="calendar-today" size={20} color={COLORS.primary} />
              <Text style={styles.secondaryButtonText}>Add to Calendar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 100,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: COLORS.primary,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    padding: 4,
  },
  shareButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  eventImage: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 20,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.darkGray,
    marginBottom: 16,
    lineHeight: 32,
  },
  infoSection: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 12,
    fontSize: 16,
    color: COLORS.darkGray,
    flex: 1,
  },
  locationText: {
    color: COLORS.secondary,
    textDecorationLine: 'underline',
  },
  descriptionSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: 12,
  },
  descriptionContent: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  descriptionText: {
    fontSize: 14,
    color: COLORS.darkGray,
    lineHeight: 20,
  },
  additionalInfo: {
    marginBottom: 20,
  },
  additionalContent: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  additionalText: {
    fontSize: 12,
    color: COLORS.gray,
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.gray,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: COLORS.darkGray,
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EventDetailScreen;