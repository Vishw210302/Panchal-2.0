import { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    Linking,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getCommunitiesMemberListing } from '../../api/user_api';
import { COLORS } from '../../styles/colors';

const CommitteeMemberScreen = ({ navigation }) => {

    const [committeeMembersListing, setCommitteeMembersListing] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCommitteeMembers();
    }, []);

    const fetchCommitteeMembers = async () => {
        try {
            setLoading(true);
            const res = await getCommunitiesMemberListing();
            setCommitteeMembersListing(res);
        } catch (err) {
            console.error('Fetch committeeMembersListing failed:', err);
            Alert.alert('Error', 'Failed to load committee members');
        } finally {
            setLoading(false);
        }
    };

    const getRoleColor = (role) => {
        const roleColors = {
            'President': '#FF6B35',
            'Vice President': '#F7931E',
            'Minister': '#f06269ff',
            'Co-Minister': '#4a8fe9ff',
            'Treasurer': '#4ECDC4',
            'Executive Member': '#45B7D1'
        };
        return roleColors[role] || COLORS.primary;
    };

    const getRoleIcon = (role) => {
        const roleIcons = {
            'President': 'account-balance',
            'Vice President': 'supervisor-account',
            'Minister': 'business-center',
            'Co-Minister': 'work-outline',
            'Treasurer': 'account-balance-wallet',
            'Executive Member': 'group'
        };
        return roleIcons[role] || 'person';
    };

    const renderMemberCard = (member, index) => {

        const roleColor = getRoleColor(member.roleE);
        const roleIcon = getRoleIcon(member.roleE);

        return (
            <TouchableOpacity
                key={member._id}
                style={[styles.memberCard, { borderLeftColor: roleColor }]}
                activeOpacity={0.8}
            >
                <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                        <View style={styles.imageContainer}>
                            <Image
                                source={
                                    member.image && member.image.trim() !== ""
                                        ? { uri: "http://192.168.1.13:3000/" + member.image }
                                        : { uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" }
                                }
                                style={styles.memberImage}
                            />
                            <View style={[styles.roleIndicator, { backgroundColor: roleColor }]}>
                                <MaterialIcons name={roleIcon} size={12} color={COLORS.white} />
                            </View>
                        </View>

                        <View style={styles.memberInfo}>
                            <Text style={styles.memberName} numberOfLines={2}>
                                {member.fullnameE}
                            </Text>
                            <View style={[styles.positionBadge, { backgroundColor: roleColor }]}>
                                <MaterialIcons name={roleIcon} size={12} color={COLORS.white} />
                                <Text style={styles.positionText}>{member.roleE}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.cardBody}>
                        <View style={styles.infoRow}>
                            <View style={styles.infoIconContainer}>
                                <MaterialIcons name="location-on" size={16} color={roleColor} />
                            </View>
                            <Text style={styles.infoText}>{member.villageE}</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <View style={styles.infoIconContainer}>
                                <MaterialIcons name="phone-android" size={16} color={roleColor} />
                            </View>
                            <Text style={styles.infoText}>{member.mobile_number}</Text>
                        </View>
                    </View>

                    <View style={styles.cardFooter}>
                        <TouchableOpacity
                            style={[styles.contactButton, { backgroundColor: roleColor }]}
                            activeOpacity={0.7}
                            onPress={() => Linking.openURL(`tel:${member.mobile_number}`)}
                        >
                            <MaterialIcons name="phone" size={16} color={COLORS.white} />
                            <Text style={styles.contactButtonText}>Call Now</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const handleBack = () => {
        navigation?.goBack();
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} activeOpacity={0.7} style={styles.backButton}>
                        <MaterialIcons name="arrow-back" color={COLORS.white} size={24} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Committee Members</Text>
                </View>
                <View style={styles.loadingContent}>
                    <Text style={styles.loadingText}>Loading committee members...</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} activeOpacity={0.7} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" color={COLORS.white} size={24} />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Committee Members</Text>
                    <Text style={styles.headerSubtitle}>{committeeMembersListing.length} Active Members</Text>
                </View>
                <View style={styles.headerIcon}>
                    <MaterialIcons name="group" size={28} color={COLORS.white} />
                </View>
            </View>

            <ScrollView
                style={styles.membersContainer}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {committeeMembersListing.length > 0 ? (
                    committeeMembersListing.map((member, index) => renderMemberCard(member, index))
                ) : (
                    <View style={styles.emptyState}>
                        <MaterialIcons name="group-off" size={64} color={COLORS.gray} />
                        <Text style={styles.emptyStateText}>No committee members found</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    loadingContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: COLORS.gray,
        fontWeight: '500',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 120,
        paddingHorizontal: 20,
        paddingTop: 45,
        backgroundColor: COLORS.primary,
        elevation: 4,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
        marginRight: 15,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    headerContent: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: COLORS.white,
        marginBottom: 2,
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '400',
    },
    headerIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    membersContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    scrollContent: {
        paddingVertical: 20,
        paddingBottom: 30,
    },
    memberCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        marginBottom: 16,
        elevation: 3,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        borderLeftWidth: 4,
        overflow: 'hidden',
    },
    cardContent: {
        padding: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    imageContainer: {
        position: 'relative',
        marginRight: 14,
    },
    memberImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#E9ECEF',
        borderWidth: 3,
        borderColor: COLORS.white,
    },
    roleIndicator: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        width: 22,
        height: 22,
        borderRadius: 11,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.white,
    },
    memberInfo: {
        flex: 1,
    },
    memberName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 8,
        lineHeight: 22,
    },
    positionBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        elevation: 1,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    positionText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.white,
        marginLeft: 4,
    },
    cardBody: {
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    infoIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F8F9FA',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    infoText: {
        fontSize: 15,
        color: '#495057',
        fontWeight: '500',
        flex: 1,
    },
    cardFooter: {
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#E9ECEF',
    },
    contactButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        flex: 1,
        justifyContent: 'center',
        elevation: 2,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    contactButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.white,
        marginLeft: 6,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyStateText: {
        fontSize: 16,
        color: COLORS.gray,
        fontWeight: '500',
        marginTop: 16,
    },
});

export default CommitteeMemberScreen