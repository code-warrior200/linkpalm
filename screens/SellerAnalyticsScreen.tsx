import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface StatCard {
  id: string;
  title: string;
  value: string;
  subtext: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  backgroundColor: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

interface ActivityItem {
  id: string;
  type: 'order' | 'listing' | 'review' | 'payment';
  title: string;
  description: string;
  time: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
}

const TIME_PERIODS = ['Today', 'This Week', 'This Month', 'All Time'];

export default function SellerAnalyticsScreen(): React.ReactElement {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('This Month');

  const stats: StatCard[] = [
    {
      id: '1',
      title: 'Total Sales',
      value: '₦12,450',
      subtext: 'This month',
      icon: 'cash-outline',
      iconColor: '#4caf50',
      backgroundColor: '#f1f8f4',
      trend: {
        value: '+12.5%',
        isPositive: true,
      },
    },
    {
      id: '2',
      title: 'Active Listings',
      value: '8',
      subtext: 'Currently selling',
      icon: 'list-outline',
      iconColor: '#2196f3',
      backgroundColor: '#e3f2fd',
    },
    {
      id: '3',
      title: 'Orders Completed',
      value: '47',
      subtext: 'All time',
      icon: 'checkmark-circle-outline',
      iconColor: '#ff9800',
      backgroundColor: '#fff3e0',
      trend: {
        value: '+5',
        isPositive: true,
      },
    },
    {
      id: '4',
      title: 'Average Rating',
      value: '4.8',
      subtext: 'Based on 47 reviews',
      icon: 'star-outline',
      iconColor: '#ffc107',
      backgroundColor: '#fffbf0',
    },
  ];

  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'order',
      title: 'New order received',
      description: 'Order #1234 - Premium Red Palm Oil',
      time: '2 hours ago',
      icon: 'receipt-outline',
      iconColor: '#4caf50',
    },
    {
      id: '2',
      type: 'listing',
      title: 'Listing updated',
      description: 'Organic village palm oil - 20L',
      time: '1 day ago',
      icon: 'create-outline',
      iconColor: '#2196f3',
    },
    {
      id: '3',
      type: 'payment',
      title: 'Payment received',
      description: '₦450.00 from Order #1230',
      time: '2 days ago',
      icon: 'cash-outline',
      iconColor: '#4caf50',
    },
    {
      id: '4',
      type: 'review',
      title: 'New review received',
      description: '5 stars - "Great quality product!"',
      time: '3 days ago',
      icon: 'star-outline',
      iconColor: '#ffc107',
    },
  ];

  const onRefresh = (): void => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const renderStatCard = (stat: StatCard) => (
    <View key={stat.id} style={[styles.statCard, { backgroundColor: stat.backgroundColor }]}>
      <View style={styles.statCardHeader}>
        <View style={[styles.statIconContainer, { backgroundColor: stat.backgroundColor }]}>
          <Ionicons name={stat.icon} size={24} color={stat.iconColor} />
        </View>
        {stat.trend && (
          <View
            style={[
              styles.trendBadge,
              stat.trend.isPositive ? styles.trendPositive : styles.trendNegative,
            ]}
          >
            <Ionicons
              name={stat.trend.isPositive ? 'arrow-up' : 'arrow-down'}
              size={12}
              color={stat.trend.isPositive ? '#4caf50' : '#f44336'}
            />
            <Text
              style={[
                styles.trendText,
                stat.trend.isPositive ? styles.trendTextPositive : styles.trendTextNegative,
              ]}
            >
              {stat.trend.value}
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.statTitle}>{stat.title}</Text>
      <Text style={styles.statValue}>{stat.value}</Text>
      <Text style={styles.statSubtext}>{stat.subtext}</Text>
    </View>
  );

  const renderActivityItem = (activity: ActivityItem) => (
    <View key={activity.id} style={styles.activityItem}>
      <View style={[styles.activityIconContainer, { backgroundColor: `${activity.iconColor}15` }]}>
        <Ionicons name={activity.icon} size={20} color={activity.iconColor} />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{activity.title}</Text>
        <Text style={styles.activityDescription}>{activity.description}</Text>
        <Text style={styles.activityTime}>{activity.time}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#ddd" />
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#e27a14" />
        }
      >
        <Text style={styles.subheading}>Track your sales performance</Text>

        {/* Time Period Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.periodContainer}
        >
          {TIME_PERIODS.map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodChip,
                selectedPeriod === period && styles.periodChipActive,
              ]}
              onPress={() => setSelectedPeriod(period)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.periodChipText,
                  selectedPeriod === period && styles.periodChipTextActive,
                ]}
              >
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map(renderStatCard)}
        </View>

        {/* Performance Overview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Performance Overview</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.viewAllText}>View Details</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.performanceCard}>
            <View style={styles.performanceRow}>
              <View style={styles.performanceItem}>
                <Text style={styles.performanceLabel}>Orders This Month</Text>
                <Text style={styles.performanceValue}>24</Text>
              </View>
              <View style={styles.performanceDivider} />
              <View style={styles.performanceItem}>
                <Text style={styles.performanceLabel}>Conversion Rate</Text>
                <Text style={styles.performanceValue}>68%</Text>
              </View>
            </View>
            <View style={styles.performanceRow}>
              <View style={styles.performanceItem}>
                <Text style={styles.performanceLabel}>Avg. Order Value</Text>
                <Text style={styles.performanceValue}>₦518.75</Text>
              </View>
              <View style={styles.performanceDivider} />
              <View style={styles.performanceItem}>
                <Text style={styles.performanceLabel}>Total Views</Text>
                <Text style={styles.performanceValue}>1,234</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Rating Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rating Breakdown</Text>
          <View style={styles.ratingCard}>
            <View style={styles.ratingHeader}>
              <View style={styles.ratingStars}>
                <Ionicons name="star" size={24} color="#ffc107" />
                <Text style={styles.ratingValue}>4.8</Text>
              </View>
              <Text style={styles.ratingCount}>Based on 47 reviews</Text>
            </View>
            {[5, 4, 3, 2, 1].map((star) => (
              <View key={star} style={styles.ratingRow}>
                <View style={styles.ratingLabel}>
                  <Text style={styles.ratingLabelText}>{star}</Text>
                  <Ionicons name="star" size={14} color="#ffc107" />
                </View>
                <View style={styles.ratingBarContainer}>
                  <View style={[styles.ratingBar, { width: `${star === 5 ? 85 : star === 4 ? 10 : star === 3 ? 3 : star === 2 ? 1 : 1}%` }]} />
                </View>
                <Text style={styles.ratingPercentage}>
                  {star === 5 ? '85%' : star === 4 ? '10%' : star === 3 ? '3%' : star === 2 ? '1%' : '1%'}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.activityContainer}>
            {activities.map(renderActivityItem)}
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  subheading: {
    fontSize: 16,
    paddingHorizontal: 20,
    paddingTop: 5,
    color: '#666',
    fontWeight: '500',
  },
  periodContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
  },
  periodChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 8,
  },
  periodChipActive: {
    backgroundColor: '#e27a14',
    borderColor: '#e27a14',
  },
  periodChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  periodChipTextActive: {
    color: '#fff',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
    marginTop: 8,
  },
  statCard: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  statCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 2,
  },
  trendPositive: {
    backgroundColor: '#f1f8f4',
  },
  trendNegative: {
    backgroundColor: '#ffebee',
  },
  trendText: {
    fontSize: 11,
    fontWeight: '700',
  },
  trendTextPositive: {
    color: '#4caf50',
  },
  trendTextNegative: {
    color: '#f44336',
  },
  statTitle: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  statSubtext: {
    fontSize: 11,
    color: '#999',
  },
  section: {
    marginTop: 12,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  viewAllText: {
    fontSize: 14,
    color: '#e27a14',
    fontWeight: '600',
  },
  performanceCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  performanceRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  performanceItem: {
    flex: 1,
  },
  performanceDivider: {
    width: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 16,
  },
  performanceLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  performanceValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  ratingCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  ratingHeader: {
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  ratingStars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  ratingValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
  },
  ratingCount: {
    fontSize: 13,
    color: '#666',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  ratingLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 40,
    gap: 4,
  },
  ratingLabelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    width: 16,
  },
  ratingBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  ratingBar: {
    height: '100%',
    backgroundColor: '#ffc107',
    borderRadius: 4,
  },
  ratingPercentage: {
    fontSize: 12,
    color: '#666',
    width: 35,
    textAlign: 'right',
  },
  activityContainer: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 11,
    color: '#999',
  },
});
