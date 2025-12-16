import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SellerStackParamList, Listing } from '../types';

type MyListingsScreenNavigationProp = NativeStackNavigationProp<SellerStackParamList, 'MyListings'>;

interface MyListingsScreenProps {
  navigation: MyListingsScreenNavigationProp;
}

const MOCK_MY_LISTINGS: Listing[] = [
  {
    id: 'm1',
    title: 'Organic village palm oil - 20L',
    pricePerUnit: 65,
    unit: '20L keg',
    location: 'Abeokuta, Nigeria',
    seller: 'Demo Trader',
    quantityAvailable: '50 kegs',
  },
];

export default function MyListingsScreen({ navigation }: MyListingsScreenProps): React.ReactElement {
  const insets = useSafeAreaInsets();
  const [listings, setListings] = useState<Listing[]>(MOCK_MY_LISTINGS);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const onRefresh = (): void => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const renderItem = ({ item }: { item: Listing }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ListingDetails', { listing: item })}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Active</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => {
            // Handle more options
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <Text style={styles.cardTitle} numberOfLines={2}>
        {item.title}
      </Text>

      <View style={styles.priceContainer}>
        <Text style={styles.price}>${item.pricePerUnit}</Text>
        <Text style={styles.priceUnit}>/{item.unit}</Text>
      </View>

      <View style={styles.cardMeta}>
        <View style={styles.metaItem}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.metaText} numberOfLines={1}>
            {item.location}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="cube-outline" size={16} color="#666" />
          <Text style={styles.metaText}>{item.quantityAvailable}</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="eye-outline" size={14} color="#999" />
            <Text style={styles.statText}>24 views</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="heart-outline" size={14} color="#999" />
            <Text style={styles.statText}>5 saves</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            // Handle edit
          }}
        >
          <Ionicons name="create-outline" size={16} color="#e27a14" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="list-outline" size={64} color="#ddd" />
      </View>
      <Text style={styles.emptyTitle}>No Listings Yet</Text>
      <Text style={styles.emptyDescription}>
        Start selling by creating your first palm oil listing
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => navigation.navigate('CreateListing')}
        activeOpacity={0.8}
      >
        <Ionicons name="add-circle" size={20} color="#fff" />
        <Text style={styles.emptyButtonText}>Create Your First Listing</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.heading}>My Listings</Text>
            <Text style={styles.subheading}>
              {listings.length} {listings.length === 1 ? 'listing' : 'listings'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('CreateListing')}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={24} color="#fff" />
            <Text style={styles.addButtonText}>New</Text>
          </TouchableOpacity>
        </View>
      </View>

      {listings.length === 0 ? (
        <View style={styles.emptyWrapper}>{renderEmptyState()}</View>
      ) : (
        <FlatList
          data={listings}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#e27a14"
              colors={['#e27a14']}
            />
          }
          ListFooterComponent={<View style={styles.footer} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  subheading: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e27a14',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#e27a14',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4caf50',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4caf50',
  },
  moreButton: {
    padding: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    lineHeight: 24,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: '#e27a14',
  },
  priceUnit: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
    fontWeight: '500',
  },
  cardMeta: {
    gap: 10,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fff5eb',
  },
  emptyWrapper: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e27a14',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#e27a14',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    height: 20,
  },
});
