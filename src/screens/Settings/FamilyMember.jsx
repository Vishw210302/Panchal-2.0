import { useState, useEffect } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    Dimensions
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { COLORS } from '../../styles/colors';
import { familyList } from '../../api/user_api';
import HeaderBack from '../../components/common/HeaderBack';

const { width } = Dimensions.get('window');

const FamilyMember = ({ navigation, route }) => {
    const [familyData, setFamilyData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedNodes, setExpandedNodes] = useState(new Set());
    const { parentId } = route.params || {};

    useEffect(() => {
        if (parentId) {
            fetchFamilyData();
        } else {
            Alert.alert('Error', 'No member ID provided.');
            navigation.goBack();
        }
    }, [parentId]);

    const fetchFamilyData = async () => {
        try {
            setLoading(true);
            const res = await familyList(parentId);
            if (res && res.family) {
                setFamilyData(res.family);
                setExpandedNodes(new Set([res.family._id]));
            }
        } catch (err) {
            console.error('Error fetching family data:', err);
            Alert.alert('Error', 'Failed to load family details');
        } finally {
            setLoading(false);
        }
    };

    const toggleNode = (id) => {
        setExpandedNodes(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const calculateAge = (dob) => {
        if (!dob) return null;
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
            return null;
        }
    };

    const getGenderIcon = (gender) => {
        if (!gender) return 'person-outline';
        switch (gender.toLowerCase()) {
            case 'male':
                return 'man';
            case 'female':
                return 'woman';
            default:
                return 'person-outline';
        }
    };

    const getGenderColor = (gender) => {
        if (!gender) return COLORS.primary;
        switch (gender.toLowerCase()) {
            case 'male':
                return '#3B82F6';
            case 'female':
                return '#EC4899';
            default:
                return COLORS.primary;
        }
    };

    const getFullName = (person) => {
        if (!person) return '';
        const parts = [
            person.firstname || '',
            person.middlename || '',
            person.lastname || ''
        ].filter(part => part.trim() !== '');
        return parts.join(' ');
    };

    const getRelationshipLabel = (person, parentPerson) => {
        if (!person.relationship) return 'Family Member';
        
        const rel = person.relationship.toLowerCase();
        
        if (rel === 'spouse') {
            if (person.gender?.toLowerCase() === 'male') {
                return 'Husband';
            } else if (person.gender?.toLowerCase() === 'female') {
                return 'Wife';
            }
            return 'Spouse';
        }
        
        if (rel === 'father' && parentPerson) {
            if (person.gender?.toLowerCase() === 'male') {
                return 'Son';
            } else if (person.gender?.toLowerCase() === 'female') {
                return 'Daughter';
            }
            return 'Child';
        }
        
        return person.relationship;
    };

    const organizeChildren = (children) => {
        if (!children || children.length === 0) return { spouse: null, actualChildren: [] };
        
        const spouse = children.find(child => 
            child.relationship?.toLowerCase() === 'spouse'
        );
        
        const actualChildren = children.filter(child => 
            child.relationship?.toLowerCase() !== 'spouse'
        );
        
        return { spouse, actualChildren };
    };

    const handleMemberPress = (member) => {
        navigation.navigate('MemberDetails', { userId: member._id });
    };

    const renderMemberCard = (member, isRoot = false, parentPerson = null, level = 0) => {
        const isExpanded = expandedNodes.has(member._id);
        const hasChildren = member.children && member.children.length > 0;
        const { spouse, actualChildren } = organizeChildren(member.children);
        const age = calculateAge(member.dob);
        const genderColor = getGenderColor(member.gender);
        const relationLabel = isRoot ? 'Head' : getRelationshipLabel(member, parentPerson);
        const fullName = getFullName(member);

        return (
            <View key={member._id} style={styles.nodeContainer}>
                {!isRoot && (
                    <View style={styles.connectionLine} />
                )}

                <TouchableOpacity
                    style={[
                        styles.memberCard,
                        isRoot && styles.rootCard,
                        { marginLeft: level * 20 }
                    ]}
                    onPress={() => handleMemberPress(member)}
                    activeOpacity={0.7}
                >
                    <View style={styles.cardHeader}>
                        <View style={styles.memberMainInfo}>
                            <View style={[
                                styles.avatarContainer,
                                { backgroundColor: `${genderColor}15` }
                            ]}>
                                <Ionicons
                                    name={getGenderIcon(member.gender)}
                                    size={24}
                                    color={genderColor}
                                />
                            </View>
                            
                            <View style={styles.memberTextInfo}>
                                <View style={styles.nameRow}>
                                    <Text style={styles.memberName} numberOfLines={1}>
                                        {fullName}
                                    </Text>
                                    {isRoot && (
                                        <View style={styles.headBadge}>
                                            <Text style={styles.headBadgeText}>HEAD</Text>
                                        </View>
                                    )}
                                </View>
                                
                                <Text style={[styles.relationshipText, { color: genderColor }]}>
                                    {relationLabel}
                                </Text>
                                
                                <View style={styles.infoRow}>
                                    {age !== null && (
                                        <View style={styles.infoItem}>
                                            <Feather name="calendar" size={12} color={COLORS.textLight} />
                                            <Text style={styles.infoText}>{`${age} yrs`}</Text>
                                        </View>
                                    )}
                                    {member.job && (
                                        <View style={styles.infoItem}>
                                            <Feather name="briefcase" size={12} color={COLORS.textLight} />
                                            <Text style={styles.infoText} numberOfLines={1}>{member.job}</Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        </View>

                        {hasChildren && (
                            <TouchableOpacity
                                onPress={(e) => {
                                    e.stopPropagation();
                                    toggleNode(member._id);
                                }}
                                style={styles.iconButton}
                            >
                                <Feather
                                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                                    size={18}
                                    color={COLORS.primary}
                                />
                            </TouchableOpacity>
                        )}
                    </View>

                    {spouse && (
                        <View style={styles.spouseContainer}>
                            <View style={styles.spouseDivider}>
                                <View style={styles.dividerLine} />
                                <Ionicons name="heart" size={14} color="#EC4899" />
                                <View style={styles.dividerLine} />
                            </View>
                            
                            <TouchableOpacity
                                style={styles.spouseCard}
                                onPress={() => handleMemberPress(spouse)}
                                activeOpacity={0.7}
                            >
                                <View style={[
                                    styles.spouseAvatar,
                                    { backgroundColor: `${getGenderColor(spouse.gender)}15` }
                                ]}>
                                    <Ionicons
                                        name={getGenderIcon(spouse.gender)}
                                        size={20}
                                        color={getGenderColor(spouse.gender)}
                                    />
                                </View>
                                
                                <View style={styles.spouseInfo}>
                                    <Text style={styles.spouseName} numberOfLines={1}>
                                        {getFullName(spouse)}
                                    </Text>
                                    <Text style={styles.spouseRelation}>
                                        {getRelationshipLabel(spouse, member)}
                                    </Text>
                                    {calculateAge(spouse.dob) !== null && (
                                        <Text style={styles.spouseAge}>
                                            {`${calculateAge(spouse.dob)} years`}
                                        </Text>
                                    )}
                                </View>

                                <View style={styles.viewIconContainer}>
                                    <Feather name="eye" size={16} color={COLORS.textLight} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}

                    {actualChildren.length > 0 && (
                        <View style={styles.childrenBadge}>
                            <Ionicons name="people" size={14} color={COLORS.primary} />
                            <Text style={styles.childrenCount}>
                                {`${actualChildren.length} ${actualChildren.length === 1 ? 'Child' : 'Children'}`}
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>

                {isExpanded && actualChildren.length > 0 && (
                    <View style={styles.childrenContainer}>
                        {actualChildren.map(child => renderMemberCard(child, false, member, level + 1))}
                    </View>
                )}
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <HeaderBack navigation={navigation} title="Family Details" />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Loading family details...</Text>
                </View>
            </View>
        );
    }

    if (!familyData) {
        return (
            <View style={styles.container}>
                <HeaderBack navigation={navigation} title="Family Details" />
                <View style={styles.emptyContainer}>
                    <Ionicons name="git-network-outline" size={80} color={COLORS.gray} />
                    <Text style={styles.emptyTitle}>No Family Data</Text>
                    <Text style={styles.emptyText}>Unable to load family details</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <HeaderBack navigation={navigation} title="Family Details" />
            
            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.legendContainer}>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: '#3B82F6' }]} />
                        <Text style={styles.legendText}>Male</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: '#EC4899' }]} />
                        <Text style={styles.legendText}>Female</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <Ionicons name="heart" size={14} color="#EC4899" />
                        <Text style={styles.legendText}>Married</Text>
                    </View>
                </View>

                <View style={styles.treeContainer}>
                    {renderMemberCard(familyData, true)}
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
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
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
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    legendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 8,
    },
    legendDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 6,
    },
    legendText: {
        fontSize: 12,
        color: COLORS.textLight,
        marginLeft: 6,
    },
    treeContainer: {
        flex: 1,
    },
    nodeContainer: {
        marginBottom: 8,
    },
    connectionLine: {
        width: 2,
        height: 20,
        backgroundColor: COLORS.border,
        marginLeft: 28,
        marginBottom: -8,
    },
    memberCard: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    rootCard: {
        borderWidth: 2,
        borderColor: COLORS.primary,
        elevation: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    memberMainInfo: {
        flexDirection: 'row',
        flex: 1,
    },
    avatarContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    memberTextInfo: {
        flex: 1,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    memberName: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        flex: 1,
        marginRight: 8,
    },
    headBadge: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    headBadgeText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#fff',
    },
    relationshipText: {
        fontSize: 13,
        fontWeight: '500',
        marginBottom: 6,
    },
    infoRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
    },
    infoText: {
        fontSize: 12,
        color: COLORS.textLight,
        marginLeft: 4,
    },
    iconButton: {
        padding: 4,
        marginLeft: 8,
    },
    spouseContainer: {
        marginTop: 12,
    },
    spouseDivider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.border,
    },
    spouseCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF5F7',
        padding: 12,
        borderRadius: 8,
    },
    spouseAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    spouseInfo: {
        flex: 1,
    },
    spouseName: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 2,
    },
    spouseRelation: {
        fontSize: 12,
        color: '#EC4899',
        fontWeight: '500',
        marginBottom: 2,
    },
    spouseAge: {
        fontSize: 11,
        color: COLORS.textLight,
    },
    viewIconContainer: {
        padding: 4,
    },
    childrenBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    childrenCount: {
        fontSize: 12,
        color: COLORS.primary,
        fontWeight: '500',
        marginLeft: 6,
    },
    childrenContainer: {
        marginLeft: 20,
        marginTop: 8,
        paddingLeft: 12,
        borderLeftWidth: 2,
        borderLeftColor: COLORS.border,
    },
});

export default FamilyMember;