import {
    Image,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../styles/colors';
import ENV from '../../config/env';
const UserDetailsScreen = ({ route, navigation }) => {

    const { member: userData } = route.params || {};

    const handleBack = () => {
        navigation?.goBack();
    };

    const getFullName = () => {
        const firstName = userData?.firstname || '';
        const middleName = userData?.middlename || '';
        const lastName = userData?.lastname || '';
        return `${firstName} ${middleName} ${lastName}`.trim();
    };

    const getImageUrl = () => {
        if (userData?.photo && userData.photo !== '') {
            return ENV.IMAGE_URL + userData.photo;
        }
    };

    const getBannerImageUrl = () => {
        if (userData?.profile_banner && userData.profile_banner !== '') {
            return ENV.IMAGE_URL + userData.profile_banner;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not provided';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handlePhoneCall = () => {
        const phoneNumber = userData?.mobile_number?.toString();
        if (phoneNumber) {
            Linking.openURL(`tel:${phoneNumber}`);
        }
    };

    const handleEmail = () => {
        const email = userData?.email;
        if (email) {
            Linking.openURL(`mailto:${email}`);
        }
    };

    const DetailRow = ({ icon, label, value, onPress, isClickable = false }) => (
        <TouchableOpacity
            style={[styles.detailRow, !isClickable && styles.nonClickable]}
            onPress={onPress}
            disabled={!isClickable}
            activeOpacity={isClickable ? 0.7 : 1}
        >
            <View style={styles.detailIconContainer}>
                <MaterialIcons name={icon} size={20} color={COLORS.primary} />
            </View>
            <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>{label}</Text>
                <Text style={[styles.detailValue, isClickable && styles.clickableText]}>
                    {value || 'Not provided'}
                </Text>
            </View>
            {isClickable && (
                <MaterialIcons name="chevron-right" size={20} color={COLORS.gray} />
            )}
        </TouchableOpacity>
    );

    const Section = ({ title, children }) => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.sectionContent}>
                {children}
            </View>
        </View>
    );

    if (!userData) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
                        <MaterialIcons name="arrow-back-ios" color={COLORS.darkGray} size={24} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Member Details</Text>
                </View>
                <View style={styles.errorContainer}>
                    <MaterialIcons name="error-outline" size={60} color={COLORS.gray} />
                    <Text style={styles.errorText}>No user data available</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
                    <MaterialIcons name="arrow-back-ios" color={COLORS.white} size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Member Details</Text>
            </View>

            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.profileSection}>
                    <View style={styles.bannerImageContainer}>
                        <Image
                            source={{ uri: getBannerImageUrl() }}
                            style={styles.bannerImage}
                            resizeMode="cover"
                        />
                    </View>

                    <View style={styles.profileImageContainer}>
                        <Image
                            source={{ uri: getImageUrl() }}
                            style={styles.profileImage}
                        />
                        <View style={styles.profileImageBorder} />
                    </View>

                    <View style={styles.userInfoContainer}>
                        <Text style={styles.userName}>{getFullName()}</Text>
                        <Text style={styles.personalId}>ID: {userData.personal_id || 'N/A'}</Text>

                        <View style={styles.actionButtons}>
                            {userData.mobile_number && (
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={handlePhoneCall}
                                    activeOpacity={0.8}
                                >
                                    <MaterialIcons name="phone" size={20} color={COLORS.white} />
                                    <Text style={styles.actionButtonText}>Call</Text>
                                </TouchableOpacity>
                            )}
                            {userData.email && (
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={handleEmail}
                                    activeOpacity={0.8}
                                >
                                    <MaterialIcons name="email" size={20} color={COLORS.white} />
                                    <Text style={styles.actionButtonText}>Email</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>

                <Section title="Personal Information">
                    <DetailRow
                        icon="person"
                        label="First Name"
                        value={userData.firstname}
                    />
                    <DetailRow
                        icon="person-outline"
                        label="Middle Name"
                        value={userData.middlename}
                    />
                    <DetailRow
                        icon="person"
                        label="Last Name"
                        value={userData.lastname}
                    />
                    <DetailRow
                        icon="cake"
                        label="Date of Birth"
                        value={formatDate(userData.dob)}
                    />
                    <DetailRow
                        icon="wc"
                        label="Gender"
                        value={userData.gender}
                    />
                    <DetailRow
                        icon="favorite"
                        label="Marital Status"
                        value={userData.marital_status}
                    />
                </Section>

                <Section title="Contact Information">
                    <DetailRow
                        icon="phone"
                        label="Mobile Number"
                        value={userData.mobile_number?.toString()}
                        onPress={handlePhoneCall}
                        isClickable={!!userData.mobile_number}
                    />
                    <DetailRow
                        icon="email"
                        label="Email Address"
                        value={userData.email}
                        onPress={handleEmail}
                        isClickable={!!userData.email}
                    />
                </Section>

                <Section title="Address Information">
                    <DetailRow
                        icon="home"
                        label="Address"
                        value={userData.address}
                    />
                    <DetailRow
                        icon="location-city"
                        label="City"
                        value={userData.city}
                    />
                    <DetailRow
                        icon="map"
                        label="State"
                        value={userData.state}
                    />
                    <DetailRow
                        icon="my-location"
                        label="Pincode"
                        value={userData.pincode}
                    />
                </Section>

                <Section title="Professional Information">
                    <DetailRow
                        icon="work"
                        label="Job/Occupation"
                        value={userData.job}
                    />
                    <DetailRow
                        icon="school"
                        label="Education"
                        value={userData.education}
                    />
                </Section>

                <Section title="Additional Information">
                    <DetailRow
                        icon="payment"
                        label="Payment ID"
                        value={userData.payment_id}
                    />
                    <DetailRow
                        icon="family-restroom"
                        label="Relationship"
                        value={userData.relationship}
                    />
                    <DetailRow
                        icon="date-range"
                        label="Member Since"
                        value={formatDate(userData.created_at)}
                    />
                    {userData.updated_at && (
                        <DetailRow
                            icon="update"
                            label="Last Updated"
                            value={formatDate(userData.updated_at)}
                        />
                    )}
                </Section>

                <View style={styles.bottomSpacing} />
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
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        elevation: 4,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    headerTitle: {
        fontSize: 21,
        fontWeight: '600',
        marginLeft: 20,
        color: COLORS.white,
    },
    scrollContainer: {
        flex: 1,
    },
    profileSection: {
        backgroundColor: COLORS.white,
        marginBottom: 10,
        position: 'relative',
    },
    bannerImageContainer: {
        height: 200,
        width: '100%',
        position: 'relative',
    },
    bannerImage: {
        width: '100%',
        height: '100%',
    },
    profileImageContainer: {
        position: 'absolute',
        top: 140,
        left: '50%',
        marginLeft: -65,
        alignItems: 'center',
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: COLORS.lightGray,
    },
    profileImageBorder: {
        position: 'absolute',
        width: 130,
        height: 130,
        borderRadius: 65,
        borderWidth: 5,
        borderColor: COLORS.white,
        top: -5,
        left: -5,
        backgroundColor: 'transparent',
        elevation: 3,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    userInfoContainer: {
        alignItems: 'center',
        paddingTop: 80,
        paddingBottom: 30,
        paddingHorizontal: 20,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.darkGray,
        textAlign: 'center',
        marginBottom: 5,
    },
    personalId: {
        fontSize: 16,
        color: COLORS.gray,
        fontWeight: '500',
        marginBottom: 20,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 15,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 25,
        elevation: 2,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    actionButtonText: {
        color: COLORS.white,
        fontWeight: 'bold',
        marginLeft: 8,
        fontSize: 14,
    },
    section: {
        backgroundColor: COLORS.white,
        marginBottom: 10,
        paddingVertical: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.darkGray,
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    sectionContent: {
        paddingHorizontal: 20,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    nonClickable: {
    },
    detailIconContainer: {
        width: 40,
        alignItems: 'center',
        marginRight: 15,
    },
    detailContent: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 14,
        color: COLORS.gray,
        fontWeight: '500',
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 16,
        color: COLORS.darkGray,
        fontWeight: '400',
    },
    clickableText: {
        color: COLORS.primary,
        fontWeight: '500',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    errorText: {
        fontSize: 18,
        color: COLORS.gray,
        textAlign: 'center',
        marginTop: 15,
    },
    bottomSpacing: {
        height: 30,
    },
});

export default UserDetailsScreen;