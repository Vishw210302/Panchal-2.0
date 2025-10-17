import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator
} from 'react-native';
import { getNewsListing } from '../../api/user_api';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ENV from '../../config/env';
import { COLORS } from '../../styles/colors';

const RecentNewsListing = () => {
    const navigation = useNavigation();
    const [newsListing, setNewsListing] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                setLoading(true);
                const res = await getNewsListing();
                setNewsListing(res);
            } catch (err) {
                console.error("Fetch news failed:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    const stripHtmlTags = (str) => {
        if (!str) return "";
        return str.replace(/<\/?[^>]+(>|$)/g, "").trim();
    };

    const limitCharacters = (text, charLimit) => {
        return text.length > charLimit
            ? text.slice(0, charLimit).trim() + '...'
            : text;
    };

    const handleNewsPress = (newsId) => {
        const selectedNews = newsListing.find(news => news._id === newsId);
        navigation.navigate('NewsDetails', {
            newsItem: selectedNews
        });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4A90E2" />
            </View>
        );
    }

    return (
        <View style={styles.wrapper}>
            <View style={styles.headerContainer}>
                <Text style={styles.sectionTitle}>Recent News</Text>
                <TouchableOpacity onPress={() => navigation.navigate('News')}>
                    <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.container}>
                {newsListing.slice(0, 3).map((news, index) => (
                    <TouchableOpacity
                        key={news._id}
                        activeOpacity={0.8}
                        onPress={() => handleNewsPress(news._id)}
                        style={styles.cardWrapper}
                    >
                        <View style={styles.card}>
                            <View style={styles.imageContainer}>
                                <Image 
                                    source={{ uri: `${ENV.IMAGE_URL}${news.image}` }} 
                                    style={styles.image} 
                                />
                                <View style={styles.imageOverlay} />
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={styles.title} numberOfLines={2}>
                                    {stripHtmlTags(news.titleE)}
                                </Text>
                                <Text style={styles.description} numberOfLines={2}>
                                    {stripHtmlTags(news.descriptionE)}
                                </Text>
                                <View style={styles.footer}>
                                    <View style={styles.readMore}>
                                        <Text style={styles.readMoreText}>Read more </Text><MaterialIcons name={"arrow-forward-ios"} color="#4A90E2" size={14} />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: COLORS.background,
        paddingTop: 20,
        paddingBottom: 40,
    },
    loadingContainer: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    viewAllText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4A90E2',
    },
    container: {
        paddingHorizontal: 16,
    },
    cardWrapper: {
        marginBottom: 16,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
        // shadowColor: '#000',
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // shadowOpacity: 0.08,
        // shadowRadius: 8,
        // elevation: 3,
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: 200,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    imageOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    textContainer: {
        padding: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 8,
        lineHeight: 24,
    },
    description: {
        fontSize: 14,
        color: '#666666',
        lineHeight: 20,
        marginBottom: 12,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    readMore: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    readMoreText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4A90E2',
        paddingBottom: 4
    },
});

export default RecentNewsListing;