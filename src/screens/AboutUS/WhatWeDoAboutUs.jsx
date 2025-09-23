import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import { COLORS } from '../../styles/colors';

const WhatWeDoAboutUs = () => {

    const ServiceItem = ({ title, description }) => (
        <View style={styles.serviceItem}>
            <View style={styles.serviceBullet} />
            <View style={styles.serviceContent}>
                <Text style={styles.serviceTitle}>{title}</Text>
                <Text style={styles.serviceDescription}>{description}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>What We Do</Text>
                <View style={styles.titleUnderline} />
            </View>

            <View style={styles.servicesContainer}>
                <ServiceItem
                    title="Community Events"
                    description="Organizing festivals, cultural programs, and community gatherings"
                />
                <ServiceItem
                    title="Educational Support"
                    description="Scholarships, mentorship programs, and skill development initiatives"
                />
                <ServiceItem
                    title="Business Network"
                    description="Facilitating business connections and entrepreneurship opportunities"
                />
                <ServiceItem
                    title="Cultural Preservation"
                    description="Documenting and promoting traditional crafts and cultural practices"
                />
                <ServiceItem
                    title="Social Welfare"
                    description="Supporting community members in times of need and celebration"
                />
                <ServiceItem
                    title="Youth Development"
                    description="Programs focused on empowering the next generation"
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
    servicesContainer: {
        gap: 14,
    },
    serviceItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: 4,
    },
    serviceBullet: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.accent,
        marginTop: 8,
        marginRight: 12,
    },
    serviceContent: {
        flex: 1,
    },
    serviceTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.darkGray,
        marginBottom: 2,
    },
    serviceDescription: {
        fontSize: 13,
        lineHeight: 18,
        color: COLORS.gray,
    },
});

export default WhatWeDoAboutUs;
