import { useEffect, useState } from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { getVillagesListing } from '../../api/user_api';
import ENV from '../../config/env';

const VillagePageListing = () => {

    const [viewType, setViewType] = useState('grid');
    const [villageListing, setVillageListing] = useState([]);

    useEffect(() => {
        getVillagesListing()
            .then((res) => {
                if (res && Array.isArray(res)) {
                    setVillageListing(res);
                } else if (res && res.data && Array.isArray(res.data)) {
                    setVillageListing(res.data);
                } else {
                    setVillageListing([]);
                }
            })
            .catch((err) => {
                console.error('Fetch villages failed:', err);
                setVillageListing([]);
            });
    }, [])

    const getImageUrl = (imageName) => {
        return `${ENV.IMAGE_URL}${imageName}`;
    };

    const renderGridItem = ({ item }) => (
        <TouchableOpacity activeOpacity={0.7} style={styles.gridItem}>
            <View style={styles.gridImageContainer}>
                <Image
                    source={{ uri: getImageUrl(item.image) }}
                    style={styles.gridImage}
                />
            </View>
            <View style={styles.gridContent}>
                <Text style={styles.gridTitle}>{item.nameE || item.name || 'Unknown Village'}</Text>
                {item.nameG && (
                    <Text style={styles.gridSubtitle}>{item.nameG}</Text>
                )}
            </View>
        </TouchableOpacity>
    );

    const renderListItem = ({ item }) => (
        <TouchableOpacity activeOpacity={0.7} style={styles.listItem}>
            <Image
                source={{ uri: getImageUrl(item.image) }}
                style={styles.listImage}
            />
            <View style={styles.listContent}>
                <View style={styles.listHeader}>
                    <Text style={styles.listTitle}>{item.nameE || item.name || 'Unknown Village'}</Text>
                </View>
                {item.nameG && (
                    <Text style={styles.listSubtitle}>{item.nameG}</Text>
                )}
                <Text style={styles.listDate}>
                    Created: {new Date(item.createdAt).toLocaleDateString()}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Village Listings</Text>
                <View style={styles.toggleContainer}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={[
                            styles.toggleButton,
                            viewType === 'grid' && styles.activeToggle,
                        ]}
                        onPress={() => setViewType('grid')}
                    >
                        <Text
                            style={[
                                styles.toggleText,
                                viewType === 'grid' && styles.activeToggleText,
                            ]}
                        >
                            ⊞ Grid
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={[
                            styles.toggleButton,
                            viewType === 'list' && styles.activeToggle,
                        ]}
                        onPress={() => setViewType('list')}
                    >
                        <Text
                            style={[
                                styles.toggleText,
                                viewType === 'list' && styles.activeToggleText,
                            ]}
                        >
                            ☰ List
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {villageListing.length > 0 ? (
                <FlatList
                    data={villageListing}
                    keyExtractor={(item) => item._id || item.id?.toString() || Math.random().toString()}
                    renderItem={viewType === 'grid' ? renderGridItem : renderListItem}
                    numColumns={viewType === 'grid' ? 2 : 1}
                    key={viewType}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No villages found</Text>
                </View>
            )}
        </View>
    );
};

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
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: '#ecf0f1',
        borderRadius: 25,
        padding: 3,
    },
    toggleButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        minWidth: 70,
        alignItems: 'center',
    },
    activeToggle: {
        backgroundColor: '#3498db',
    },
    toggleText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#7f8c8d',
    },
    activeToggleText: {
        color: '#fff',
    },
    listContainer: {
        padding: 10,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
    },
    emptyText: {
        fontSize: 18,
        color: '#7f8c8d',
        fontWeight: '500',
    },

    gridItem: {
        flex: 1,
        backgroundColor: '#fff',
        margin: 8,
        borderRadius: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        overflow: 'hidden',
    },
    gridImageContainer: {
        position: 'relative',
    },
    gridImage: {
        width: '100%',
        height: 140,
        resizeMode: 'cover',
    },
    gridContent: {
        padding: 12,
    },
    gridTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 4,
    },
    gridSubtitle: {
        fontSize: 14,
        color: '#7f8c8d',
        fontWeight: '500',
    },
    gridInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    gridInfoText: {
        fontSize: 12,
        color: '#7f8c8d',
        fontWeight: '500',
    },

    listItem: {
        backgroundColor: '#fff',
        margin: 8,
        borderRadius: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        overflow: 'hidden',
        flexDirection: 'row',
    },
    listImage: {
        width: 100,
        height: 80,
        resizeMode: 'cover',
    },
    listContent: {
        flex: 1,
        padding: 15,
        justifyContent: 'space-between',
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    listTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2c3e50',
        flex: 1,
        marginRight: 10,
    },
    listSubtitle: {
        fontSize: 14,
        color: '#7f8c8d',
        fontWeight: '500',
        marginBottom: 8,
    },
    listDate: {
        fontSize: 12,
        color: '#95a5a6',
        fontWeight: '500',
    },
    listDescription: {
        fontSize: 14,
        color: '#7f8c8d',
        lineHeight: 20,
        marginBottom: 10,
    },
    listFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    listInfo: {
        flexDirection: 'row',
        gap: 15,
    },
    listInfoText: {
        fontSize: 13,
        color: '#95a5a6',
        fontWeight: '500',
    },

});

export default VillagePageListing;