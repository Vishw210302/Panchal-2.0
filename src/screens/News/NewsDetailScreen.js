import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../styles/colors';

const NewsDetailScreen = ({ navigation, route }) => {

    const newsItem = route?.params?.newsItem;

    const newsData = newsItem;

    const handleBack = () => {
        navigation?.goBack();
    };

    const stripHtmlTags = (str) => {
        if (!str) return "";
        return str.replace(/<\/?[^>]+(>|$)/g, "").trim();
    };

    const limitCharacters = (text, charLimit) => {
        return text.length > charLimit
            ? text.slice(0, charLimit).trim() + '...'
            : text;
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return "Unknown date";


        const date = new Date(parseInt(timestamp));


        if (isNaN(date.getTime())) {
            return timestamp;
        }

        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return date.toLocaleDateString('en-US', options);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={handleBack}
                    activeOpacity={0.7}
                >
                    <MaterialIcons name="arrow-back-ios" color="#000" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>News Details</Text>
            </View>
            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: "http://192.168.1.13:3000/" + newsData.image }}
                        style={styles.mainImage}
                        resizeMode="cover"
                    />
                </View>

                <View style={styles.contentContainer}>
                    <View>
                        <View>
                            <Text style={styles.authorText}>Create By {newsData?.createdBy}</Text>
                        </View>
                        <View style={styles.createdBy}>
                            <Text style={styles.dateText}>{formatDate(newsData?.created_at)}</Text>
                        </View>
                    </View>

                    <Text style={styles.title}>{newsData.titleE}</Text>
                    <Text style={styles.description}>{limitCharacters(stripHtmlTags(newsData.descriptionE))}{ }</Text>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginBottom: 20,
        marginTop: 40,
    },
    header: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    headerTitle: {
        fontSize: 21,
        fontWeight: '600',
    },
    headerText: {
        fontSize: 21,
        fontWeight: '600',
    },
    scrollContainer: {
        flex: 1,
    },
    imageContainer: {
        position: 'relative',
    },
    mainImage: {
        width: '100%',
        height: 250,
        backgroundColor: COLORS.lightGray,
    },
    contentContainer: {
        backgroundColor: COLORS.white,
        marginTop: -20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 40,
    },
    createdBy: {
        marginBottom: 15
    },
    authorText: {
        fontSize: 18,
        color: COLORS.primary,
        fontWeight: '600',
    },
    dateText: {
        fontSize: 16,
        color: COLORS.gray,
    },
    title: {
        fontSize: 21,
        fontWeight: '700',
        color: COLORS.darkGray,
        lineHeight: 28,
        marginBottom: 5,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: COLORS.darkGray,
        textAlign: 'justify',
    },
});

export default NewsDetailScreen;