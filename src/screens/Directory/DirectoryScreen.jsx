import { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getMembersListing } from '../../api/user_api';
import { COLORS } from '../../styles/colors';
import HeaderBack from '../../components/common/HeaderBack';
import ENV from '../../config/env';

const DirectoryScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [memberListing, setMemberListing] = useState([]);

  const handleUserDetailsPage = member => {
    navigation.navigate('UserDetailsPage', { member });
  };

  const getFullName = member => {
    const firstName = member.firstname || '';
    const middleName = member.middlename || '';
    const lastName = member.lastname || '';

    return `${firstName} ${middleName} ${lastName}`.trim();
  };

  const getPhoneNumber = member => {
    return member.mobile_number ? member.mobile_number.toString() : '';
  };

  const getImageUrl = member => {
    if (member.photo && member.photo !== '') {
      return ENV.IMAGE_URL + member.photo;
    }
  };

  const filteredMembers = memberListing.filter(member => {
    const fullName = getFullName(member);
    const phoneNumber = getPhoneNumber(member);

    return (
      fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phoneNumber.includes(searchQuery)
    );
  });

  const renderMemberCard = ({ item }) => (
    <TouchableOpacity
      style={styles.memberCard}
      onPress={() => handleUserDetailsPage(item)}
      activeOpacity={0.7}
    >
      <View style={styles.memberContent}>
        <View style={styles.imageColumn}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: getImageUrl(item) }}
              style={styles.memberImage}
            />
          </View>
        </View>
        <View style={styles.infoColumn}>
          <Text style={styles.memberName} numberOfLines={2}>
            {getFullName(item)}
          </Text>
          <View style={styles.phoneContainer}>
            <MaterialIcons name="phone" size={16} color={COLORS.primary} />
            <Text style={styles.memberPhone}>{getPhoneNumber(item)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  useEffect(() => {
    getMembersListing()
      .then(res => {
        if (Array.isArray(res)) {
          setMemberListing(res);
        } else if (res.data && Array.isArray(res.data)) {
          setMemberListing(res.data);
        } else {
          setMemberListing([]);
        }
      })
      .catch(err => {
        console.error('Fetch members listing failed:', err);
        setMemberListing([]);
      });
  }, []);

  return (
    <View style={styles.container}>
      <HeaderBack title="Panchal Samaj Members" navigation={navigation} />

      <View style={styles.searchSection}>
        <View style={styles.searchInputContainer}>
          <MaterialIcons
            name="search"
            size={22}
            color={COLORS.gray}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search members by name or phone..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.gray}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
              activeOpacity={0.7}
            >
              <MaterialIcons name="clear" size={20} color={COLORS.gray} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.listContainer}>
        {filteredMembers.length > 0 ? (
          <FlatList
            data={filteredMembers}
            renderItem={renderMemberCard}
            keyExtractor={item =>
              item._id || item.personal_id || Math.random().toString()
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.membersList}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <MaterialIcons name="group" size={80} color={COLORS.border} />
            </View>
            <Text style={styles.emptyText}>
              {memberListing.length === 0
                ? 'Loading members...'
                : 'No members found'}
            </Text>
            <Text style={styles.emptySubtext}>
              {memberListing.length === 0
                ? 'Please wait while we fetch the member list'
                : 'Try searching with different name or phone number'}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
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
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 21,
    fontWeight: '600',
    color: '#fff',
  },
  searchSection: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 52,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.darkGray,
    paddingVertical: 0,
  },
  clearButton: {
    padding: 6,
    borderRadius: 15,
    backgroundColor: COLORS.white,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  membersList: {
    paddingBottom: 20,
  },
  separator: {
    height: 12,
  },
  memberCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    elevation: 3,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  memberContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  imageColumn: {
    marginRight: 16,
  },
  imageContainer: {
    position: 'relative',
  },
  memberImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: COLORS.white,
    backgroundColor: COLORS.lightGray,
  },
  infoColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  memberName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: 8,
    lineHeight: 22,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberPhone: {
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: '600',
    marginLeft: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    marginBottom: 20,
    padding: 20,
    borderRadius: 50,
    backgroundColor: COLORS.lightGray,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 15,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default DirectoryScreen;
