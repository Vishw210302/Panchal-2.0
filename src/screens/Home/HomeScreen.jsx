import { ScrollView, StyleSheet, View } from 'react-native';
import HomeSliderCard from '../../components/home/HomeSliderCard';
import AllCardsOfPage from './AllCardsOfPage';
import RecentNewsListing from './RecentNewsListing';

const HomeScreen = () => {
    return (
        <ScrollView>
            <View style={styles.container}>
                <HomeSliderCard />
                <AllCardsOfPage />
                <RecentNewsListing />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 60,
    },
});


export default HomeScreen;
