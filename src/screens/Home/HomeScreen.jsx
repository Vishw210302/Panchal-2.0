import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, ActivityIndicator, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeSliderCard from '../../components/home/HomeSliderCard';
import AllCardsOfPage from './AllCardsOfPage';
import RecentNewsListing from './RecentNewsListing';
import RecentEventListing from './RecentEventListing';
import { COLORS } from '../../styles/colors';

const HomeScreen = ({navigation}) => {
    // const navigation = useNavigation();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkOnboarding = async () => {
            try {
                const onboardingCompleted = await AsyncStorage.getItem('Onboarding');
                if (!onboardingCompleted) {
                    navigation.replace('Onboarding'); // replace avoids back navigation
                    return;
                }
            } catch (error) {
                console.error('Error loading user data:', error);
            } finally {
                setIsChecking(false);
            }
        };

        checkOnboarding();
    }, [navigation]);

    if (isChecking) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
                <HomeSliderCard />
                <AllCardsOfPage />
                <RecentEventListing navigation={navigation} />
                <RecentNewsListing />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 60,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default HomeScreen;
