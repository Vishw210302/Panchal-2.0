import { useEffect, useState, useCallback } from 'react';
import {
  Animated,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import { useUser } from '../../context/UserContext';
import { COLORS } from '../../styles/colors';
import ENV from '../../config/env';
import { useFocusEffect } from '@react-navigation/native';

const ProfileScreen = ({ navigation }) => {
  const [scrollY] = useState(new Animated.Value(0));
  const [user, setUser] = useState(null);
  const { userData } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  // Use useFocusEffect instead of useEffect to handle navigation properly
  useFocusEffect(
    useCallback(() => {
      loadUserData();
      return () => {
        // Cleanup if needed
      };
    }, [userData])
  );

  const loadUserData = useCallback(() => {
    try {
      setIsLoading(true);
      
      if (userData && Object.keys(userData).length > 0) {
        setUser(userData);
        setIsLoading(false);
      } else {
        // Use setTimeout to avoid navigation during render
        setTimeout(() => {
          navigation.replace('Login');
        }, 0);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setIsLoading(false);
    }
  }, [userData, navigation]);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 150, 250],
    outputRange: [0, 0.8, 1],
    extrapolate: 'clamp',
  });

  const profileImageScale = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  // Show loading state
  if (isLoading || !user) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.animatedHeader, { opacity: headerOpacity }]}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{user.firstname || 'Profile'}</Text>
        </View>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
      >
        {user.profile_banner && (
          <ImageBackground
            source={{ uri: `${ENV.IMAGE_URL}${user.profile_banner}` }}
            style={styles.headerBackground}
            resizeMode="cover"
          />
        )}

        <View style={styles.profileSection}>
          <Animated.View
            style={[
              styles.profileImageContainer,
              { transform: [{ scale: profileImageScale }] },
            ]}
          >
            <Image
              source={
                user.photo
                  ? { uri: `${ENV.IMAGE_URL}${user.photo}` }
                  : { uri: 'https://i.pravatar.cc/300?img=13' }
              }
              style={styles.profileImage}
            />
          </Animated.View>

          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user.firstname || 'User'}</Text>
            {user.personal_id && (
              <Text style={styles.profileRole}>{user.personal_id}</Text>
            )}
            {user.address && (
              <Text style={styles.profileLocation}>{user.address}</Text>
            )}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Contact Information</Text>

          {user.email && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
          )}

          {user.mobile_number && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{user.mobile_number}</Text>
            </View>
          )}

          {user.address && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoValue}>{user.address}</Text>
            </View>
          )}

          {user.job && (
            <View style={[styles.infoItem, styles.lastItem]}>
              <Text style={styles.infoLabel}>Occupation</Text>
              <Text style={styles.infoValue}>{user.job}</Text>
            </View>
          )}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Organization Details</Text>

          {user.job && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Job</Text>
              <Text style={styles.infoValue}>{user.job}</Text>
            </View>
          )}

          {user.created_at && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Member Since</Text>
              <Text style={styles.infoValue}>{formatDate(user.created_at)}</Text>
            </View>
          )}

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Full Name</Text>
            <Text style={styles.infoValue}>
              {`${user.firstname || ''} ${user.middlename || ''} ${
                user.lastname || ''
              }`.trim() || 'N/A'}
            </Text>
          </View>

          {user.gender && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Gender</Text>
              <Text style={styles.infoValue}>{user.gender}</Text>
            </View>
          )}

          {user.dob && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Date of Birth</Text>
              <Text style={styles.infoValue}>{formatDate(user.dob)}</Text>
            </View>
          )}

          {user.marital_status && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Marital Status</Text>
              <Text style={styles.infoValue}>{user.marital_status}</Text>
            </View>
          )}

          {user.education && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Education</Text>
              <Text style={styles.infoValue}>{user.education}</Text>
            </View>
          )}

          {user.city && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>City</Text>
              <Text style={styles.infoValue}>{user.city}</Text>
            </View>
          )}

          {user.state && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>State</Text>
              <Text style={styles.infoValue}>{user.state}</Text>
            </View>
          )}

          {user.pincode && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Pincode</Text>
              <Text style={styles.infoValue}>{user.pincode}</Text>
            </View>
          )}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    marginBottom: 60,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '500',
    marginTop: 10,
  },
  scrollView: {
    flex: 1,
  },
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 90 : 70,
    backgroundColor: 'white',
    zIndex: 1000,
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 21,
    fontWeight: '600',
    color: COLORS.primary,
  },
  headerBackground: {
    height: 200,
    width: '100%',
    backgroundColor: '#e5e7eb',
  },
  profileSection: {
    backgroundColor: '#fff',
    marginTop: -50,
    marginHorizontal: 20,
    borderRadius: 16,
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  profileImageContainer: {
    position: 'absolute',
    top: -50,
    alignSelf: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#fff',
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 6,
  },
  profileRole: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.primary,
    marginBottom: 4,
  },
  profileLocation: {
    fontSize: 14,
    color: '#6b7280',
  },
  sectionCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  bottomSpacing: {
    height: 40,
  },
});

export default ProfileScreen;