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

const NewsScreen = () => {

    const navigation = useNavigation();
    const [newsDataListing, setNewsDataListing] = useState([])

    const limitWords = (text, wordLimit) => {
        const words = text.split(' ');
        return words.length > wordLimit
            ? words.slice(0, wordLimit).join(' ') + '...'
            : text;
    };

    const handleClick = (newsId) => {
        const selectedNews = newsDataListing.find(news => news._id === newsId);

        navigation.navigate('NewsDetails', {
            newsItem: selectedNews
        });
    };

    useEffect(() => {
        getNewsListing()
            .then((res) => {
                let data = [];
                if (Array.isArray(res)) {
                    data = res;
                } else if (res?.data && Array.isArray(res.data)) {
                    data = res.data;
                } else {
                    console.warn('Unexpected slider response:', res);
                }
                if (data.length > 0 && data[0].hasOwnProperty('order')) {
                    data = [...data].sort((a, b) => a.order - b.order);
                }

                setNewsDataListing(data);
            })
            .catch((err) => console.error('Fetch slider failed:', err));
    }, []);

    return (
        <>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>News Listing</Text>
                </View>

                <ScrollView
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {newsDataListing.map((news) => (
                        <TouchableOpacity
                            key={news._id}
                            style={styles.card}
                            activeOpacity={0.7}
                            onPress={() => {
                                handleClick(news._id);
                            }}>
                            <Image source={{ uri: "http://192.168.1.13:3000/" + news.image }} style={styles.image} />
                            <View style={styles.textContainer}>
                                <Text style={styles.title}>
                                    {limitWords(news.titleE, 25)}
                                </Text>
                                <Text style={styles.description}>
                                    {limitWords(news.descriptionE, 55)}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        marginBottom: 90,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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
    contentContainer: {
        padding: 16,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    image: {
        width: '100%',
        height: 180,
        resizeMode: 'cover',
    },
    textContainer: {
        padding: 12,
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
export default NewsScreen;