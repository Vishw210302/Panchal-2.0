import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { getNewsListing } from '../../api/user_api';

const RecentNewsListing = () => {

    const navigation = useNavigation();
    const [newsListing, setNewsListing] = useState([])

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await getNewsListing();
                setNewsListing(res);
            } catch (err) {
                console.error("Fetch news failed:", err);
            }
        };

        fetchNews();
    }, []);

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

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >
            {newsListing.map((news) => (
                <TouchableOpacity
                    key={news._id}
                    activeOpacity={0.7}
                    onPress={() => {
                        handleNewsPress(news._id)
                    }}
                >
                    <View key={news._id} style={styles.card}>
                        <Image source={{ uri: `http://192.168.1.13:3000/${news.image}` }} style={styles.image} />
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>
                                {limitCharacters(news.titleE, 25)}
                            </Text>
                            <Text style={styles.description}>
                                {limitCharacters(news.descriptionE, 60)}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9F9F9",
    },
    contentContainer: {
        padding: 14,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 20,
        shadowRadius: 6,
        elevation: 4,
    },
    image: {
        width: 130,
        height: 100,
        resizeMode: 'cover',
    },
    textContainer: {
        flex: 1,
        paddingLeft: 10,
        paddingTop: 5,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 6,
    },
    description: {
        fontSize: 14,
        color: '#555555',
        lineHeight: 20,
    },
});

export default RecentNewsListing;