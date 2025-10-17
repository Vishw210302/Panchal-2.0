import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { getMemberDetails } from '../../api/user_api';
import { COLORS } from '../../styles/colors';
import ENV from '../../config/env';


const { width } = Dimensions.get('window');

const MemberDetailsScreen = ({ route, navigation }) => {
  const { userId } = route.params;
  const [memberData, setMemberData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMemberDetails();
  }, []);

  const fetchMemberDetails = async () => {
    try {
      setIsLoading(true);
      const response = await getMemberDetails(userId);
      if (response && response.success) {
        setMemberData(response.data);
      } else {
        Alert.alert('Error', 'Failed to fetch member details');
      }
    } catch (error) {
      console.error('Error fetching member details:', error);
      Alert.alert('Error', 'Unable to load member details');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getAge = (dob) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} years`;
  };

  const getGenderIcon = (gender) => {
    return gender?.toLowerCase() === 'male' ? 'male' : gender?.toLowerCase() === 'female' ? 'female' : 'person';
  };

  const getMaritalStatusIcon = (status) => {
    return status?.toLowerCase() === 'married' ? 'favorite' : 'person-outline';
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loaderText}>Loading member details...</Text>
      </View>
    );
  }

  if (!memberData) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="error-outline" size={64} color={COLORS.gray} />
        <Text style={styles.errorText}>No member data found</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={fetchMemberDetails}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Member Details</Text>
        <TouchableOpacity style={styles.moreButton}>
          <Icon name="more-vert" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >

        {/* Profile Banner */}
        <View style={styles.bannerContainer}>
          <Image
            source={{ uri: ENV.IMAGE_URL + memberData.profile_banner || 'https://via.placeholder.com/800x200' }}
            style={styles.bannerImage}
            defaultSource={require('../../../assets/images/default-banner.png')}
          />
          {/* <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.bannerGradient}
          /> */}
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: ENV.IMAGE_URL + memberData.photo || 'https://via.placeholder.com/150' }}
              style={styles.profileImage}
              defaultSource={require('../../../assets/images/default-banner.png')}
            />
            <View style={[styles.genderBadge, {
              backgroundColor: memberData.gender?.toLowerCase() === 'male' ? '#3b82f6' : '#ec4899'
            }]}>
              <Icon name={getGenderIcon(memberData.gender)} size={16} color={COLORS.white} />
            </View>
          </View>

          <Text style={styles.memberName}>
            {`${memberData.firstname || ''} ${memberData.middlename || ''} ${memberData.lastname || ''}`.trim()}
          </Text>

          <View style={styles.memberIdContainer}>
            <Icon name="badge" size={16} color={COLORS.gray} />
            <Text style={styles.memberId}>ID: {memberData._id?.slice(-8).toUpperCase()}</Text>
          </View>
        </View>

        {/* Quick Info Cards */}
        <View style={styles.quickInfoContainer}>
          <View style={styles.quickInfoCard}>
            <Icon name="cake" size={24} color={COLORS.primary} />
            <Text style={styles.quickInfoValue}>{getAge(memberData.dob)}</Text>
            <Text style={styles.quickInfoLabel}>Age</Text>
          </View>

          <View style={styles.quickInfoCard}>
            <Icon name={getGenderIcon(memberData.gender)} size={24} color={COLORS.primary} />
            <Text style={styles.quickInfoValue}>{memberData.gender || 'N/A'}</Text>
            <Text style={styles.quickInfoLabel}>Gender</Text>
          </View>

          <View style={styles.quickInfoCard}>
            <Icon name={getMaritalStatusIcon(memberData.marital_status)} size={24} color={COLORS.primary} />
            <Text style={styles.quickInfoValue}>{memberData.marital_status || 'N/A'}</Text>
            <Text style={styles.quickInfoLabel}>Status</Text>
          </View>
        </View>

        {/* Personal Information */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Icon name="person" size={24} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Personal Information</Text>
          </View>

          <View style={styles.infoCard}>
            <InfoRow icon="calendar-today" label="Date of Birth" value={formatDate(memberData.dob)} />
            <InfoRow icon="email" label="Email" value={memberData.email || 'N/A'} />
            <InfoRow icon="phone" label="Mobile" value={memberData.mobile_number || 'N/A'} />
            <InfoRow icon="school" label="Education" value={memberData.education || 'N/A'} />
            <InfoRow icon="work" label="Job" value={memberData.job || 'N/A'} />
          </View>
        </View>

        {/* Location Information */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Icon name="location-on" size={24} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Location Details</Text>
          </View>

          <View style={styles.infoCard}>
            <InfoRow icon="home" label="Address" value={memberData.address || 'N/A'} />
            <InfoRow icon="location-city" label="City" value={memberData.city || 'N/A'} />
            <InfoRow icon="map" label="State" value={memberData.state || 'N/A'} />
            <InfoRow icon="pin-drop" label="Pincode" value={memberData.pincode || 'N/A'} />
            {memberData.village_details && (
              <InfoRow icon="landscape" label="Village" value={memberData.village_details.nameE || 'N/A'} />
            )}
          </View>
        </View>

        {/* Family Information */}
        {memberData.parent_details && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Icon name="family-restroom" size={24} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>Family Information</Text>
            </View>

            <View style={styles.infoCard}>
              <InfoRow icon="people" label="Relationship" value={memberData.relationship || 'N/A'} />
              <InfoRow
                icon="person"
                label="Parent Name"
                value={`${memberData.parent_details.firstname || ''} ${memberData.parent_details.middlename || ''} ${memberData.parent_details.lastname || ''}`.trim()}
              />
              <InfoRow icon="wc" label="Parent Gender" value={memberData.parent_details.gender || 'N/A'} />
              <InfoRow icon="school" label="Parent Education" value={memberData.parent_details.education || 'N/A'} />
              <InfoRow icon="work" label="Parent Job" value={memberData.parent_details.job || 'N/A'} />
            </View>
          </View>
        )}

        {/* Membership Timeline */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Icon name="access-time" size={24} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Membership Timeline</Text>
          </View>

          <View style={styles.infoCard}>
            <InfoRow icon="event" label="Member Since" value={formatDate(memberData.created_at)} />
            {memberData.updated_at && (
              <InfoRow icon="update" label="Last Updated" value={formatDate(memberData.updated_at)} />
            )}
          </View>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => Alert.alert('Edit', 'Edit functionality')}
        >
          <Icon name="edit" size={20} color={COLORS.white} />
          <Text style={styles.actionButtonText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonSecondary]}
          onPress={() => Alert.alert('Contact', 'Contact functionality')}
        >
          <Icon name="message" size={20} color={COLORS.primary} />
          <Text style={[styles.actionButtonText, styles.actionButtonSecondaryText]}>Contact</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoLeft}>
      <View style={styles.iconContainer}>
        <Icon name={icon} size={20} color={COLORS.primary} />
      </View>
      <Text style={styles.infoLabel}>{label}</Text>
    </View>
    <Text style={styles.infoValue} numberOfLines={2}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loaderText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.gray,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 18,
    color: COLORS.gray,
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: StatusBar.currentHeight || 40,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  moreButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  bannerContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: -60,
    paddingHorizontal: 20,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: COLORS.white,
    backgroundColor: '#e5e7eb',
  },
  genderBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  memberName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  memberIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  memberId: {
    fontSize: 14,
    color: COLORS.gray,
    marginLeft: 6,
    fontWeight: '600',
  },
  quickInfoContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 8,
  },
  quickInfoCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  quickInfoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 8,
    textTransform: 'capitalize',
  },
  quickInfoLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 4,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 8,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '600',
    textAlign: 'right',
    maxWidth: '50%',
  },
  bottomSpace: {
    height: 100,
  },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    marginHorizontal: 6,
  },
  actionButtonSecondary: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  actionButtonSecondaryText: {
    color: COLORS.primary,
  },
});

export default MemberDetailsScreen;