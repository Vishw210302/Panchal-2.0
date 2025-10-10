import { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../styles/colors';

const { width, height } = Dimensions.get('window');

const slides = [
    {
        id: '1',
        title: 'Welcome to Panchal Samaj',
        description: 'Connect with your community and stay updated with all events and activities',
        icon: 'people',
        color: COLORS.primary,
    },
    {
        id: '2',
        title: 'Community Directory',
        description: 'Find and connect with community members and businesses in your area',
        icon: 'business',
        color: COLORS.secondary,
    },
    {
        id: '3',
        title: 'Events & Updates',
        description: 'Stay informed about upcoming events, gatherings, and important announcements',
        icon: 'event',
        color: COLORS.accent,
    },
    {
        id: '4',
        title: 'Get Started',
        description: 'Join thousands of members already connected in our community',
        icon: 'rocket-launch',
        color: COLORS.primary,
    },
];

const Onboarding = ({ onComplete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);
    const scrollX = useRef(new Animated.Value(0)).current;

    const viewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const scrollTo = () => {
        if (currentIndex < slides.length - 1) {
            flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
        } else {
            onComplete?.();
        }
    };

    const skipToEnd = () => {
        flatListRef.current.scrollToIndex({ index: slides.length - 1 });
    };

    const renderItem = ({ item }) => (
        <View style={styles.slide}>
            <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                <MaterialIcons name={item.icon} size={120} color={item.color} />
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
        </View>
    );

    const Pagination = () => (
        <View style={styles.pagination}>
            {slides.map((_, index) => {
                const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
                
                const dotWidth = scrollX.interpolate({
                    inputRange,
                    outputRange: [10, 30, 10],
                    extrapolate: 'clamp',
                });

                const opacity = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.3, 1, 0.3],
                    extrapolate: 'clamp',
                });

                return (
                    <Animated.View
                        key={index}
                        style={[
                            styles.dot,
                            { width: dotWidth, opacity },
                        ]}
                    />
                );
            })}
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.topSection}>
                {currentIndex < slides.length - 1 && (
                    <TouchableOpacity 
                        style={styles.skipButton}
                        onPress={skipToEnd}
                    >
                        <Text style={styles.skipText}>Skip</Text>
                    </TouchableOpacity>
                )}
            </View>

            <FlatList
                ref={flatListRef}
                data={slides}
                renderItem={renderItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                bounces={false}
                keyExtractor={(item) => item.id}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={32}
                onViewableItemsChanged={viewableItemsChanged}
                viewabilityConfig={viewConfig}
            />

            <Pagination />

            <View style={styles.bottomSection}>
                <TouchableOpacity 
                    style={[
                        styles.button,
                        currentIndex === slides.length - 1 && styles.buttonLast
                    ]}
                    onPress={scrollTo}
                >
                    <Text style={styles.buttonText}>
                        {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
                    </Text>
                    <MaterialIcons 
                        name={currentIndex === slides.length - 1 ? 'check' : 'arrow-forward'} 
                        size={24} 
                        color={COLORS.white} 
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    topSection: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingHorizontal: 20,
    },
    skipButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    skipText: {
        fontSize: 16,
        color: COLORS.gray,
        fontWeight: '600',
    },
    slide: {
        width: width,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    iconContainer: {
        width: 200,
        height: 200,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.darkGray,
        textAlign: 'center',
        marginBottom: 15,
    },
    description: {
        fontSize: 16,
        color: COLORS.gray,
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 20,
    },
    pagination: {
        flexDirection: 'row',
        height: 64,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        height: 10,
        borderRadius: 5,
        backgroundColor: COLORS.primary,
        marginHorizontal: 5,
    },
    bottomSection: {
        height: 120,
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    button: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 30,
        gap: 10,
    },
    buttonLast: {
        backgroundColor: COLORS.secondary,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Onboarding;