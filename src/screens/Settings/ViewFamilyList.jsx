import { useState, useEffect } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../styles/colors';
import { familyList, deleteMember } from '../../api/user_api';
import { useUser } from '../../context/UserContext';
import HeaderBack from '../../components/common/HeaderBack';


const ViewFamilyList = ({navigation}) => {
    const [familyMembers, setFamilyMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userData } = useUser()

    useEffect(() => {
        fetchFamilyData();
    }, []);

    // Add useFocusEffect to refresh data when screen comes into focus
    const fetchFamilyData = async () => {
        try {
            setLoading(true);
            console.log(typeof userData,"TYPEOFUSERDATA")
            if (userData) {
                console.log(userData._id,"ID of USERDATA")
                const res = await familyList(userData._id);

                if (res && res.family) {
                    // Transform the family data to match our display format
                    const transformedFamily = transformFamilyData(res.family, userData);
                    setFamilyMembers(transformedFamily);
                }
            }
        } catch (err) {
            console.error('Error fetching family data:', err);
            Alert.alert('Error', 'Failed to load family members');
        } finally {
            setLoading(false);
        }
    };

    // Transform API data to display format
    const transformFamilyData = (familyData, currentUser) => {
        const members = [];

        // Add current user as "Self"
        members.push({
            id: currentUser._id,
            name: `${currentUser.firstname} ${currentUser.middlename || ''} ${currentUser.lastname}`.trim(),
            relationship: 'Self',
            age: calculateAge(currentUser.dob),
            phone: currentUser.mobile_number || '-',
            email: currentUser.email || '-',
            gender: currentUser.gender || '-',
            job: currentUser.job || '-',
            address: currentUser.address || '-',
            isSelf: true
        });

        // Add children
        if (familyData.children && Array.isArray(familyData.children)) {
            familyData.children.forEach(child => {
                if (child && child._id) {
                    members.push({
                        id: child._id,
                        name: `${child.firstname} ${child.middlename || ''} ${child.lastname}`.trim(),
                        relationship: child.relationship || 'Child',
                        age: calculateAge(child.dob),
                        phone: child.mobile_number || '-',
                        email: child.email || '-',
                        gender: child.gender || '-',
                        job: child.job || '-',
                        address: child.address || '-',
                        marital_status: child.marital_status || '-',
                        isSelf: false
                    });
                }
            });
        }

        return members;
    };

    // Calculate age from date of birth
    const calculateAge = (dob) => {
        if (!dob) return '-';
        try {
            const birthDate = new Date(dob);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();

            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            return age;
        } catch (error) {
            return '-';
        }
    };

    const handleBack = () => {
        navigation.navigate('MainTabs');
    };

    const handleAddMember = () => {
        navigation.navigate('AddFamilyMember');
    };

    const handleEditMember = (member) => {
        if (member.isSelf) {
            Alert.alert('Info', 'You can edit your profile from the Profile section');
            return;
        }
        console.log(member, "Editing member...");
        navigation.navigate('EditFamilyMember', { memberId: member.id });
        // Alert.alert('Edit Member', `Edit ${member.name}`);
        // navigation.navigate('EditFamilyMember', { member });
    };

    const handleDeleteMember = (member) => {
        if (member.isSelf) {
            Alert.alert('Error', 'You cannot delete yourself');
            return;
        }

        Alert.alert(
            'Delete Member',
            `Are you sure you want to remove ${member.name} from your family?`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            // Call delete API here
                            const deleteFamilyMember = await deleteMember(member.id);
                            // await deleteFamilyMember(member.id);
                            // For now, just remove from state
                            // setFamilyMembers(familyMembers.filter(m => m.id !== member.id));
                            console.log(deleteFamilyMember, " Delete response");
                            fetchFamilyData();
                            Alert.alert('Success', 'Family member removed successfully',);
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete family member');
                        }
                    }
                }
            ]
        );
    };

    const handleViewDetails = (member) => {
        navigation.navigate('MemberDetailsScreen', { userId: member.id });
        // Alert.alert(
        //     member.name,
        //     `Relationship: ${member.relationship}\n` +
        //     `Age: ${member.age} years\n` +
        //     `Gender: ${member.gender}\n` +
        //     `Phone: ${member.phone}\n` +
        //     `Email: ${member.email}\n` +
        //     `Job: ${member.job}\n` +
        //     `Marital Status: ${member.marital_status || '-'}\n` +
        //     `Address: ${member.address}`,
        //     [{ text: 'Close' }]
        // );
    };

    const getRelationshipIcon = (relationship) => {
        switch (relationship.toLowerCase()) {
            case 'self':
                return 'person';
            case 'spouse':
                return 'heart';
            case 'father':
                return 'male';
            case 'mother':
                return 'female';
            case 'son':
                return 'man';
            case 'daughter':
                return 'woman';
            case 'brother':
            case 'sister':
                return 'people';
            default:
                return 'person-outline';
        }
    };

    const getRelationshipColor = (relationship) => {
        switch (relationship.toLowerCase()) {
            case 'self':
                return COLORS.primary;
            case 'spouse':
                return '#E91E63';
            case 'father':
            case 'mother':
                return '#FF9800';
            case 'son':
            case 'daughter':
                return '#4CAF50';
            default:
                return COLORS.primary;
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <HeaderBack navigation={navigation} title='Our Family' />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Loading family members...</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <HeaderBack navigation={navigation} title='Our Family' />

            {/* Content */}
            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}>

                {/* Family Count */}
                <View style={styles.countCard}>
                    <Ionicons name="people" size={32} color={COLORS.primary} />
                    <View style={styles.countInfo}>
                        <Text style={styles.countNumber}>{familyMembers.length}</Text>
                        <Text style={styles.countLabel}>Family Members</Text>
                    </View>
                </View>

                {familyMembers.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="people-outline" size={80} color={COLORS.gray} />
                        <Text style={styles.emptyTitle}>No Family Members</Text>
                        <Text style={styles.emptyText}>
                            Add your family members to get started
                        </Text>
                    </View>
                ) : (
                    /* Family Members List */
                    <View style={styles.listContainer}>
                        {familyMembers.map((member) => (
                            <TouchableOpacity
                                key={member.id}
                                style={[
                                    styles.memberCard,
                                    member.isSelf && styles.selfMemberCard
                                ]}
                                activeOpacity={0.7}
                                onPress={() => handleViewDetails(member)}
                            >
                                <View style={[
                                    styles.memberIconContainer,
                                    { backgroundColor: `${getRelationshipColor(member.relationship)}15` }
                                ]}>
                                    <Ionicons
                                        name={getRelationshipIcon(member.relationship)}
                                        size={28}
                                        color={getRelationshipColor(member.relationship)}
                                    />
                                </View>

                                <View style={styles.memberInfo}>
                                    <View style={styles.nameRow}>
                                        <Text style={styles.memberName}>{member.name}</Text>
                                        {member.isSelf && (
                                            <View style={styles.selfBadge}>
                                                <Text style={styles.selfBadgeText}>You</Text>
                                            </View>
                                        )}
                                    </View>
                                    <Text style={[
                                        styles.memberRelation,
                                        { color: getRelationshipColor(member.relationship) }
                                    ]}>
                                        {member.relationship}
                                    </Text>
                                    <View style={styles.memberDetails}>
                                        <View style={styles.detailItem}>
                                            <Feather name="calendar" size={14} color={COLORS.textLight} />
                                            <Text style={styles.detailText}>
                                                {member.age !== '-' ? `${member.age} years` : 'Age not available'}
                                            </Text>
                                        </View>
                                        <View style={styles.detailItem}>
                                            <Feather name="phone" size={14} color={COLORS.textLight} />
                                            <Text style={styles.detailText}>{member.phone}</Text>
                                        </View>
                                    </View>
                                </View>

                                {!member.isSelf && (
                                    <View style={styles.actionsContainer}>
                                        <TouchableOpacity
                                            onPress={(e) => {
                                                e.stopPropagation();
                                                handleEditMember(member);
                                            }}
                                            style={styles.actionButton}>
                                            <Feather name="edit-2" size={18} color={COLORS.primary} />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={(e) => {
                                                e.stopPropagation();
                                                handleDeleteMember(member);
                                            }}
                                            style={styles.actionButton}>
                                            <Feather name="trash-2" size={18} color="#F56565" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/* Empty space for button */}
                <View style={styles.bottomSpace} />
            </ScrollView>

            {/* Add New Member Button - Fixed at bottom */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.addButton}
                    activeOpacity={0.8}
                    onPress={handleAddMember}>
                    <Ionicons name="person-add" size={22} color="#fff" />
                    <Text style={styles.addButtonText}>Add New Member</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    // centerContent: {
    //     justifyContent: 'center',
    //     alignItems: 'center',
    // },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.primary,
        paddingHorizontal: 16,
        paddingVertical: 16,
        paddingTop: 50,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    backButton: {
        padding: 4,
    },
    refreshButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#fff',
    },
    placeholder: {
        width: 32,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: COLORS.gray,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 100,
    },
    countCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        padding: 20,
        borderRadius: 12,
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    countInfo: {
        marginLeft: 16,
    },
    countNumber: {
        fontSize: 28,
        fontWeight: '700',
        color: COLORS.text,
    },
    countLabel: {
        fontSize: 14,
        color: COLORS.textLight,
        marginTop: 2,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: COLORS.text,
        marginTop: 16,
    },
    emptyText: {
        fontSize: 14,
        color: COLORS.textLight,
        marginTop: 8,
        textAlign: 'center',
    },
    listContainer: {
        gap: 12,
    },
    memberCard: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    selfMemberCard: {
        borderWidth: 2,
        borderColor: COLORS.primary,
        elevation: 4,
    },
    memberIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    memberInfo: {
        flex: 1,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    memberName: {
        fontSize: 17,
        fontWeight: '600',
        color: COLORS.text,
        flex: 1,
    },
    selfBadge: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        marginLeft: 8,
    },
    selfBadgeText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#fff',
    },
    memberRelation: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
    },
    memberDetails: {
        gap: 6,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    detailText: {
        fontSize: 13,
        color: COLORS.textLight,
    },
    actionsContainer: {
        justifyContent: 'center',
        gap: 8,
    },
    actionButton: {
        padding: 8,
    },
    bottomSpace: {
        height: 20,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.white,
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
        paddingVertical: 16,
        borderRadius: 12,
        gap: 10,
        elevation: 2,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    addButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});

export default ViewFamilyList;