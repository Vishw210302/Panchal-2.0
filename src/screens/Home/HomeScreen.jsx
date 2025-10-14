import { ScrollView, StyleSheet, View } from 'react-native';
import HomeSliderCard from '../../components/home/HomeSliderCard';
import AllCardsOfPage from './AllCardsOfPage';
import RecentNewsListing from './RecentNewsListing';
import RecentEventListing from './RecentEventListing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';


const HomeScreen = () => {
     const navigation = useNavigation();
    useEffect(() => {
        loadUserData();
    }, []);
    const loadUserData = async () => {
        try {
            const Onboarding = await AsyncStorage.getItem('Onboarding');
            if (!Onboarding) {
                navigation.navigate('Onboarding');
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        } 
    };
    return (
        <ScrollView>
            <View style={styles.container}>
                <HomeSliderCard />
                <AllCardsOfPage />
                <RecentNewsListing />
                <RecentEventListing />
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
