import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '../../styles/colors';

const { width } = Dimensions.get('window');

const MembershipScreen = ({ navigation }) => {
  // Static membership data
  const membershipData = {
    packageName: 'Premium Gold',
    status: 'Active',
    startDate: '01 Jan 2025',
    expiryDate: '31 Dec 2025',
    daysRemaining: 77,
    memberSince: '15 Mar 2023',
    memberId: 'MEM2023001245',
    benefits: [
      { icon: 'check-circle', text: 'Unlimited Access' },
      { icon: 'stars', text: 'Priority Support' },
      { icon: 'people', text: 'Exclusive Events' },
      { icon: 'local-offer', text: 'Special Discounts' },
      { icon: 'card-giftcard', text: 'Member Rewards' },
      { icon: 'verified', text: 'Verified Badge' },
    ],
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return COLORS.success || '#10b981';
      case 'expiring':
        return COLORS.warning || '#f59e0b';
      case 'expired':
        return COLORS.error || '#ef4444';
      default:
        return COLORS.gray;
    }
  };

  const handleRenewMembership = () => {
    // Navigate to renewal screen or payment
    console.log('Renew membership');
  };

  const handleUpgradeMembership = () => {
    // Navigate to upgrade screen
    console.log('Upgrade membership');
  };

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
        <Text style={styles.headerTitle}>My Membership</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Membership Card */}
        <View style={styles.cardContainer}>
          <LinearGradient
            colors={[COLORS.primary, '#6366f1', '#8b5cf6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.membershipCard}
          >
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardTitle}>Current Plan</Text>
                <Text style={styles.packageName}>{membershipData.packageName}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
                <Text style={styles.statusText}>{membershipData.status}</Text>
              </View>
            </View>

            <View style={styles.cardDivider} />

            <View style={styles.cardBody}>
              <View style={styles.infoRow}>
                <Icon name="person" size={20} color="rgba(255, 255, 255, 0.8)" />
                <Text style={styles.infoLabel}>Member ID</Text>
                <Text style={styles.infoValue}>{membershipData.memberId}</Text>
              </View>

              <View style={styles.infoRow}>
                <Icon name="calendar-today" size={20} color="rgba(255, 255, 255, 0.8)" />
                <Text style={styles.infoLabel}>Member Since</Text>
                <Text style={styles.infoValue}>{membershipData.memberSince}</Text>
              </View>
            </View>

            <View style={styles.validityContainer}>
              <Text style={styles.validityLabel}>Valid Until</Text>
              <Text style={styles.validityDate}>{membershipData.expiryDate}</Text>
              <Text style={styles.daysRemaining}>{membershipData.daysRemaining} days remaining</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Membership Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>Membership Details</Text>
          
          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <Icon name="play-circle-outline" size={24} color={COLORS.primary} />
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailLabel}>Start Date</Text>
                  <Text style={styles.detailValue}>{membershipData.startDate}</Text>
                </View>
              </View>
            </View>

            <View style={styles.detailDivider} />

            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <Icon name="event" size={24} color={COLORS.primary} />
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailLabel}>Expiry Date</Text>
                  <Text style={styles.detailValue}>{membershipData.expiryDate}</Text>
                </View>
              </View>
            </View>

            <View style={styles.detailDivider} />

            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <Icon name="verified-user" size={24} color={getStatusColor(membershipData.status)} />
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailLabel}>Status</Text>
                  <View style={styles.statusContainer}>
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(membershipData.status) }]} />
                    <Text style={[styles.detailValue, { color: getStatusColor(membershipData.status) }]}>
                      {membershipData.status}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Benefits Section */}
        <View style={styles.benefitsContainer}>
          <Text style={styles.sectionTitle}>Membership Benefits</Text>
          
          <View style={styles.benefitsGrid}>
            {membershipData.benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitCard}>
                <View style={styles.benefitIconContainer}>
                  <Icon name={benefit.icon} size={24} color={COLORS.primary} />
                </View>
                <Text style={styles.benefitText}>{benefit.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={styles.renewButton}
            onPress={handleRenewMembership}
            activeOpacity={0.8}
          >
            <Icon name="autorenew" size={20} color={COLORS.white} />
            <Text style={styles.renewButtonText}>Renew Membership</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.upgradeButton}
            onPress={handleUpgradeMembership}
            activeOpacity={0.8}
          >
            <Icon name="trending-up" size={20} color={COLORS.primary} />
            <Text style={styles.upgradeButtonText}>Upgrade Plan</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: StatusBar.currentHeight || 40,
    paddingBottom: 20,
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
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  cardContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  membershipCard: {
    borderRadius: 20,
    padding: 24,
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  packageName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  statusText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 16,
  },
  cardBody: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 12,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '600',
  },
  validityContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  validityLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  validityDate: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  daysRemaining: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  detailsContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  detailCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  detailLabel: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  detailDivider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  benefitsContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  benefitCard: {
    width: (width - 52) / 2,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    margin: 6,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  benefitIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
  actionContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  renewButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  renewButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  upgradeButton: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  upgradeButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  bottomSpace: {
    height: 40,
  },
});

export default MembershipScreen;