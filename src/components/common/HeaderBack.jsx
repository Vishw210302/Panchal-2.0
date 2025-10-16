import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { View, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../../styles/colors';

const HeaderBack = ({ title = '', navigation, icon  }) => {
  const handleBack = () => {
    navigation?.goBack();
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
        <MaterialIcons name="arrow-back-ios" color="#fff" size={24} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
};

const styles = {
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    height: 95,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.primary,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 21,
    fontWeight: '600',
    color: '#fff',
  },
};

export default HeaderBack;
