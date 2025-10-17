import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../styles/colors';

const HeaderBack = ({ title = '', subTitle, navigation, icon, iconAction, iconActionText = '' }) => {
  const handleBack = () => {
    navigation?.goBack();
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleBack} activeOpacity={0.7} style={styles.headerIcon}>
        <MaterialIcons name="arrow-back" color="#fff" size={24} />
      </TouchableOpacity>

      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>{title}</Text>
        {subTitle && <Text style={styles.headerSubtitle}>{subTitle}</Text>}
      </View>
      {icon &&
        (iconAction ? (<TouchableOpacity onPress={() => iconAction()} activeOpacity={0.7} style={[styles.headerIcon, iconActionText ? { width: 100, flexDirection: "row", gap: 5 } : {}]}>
          <MaterialIcons name={icon} size={24} color={COLORS.white} /> {iconActionText ? <Text style={{ color: COLORS.white, fontSize: 14 }}>{iconActionText}</Text> : null}
        </TouchableOpacity>)
          : (<View style={styles.headerIcon}>
            <MaterialIcons name={icon} size={24} color={COLORS.white} />
          </View>))
      }
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 20,
    height: 85,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.primary,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    flex: 1,
    alignSelf: 'center',
    paddingTop: 10
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 21,
    fontWeight: '600',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '400',
  },
});

export default HeaderBack;
