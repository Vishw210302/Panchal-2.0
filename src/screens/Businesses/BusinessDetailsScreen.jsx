import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../styles/colors';

const BusinessDetailsScreen = ({ route, navigation }) => {

    const business = route?.params?.business;
    const handleBack = () => {
        navigation?.goBack();
    };
    const handleContact = () => {
        alert(`You clicked to contact ${business.name}`);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
                    <MaterialIcons name="arrow-back-ios" color={COLORS.white} size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Business Details</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <Image source={{ uri: business.image }} style={styles.image} />

                <View style={styles.content}>
                    <Text style={styles.title}>{business.name}</Text>

                    <View style={styles.row}>
                        <MaterialIcons name="category" size={20} color={COLORS.primary} />
                        <Text style={styles.detailText}>{business.category}</Text>
                    </View>

                    <View style={styles.row}>
                        <MaterialIcons name="place" size={20} color={COLORS.secondary} />
                        <Text style={styles.detailText}>{business.location}</Text>
                    </View>

                    <View style={styles.row}>
                        <MaterialIcons name="person" size={20} color={COLORS.accent} />
                        <Text style={styles.detailText}>{business.owner}</Text>
                    </View>

                    <Text style={styles.sectionTitle}>About this Business</Text>
                    <Text style={styles.description}>{business.description}</Text>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.8}
                    onPress={handleContact}
                >
                    <Text style={styles.buttonText}>Contact Business</Text>
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
    header: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        height: 100,
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: COLORS.primary,
        elevation: 2,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginLeft: 10,
        color: COLORS.white,
    },
    image: {
        width: '100%',
        height: 220,
    },
    content: {
        padding: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: COLORS.darkGray,
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    detailText: {
        marginLeft: 6,
        fontSize: 15,
        color: COLORS.gray,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.black,
        marginTop: 16,
        marginBottom: 6,
    },
    description: {
        fontSize: 15,
        lineHeight: 22,
        color: COLORS.darkGray,
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.card,
    },
    button: {
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.white,
    },
});

export default BusinessDetailsScreen;
