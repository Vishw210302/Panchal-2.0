import { useNavigation } from '@react-navigation/native';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../styles/colors';
import { useUser } from '../../context/UserContext';
import { useEffect, useState } from 'react';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 3;

const AllCardsOfPage = () => {
  const { userData } = useUser();
  const navigation = useNavigation();

  const [pressed, setPressed] = useState({})
  const [cardData, setCardData] = useState([
    {
      id: 1,
      title: 'About Us',
      iconName: 'info',
      color: COLORS.primary,
      route: 'AboutUs',
    },
    {
      id: 2,
      title: 'Directory',
      iconName: 'contacts',
      color: COLORS.error,
      route: 'DirectoryScreen',
    },
    {
      id: 3,
      title: 'Committee',
      iconName: 'groups',
      color: COLORS.secondary,
      route: 'CommitteeMembers',
    },
    {
      id: 4,
      title: 'Events',
      iconName: 'event',
      color: COLORS.accent,
      route: 'EventScreen',
    },
    {
      id: 5,
      title: 'Business',
      iconName: 'storefront',
      color: '#9C27B0',
      route: 'BusinessScreen',
    },
  ]);

  useEffect(() => {
    if (!userData) {
      let isLogin = cardData.find(item => item.id == 6)
      if (!isLogin) setCardData(prevCards => [
        ...prevCards,
        {
          id: 6,
          title: 'Login',
          iconName: 'login',
          color: '#FF9800',
          route: 'Login',
        },
      ]);
    }
  }, []);

  const handleCardPress = item => {
    navigation.navigate(item.route);
  };

  const renderCard = item => {
    if (pressed[item.id]) {
      console.log("Clicked", item.id, " : ", pressed[item.id])
    }
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.card}
        onPressIn={() => setPressed(prev => ({ ...prev, [item.id]: true }))}
        onPressOut={() => setPressed(prev => ({ ...prev, [item.id]: false }))}
        onPress={() => handleCardPress(item)}
        activeOpacity={1}
      >
        <View style={[styles.cardBackground, pressed[item.id] ? styles.cardBackgroundHover : {}]}>
          <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
            <Icon name={item.iconName} size={26} color={COLORS.white} />
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {item.title}
            </Text>
          </View>

          <View
            style={[
              styles.cornerDecoration,
              { backgroundColor: item.color + '25' },
            ]}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const renderCardRows = () => {
    const rows = [];
    for (let i = 0; i < cardData.length; i += 3) {
      const rowCards = cardData.slice(i, i + 3);
      rows.push(
        <View key={i} style={styles.cardRow}>
          {rowCards.map(renderCard)}
          {rowCards.length < 3 &&
            Array(3 - rowCards.length)
              .fill(null)
              .map((_, index) => (
                <View
                  key={`empty-${index}`}
                  style={[styles.card, { opacity: 0 }]}
                />
              ))}
        </View>,
      );
    }
    return rows;
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderCardRows()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 15,
    paddingBottom: 0,
  },
  cardRow: {
    flexDirection: 'row',
    marginBottom: 18,
    justifyContent: 'space-between',
  },
  card: {
    width: cardWidth,
    height: 125,
  },
  cardBackground: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: COLORS.card,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBackgroundHover: {
    elevation: 6,
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.darkGray,
    textAlign: 'center',
    lineHeight: 16,
  },
  cornerDecoration: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 28,
    height: 28,
    borderBottomLeftRadius: 16,
  },
});

export default AllCardsOfPage;
