import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import VillagePageListing from '../screens/Directory/VillagePageListing';
import HeaderLable from '../screens/Home/HeaderLable';
import HomeScreen from '../screens/Home/HomeScreen';
import NewsScreen from '../screens/News/NewsScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import { COLORS } from '../styles/colors';

const TabIcon = ({ name, focused, label }) => {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'home':
        return {
          lib: 'Ionicons',
          icon: focused ? 'home' : 'home-outline',
          size: 24
        };
      case 'news':
        return {
          lib: 'Ionicons',
          icon: focused ? 'newspaper' : 'newspaper-outline',
          size: 24
        };
      case 'profile':
        return {
          lib: 'FontAwesome5',
          icon: focused ? 'user-alt' : 'user',
          size: 22
        };
      case 'village':
        return {
          lib: 'MaterialCommunityIcons',
          icon: focused ? 'home-group' : 'home-group-plus',
          size: 26
        };
      case 'directory':
        return {
          lib: 'MaterialCommunityIcons',
          icon: focused ? 'home-city' : 'home-city-outline',
          size: 24
        };
      default:
        return {
          lib: 'Feather',
          icon: 'more-horizontal',
          size: 24
        };
    }
  };

  const { lib, icon, size } = getIcon(name);

  const getIconComponent = (library) => {
    switch (library) {
      case 'Ionicons':
        return Ionicons;
      case 'MaterialCommunityIcons':
        return MaterialCommunityIcons;
      case 'FontAwesome5':
        return FontAwesome5;
      case 'Feather':
        return Feather;
      default:
        return Ionicons;
    }
  };

  const IconComponent = getIconComponent(lib);

  return (
    <View style={{
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      paddingTop: 8,
      paddingBottom: 6,
      minWidth: 70,
    }}>
      <View style={{
        alignItems: 'center',
        justifyContent: 'center',
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: focused ? COLORS.primary + '15' : 'transparent',
        marginBottom: 4,
        borderWidth: focused ? 1 : 0,
        borderColor: focused ? COLORS.primary + '30' : 'transparent',
      }}>
        <IconComponent
          name={icon}
          size={size}
          color={focused ? COLORS.primary : COLORS.gray}
          solid={lib === 'FontAwesome5' && focused}
        />
      </View>

      <Text style={{
        fontSize: 11,
        color: focused ? COLORS.primary : COLORS.gray,
        fontWeight: focused ? '600' : '400',
        textAlign: 'center',
        marginTop: 2,
        maxWidth: 60,
      }} numberOfLines={1} ellipsizeMode="tail">
        {label}
      </Text>

      {focused && (
        <View
          style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: COLORS.primary,
            position: 'absolute',
            bottom: 2,
          }}
        />
      )}
    </View>
  );
};

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <>
      <HeaderLable />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: COLORS.white,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            height: 85,
            position: 'absolute',
            shadowColor: COLORS.black,
            shadowOpacity: 0.15,
            shadowOffset: { width: 0, height: -3 },
            shadowRadius: 8,
            elevation: 10,
            paddingBottom: 10,
            paddingTop: 8,
            borderTopWidth: 0,
          },
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.gray,
          tabBarIcon: ({ focused }) => {
            let iconName;
            let label;

            if (route.name === 'Home') {
              iconName = 'home';
              label = 'Home';
            } else if (route.name === 'Village') {
              iconName = 'village';
              label = 'Village';
            } else if (route.name === 'Profile') {
              iconName = 'profile';
              label = 'Profile';
            } else if (route.name === 'News') {
              iconName = 'news';
              label = 'News';
            }

            return <TabIcon name={iconName} focused={focused} label={label} />;
          },
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ tabBarLabel: 'Home' }}
        />
        <Tab.Screen
          name="Village"
          component={VillagePageListing}
          options={{ tabBarLabel: 'Village' }}
        />
        <Tab.Screen
          name="News"
          component={NewsScreen}
          options={{ tabBarLabel: 'News' }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ tabBarLabel: 'Profile' }}
        />
      </Tab.Navigator>
    </>
  );
};

export default BottomTabNavigator;