import { useEffect, useRef, useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    View
} from 'react-native';
import { getSlider } from '../../api/user_api';
import ENV from '../../config/env';

const HomeSliderCard = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [screenData, setScreenData] = useState(Dimensions.get('window'));
    const flatListRef = useRef(null);
    const [sliderData, setSliderData] = useState([]);

    useEffect(() => {
        getSlider()
            .then((res) => {
                let data = [];
                if (Array.isArray(res)) {
                    data = res;
                } else if (res?.data && Array.isArray(res.data)) {
                    data = res.data;
                } else {
                    console.warn('Unexpected slider response:', res);
                }

                // sort by "order" field
                if (data.length > 0) {
                    data = [...data].sort((a, b) => a.order - b.order);
                }

                setSliderData(data);
            })
            .catch((err) => console.error('Fetch slider failed:', err));
    }, []);

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setScreenData(window);
        });
        return () => subscription?.remove();
    }, []);

    useEffect(() => {
        if (sliderData.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex(prevIndex => {
                const nextIndex = (prevIndex + 1) % sliderData.length;
                flatListRef.current?.scrollToIndex({
                    index: nextIndex,
                    animated: true,
                });
                return nextIndex;
            });
        }, 3000);

        return () => clearInterval(interval);
    }, [sliderData.length]);

    const handleMomentumScrollEnd = (event) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / screenData.width);
        setCurrentIndex(index);
    };

    const renderSlideItem = ({ item }) => (
        <View style={[styles.slideContainer, { width: screenData.width }]}>
            <Image
                source={{ uri: ENV.IMAGE_URL + item.image }}
                style={styles.slideImage}
                resizeMode="cover"
            />
        </View>
    );

    const getItemLayout = (_, index) => ({
        length: screenData.width,
        offset: screenData.width * index,
        index,
    });

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={sliderData}
                renderItem={renderSlideItem}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={handleMomentumScrollEnd}
                keyExtractor={(item) => item._id?.toString()}
                getItemLayout={getItemLayout}
                initialScrollIndex={0}
                bounces={false}
                decelerationRate="fast"
                snapToInterval={screenData.width}
                snapToAlignment="start"
                removeClippedSubviews
                maxToRenderPerBatch={3}
                windowSize={5}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 250,
    },
    slideContainer: {
        position: 'relative',
    },
    slideImage: {
        width: '100%',
        height: '100%',
    },
});

export default HomeSliderCard;
