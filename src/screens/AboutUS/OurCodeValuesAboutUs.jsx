import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import { COLORS } from '../../styles/colors';

const ValueItem = ({ icon, title, description }) => (
    <View style={styles.valueItem}>
        <Text style={styles.valueIcon}>{icon}</Text>
        <View style={styles.valueContent}>
            <Text style={styles.valueTitle}>{title}</Text>
            <Text style={styles.valueDescription}>{description}</Text>
        </View>
    </View>
);

const OurCodeValuesAboutUs = () => {
    return (
        <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Our Core Values</Text>
                <View style={styles.titleUnderline} />
            </View>

            <View style={styles.valuesContainer}>
                <ValueItem
                    icon="🤝"
                    title="Unity"
                    description="Bringing together community members across regions and generations"
                />
                <ValueItem
                    icon="🏛️"
                    title="Heritage"
                    description="Preserving and celebrating our rich cultural and professional traditions"
                />
                <ValueItem
                    icon="📚"
                    title="Education"
                    description="Promoting learning and skill development for community advancement"
                />
                <ValueItem
                    icon="💼"
                    title="Progress"
                    description="Supporting entrepreneurship and professional growth"
                />
                <ValueItem
                    icon="🎨"
                    title="Craftsmanship"
                    description="Honoring our legacy of excellence in skilled trades and arts"
                />
                <ValueItem
                    icon="🌟"
                    title="Service"
                    description="Commitment to serving our community and society at large"
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    sectionCard: {
        backgroundColor: COLORS.white,
        marginHorizontal: 16,
        marginBottom: 20,
        borderRadius: 16,
        padding: 24,
        shadowColor: COLORS.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    sectionHeader: {
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.darkGray,
        marginBottom: 8,
        textAlign: 'center',
    },
    titleUnderline: {
        width: 60,
        height: 3,
        backgroundColor: COLORS.primary,
        borderRadius: 2,
    },
    description: {
        fontSize: 16,
        lineHeight: 26,
        color: COLORS.darkGray,
        marginBottom: 16,
        textAlign: 'justify',
    },
    visionMissionContainer: {
        gap: 20,
    },
    visionCard: {
        backgroundColor: COLORS.lightGray,
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary,
    },
    missionCard: {
        backgroundColor: COLORS.lightGray,
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        borderLeftWidth: 4,
        borderLeftColor: COLORS.secondary,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconText: {
        fontSize: 24,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.darkGray,
        marginBottom: 8,
        textAlign: 'center',
    },
    cardDescription: {
        fontSize: 14,
        lineHeight: 22,
        color: COLORS.gray,
        textAlign: 'center',
    },
    valuesContainer: {
        gap: 16,
    },

    valueItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: 8,
    },
    valueIcon: {
        fontSize: 24,
        marginRight: 16,
        marginTop: 2,
    },
    valueContent: {
        flex: 1,
    },
    valueTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.darkGray,
        marginBottom: 4,
    },
    valueDescription: {
        fontSize: 14,
        lineHeight: 20,
        color: COLORS.gray,
    },
});

export default OurCodeValuesAboutUs;