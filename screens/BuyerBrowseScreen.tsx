import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  RefreshControl,
  ScrollView,
  Platform,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BuyerStackParamList, Listing } from '../types';

type BuyerBrowseScreenNavigationProp = NativeStackNavigationProp<BuyerStackParamList, 'BrowseHome'>;

interface BuyerBrowseScreenProps {
  navigation: BuyerBrowseScreenNavigationProp;
}

const MOCK_LISTINGS: Listing[] = [
  {
    id: '1',
    title: 'Premium Red Palm Oil - 25L',
    pricePerUnit: 80,
    unit: '25L keg',
    location: 'Lagos, Nigeria',
    seller: 'Golden Farms Ltd',
    sellerId: 'seller1',
    quantityAvailable: '200 kegs',
    rating: 4.8,
    reviewCount: 47,
    image: 'https://i.pinimg.com/736x/93/32/27/933227c8c3df6e2ce5c0e2dc4ce84d54.jpg',
    images: [
      'https://i.pinimg.com/736x/93/32/27/933227c8c3df6e2ce5c0e2dc4ce84d54.jpg',
      'https://i.pinimg.com/736x/51/56/e4/5156e40088dee0ef3088304e8faf3fab.jpg',
      'https://i.pinimg.com/736x/dd/cd/eb/ddcdebb8c68f74a3c10f10d73fe68e6d.jpg',
      'https://i.pinimg.com/736x/41/df/d3/41dfd3aef6e4b3a5ad47a73d85b9ed05.jpg',
    ],
  },
  {
    id: '2',
    title: 'Village-processed Palm Oil - 5L',
    pricePerUnit: 20,
    unit: '5L gallon',
    location: 'Benin City, Nigeria',
    seller: 'Mama Grace',
    sellerId: 'seller2',
    quantityAvailable: '150 gallons',
    rating: 4.6,
    reviewCount: 32,
    image: 'https://i.pinimg.com/736x/51/56/e4/5156e40088dee0ef3088304e8faf3fab.jpg',
    images: [
      'https://i.pinimg.com/736x/51/56/e4/5156e40088dee0ef3088304e8faf3fab.jpg',
      'https://i.pinimg.com/736x/dd/cd/eb/ddcdebb8c68f74a3c10f10d73fe68e6d.jpg',
      'https://i.pinimg.com/736x/93/32/27/933227c8c3df6e2ce5c0e2dc4ce84d54.jpg',
    ],
  },
  {
    id: '3',
    title: 'Bulk Palm Oil - 200L drums',
    pricePerUnit: 500,
    unit: '200L drum',
    location: 'Port Harcourt, Nigeria',
    seller: 'Niger Delta Oils',
    sellerId: 'seller3',
    quantityAvailable: '40 drums',
    rating: 4.9,
    reviewCount: 56,
    image: 'https://i.pinimg.com/736x/dd/cd/eb/ddcdebb8c68f74a3c10f10d73fe68e6d.jpg',
    images: [
      'https://i.pinimg.com/736x/dd/cd/eb/ddcdebb8c68f74a3c10f10d73fe68e6d.jpg',
      'https://i.pinimg.com/736x/41/df/d3/41dfd3aef6e4b3a5ad47a73d85b9ed05.jpg',
      'https://i.pinimg.com/736x/93/32/27/933227c8c3df6e2ce5c0e2dc4ce84d54.jpg',
    ],
  },
  {
    id: '4',
    title: 'Organic Palm Oil - 10L',
    pricePerUnit: 35,
    unit: '10L container',
    location: 'Ibadan, Nigeria',
    seller: 'Green Valley Farms',
    sellerId: 'seller4',
    quantityAvailable: '80 containers',
    rating: 4.7,
    reviewCount: 41,
    image: 'https://i.pinimg.com/736x/41/df/d3/41dfd3aef6e4b3a5ad47a73d85b9ed05.jpg',
    images: [
      'https://i.pinimg.com/736x/41/df/d3/41dfd3aef6e4b3a5ad47a73d85b9ed05.jpg',
      'https://i.pinimg.com/736x/51/56/e4/5156e40088dee0ef3088304e8faf3fab.jpg',
      'https://i.pinimg.com/736x/dd/cd/eb/ddcdebb8c68f74a3c10f10d73fe68e6d.jpg',
    ],
  },
  {
    id: '5',
    title: 'Refined Palm Oil - 50L',
    pricePerUnit: 150,
    unit: '50L drum',
    location: 'Abuja, Nigeria',
    seller: 'Premium Oils Co',
    sellerId: 'seller5',
    quantityAvailable: '60 drums',
    rating: 4.5,
    reviewCount: 28,
    image: 'https://i.pinimg.com/736x/8e/35/12/8e3512a4c3e3b2b3e7c8ab95d8e8ec3a.jpg',
    images: [
      'https://i.pinimg.com/736x/8e/35/12/8e3512a4c3e3b2b3e7c8ab95d8e8ec3a.jpg',
      'https://i.pinimg.com/736x/93/32/27/933227c8c3df6e2ce5c0e2dc4ce84d54.jpg',
      'https://i.pinimg.com/736x/51/56/e4/5156e40088dee0ef3088304e8faf3fab.jpg',
    ],
  },
  {
    id: '6',
    title: 'Cold-pressed Palm Oil - 15L',
    pricePerUnit: 55,
    unit: '15L container',
    location: 'Kano, Nigeria',
    seller: 'Natural Harvest',
    sellerId: 'seller6',
    quantityAvailable: '100 containers',
    rating: 4.8,
    reviewCount: 39,
    image: 'https://i.pinimg.com/736x/b5/8f/1e/b58f1e23d3e5a5ab75f8e0f3bc1e5c9a.jpg',
    images: [
      'https://i.pinimg.com/736x/b5/8f/1e/b58f1e23d3e5a5ab75f8e0f3bc1e5c9a.jpg',
      'https://i.pinimg.com/736x/41/df/d3/41dfd3aef6e4b3a5ad47a73d85b9ed05.jpg',
      'https://i.pinimg.com/736x/dd/cd/eb/ddcdebb8c68f74a3c10f10d73fe68e6d.jpg',
      'https://i.pinimg.com/736x/93/32/27/933227c8c3df6e2ce5c0e2dc4ce84d54.jpg',
    ],
  },
];

const FILTER_CATEGORIES: Array<{
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}> = [
  { id: 'all', label: 'All', icon: 'grid-outline' },
  { id: 'small', label: 'Small', icon: 'cube-outline' },
  { id: 'medium', label: 'Medium', icon: 'layers-outline' },
  { id: 'large', label: 'Large', icon: 'archive-outline' },
];

export default function BuyerBrowseScreen({ navigation }: BuyerBrowseScreenProps): React.ReactElement {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [listings] = useState<Listing[]>(MOCK_LISTINGS);

  const onRefresh = (): void => {
    setRefreshing(true);
    // Simulate API call - replace with actual API call in production
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const filteredListings = listings.filter((listing) => {
    const matchesSearch =
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedFilter === 'all') return matchesSearch;

    const unit = listing.unit.toLowerCase();
    if (selectedFilter === 'small') {
      return matchesSearch && (unit.includes('5l') || unit.includes('10l'));
    }
    if (selectedFilter === 'medium') {
      return matchesSearch && (unit.includes('15l') || unit.includes('20l') || unit.includes('25l'));
    }
    if (selectedFilter === 'large') {
      return matchesSearch && (unit.includes('50l') || unit.includes('200l'));
    }

    return matchesSearch;
  });

  const getActiveIcon = (icon: keyof typeof Ionicons.glyphMap): keyof typeof Ionicons.glyphMap => {
    const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
      'grid-outline': 'grid',
      'cube-outline': 'cube',
      'layers-outline': 'layers',
      'archive-outline': 'archive',
    };
    return iconMap[icon] || icon;
  };

  const renderFilterChip = (
    filter: { id: string; label: string; icon: keyof typeof Ionicons.glyphMap },
    index: number
  ) => {
    const isSelected = selectedFilter === filter.id;
    return (
      <TouchableOpacity
        key={filter.id}
        style={[styles.filterChip, isSelected && styles.filterChipActive]}
        onPress={() => setSelectedFilter(filter.id)}
        activeOpacity={0.7}
      >
        <Ionicons
          name={isSelected ? getActiveIcon(filter.icon) : filter.icon}
          size={16}
          color={isSelected ? '#fff' : '#666'}
          style={styles.filterIcon}
        />
        <Text style={[styles.filterText, isSelected && styles.filterTextActive]}>{filter.label}</Text>
      </TouchableOpacity>
    );
  };

  const renderListingCard = ({ item }: { item: Listing }) => {
    const unit = item.unit.toLowerCase();
    let sizeIcon: keyof typeof Ionicons.glyphMap;
    if (unit.includes('5l') || unit.includes('10l')) {
      sizeIcon = 'cube-outline';
    } else if (unit.includes('15l') || unit.includes('20l') || unit.includes('25l')) {
      sizeIcon = 'layers-outline';
    } else if (unit.includes('50l') || unit.includes('200l')) {
      sizeIcon = 'archive-outline';
    } else {
      sizeIcon = 'cube-outline';
    }

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('ListingDetails', { listing: item })}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          {item.image ? (
            <View style={styles.cardImageContainer}>
              <Image
                source={typeof item.image === 'number' ? item.image : { uri: item.image }}
                style={styles.cardImage}
                resizeMode="cover"
              />
            </View>
          ) : (
            <View style={styles.cardIconContainer}>
              <Ionicons name={sizeIcon} size={24} color="#e27a14" />
            </View>
          )}
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>₦{item.pricePerUnit}</Text>
              <Text style={styles.priceUnit}> / {item.unit}</Text>
            </View>
          </View>
        </View>

        <View style={styles.cardDivider} />

        <View style={styles.cardFooter}>
          <View style={styles.cardInfo}>
            <Ionicons name="location-outline" size={14} color="#666" />
            <Text style={styles.cardInfoText} numberOfLines={1}>
              {item.location}
            </Text>
          </View>
          <View style={styles.cardInfo}>
            <Ionicons name="storefront-outline" size={14} color="#666" />
            <Text style={styles.cardInfoText} numberOfLines={1}>
              {item.seller}
            </Text>
          </View>
          <View style={styles.cardInfo}>
            <Ionicons name="cube-outline" size={14} color="#666" />
            <Text style={styles.cardInfoText}>{item.quantityAvailable}</Text>
          </View>
        </View>

        <View style={styles.cardActions}>
          {item.rating && (
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>{item.rating}</Text>
              <Text style={styles.reviewCountText}>({item.reviewCount} reviews)</Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.rateSellerButton}
            onPress={(e) => {
              e.stopPropagation();
              navigation.navigate('RateSeller', {
                sellerName: item.seller,
                sellerId: item.sellerId,
              });
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="star-outline" size={16} color="#e27a14" />
            <Text style={styles.rateSellerText}>Rate Seller</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Welcome back!</Text>
            <Text style={styles.heading}>Browse Palm Oil</Text>
          </View>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => navigation.navigate('Notifications')}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={24} color="#333" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search listings, sellers, locations..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            onSubmitEditing={() => {
              // Keyboard submission handled automatically via filteredListings
            }}
            clearButtonMode="never"
            autoCorrect={false}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
              activeOpacity={0.7}
            >
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          {FILTER_CATEGORIES.map((filter, index) => renderFilterChip(filter, index))}
        </ScrollView>
      </View>

      {/* Listings */}
      <FlatList
        data={filteredListings}
        keyExtractor={(item) => item.id}
        renderItem={renderListingCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#e27a14" />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={64} color="#ddd" />
            <Text style={styles.emptyText}>No listings found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: -0.5,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff4444',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    padding: 0,
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
  filtersContainer: {
    paddingRight: 20,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  filterChipActive: {
    backgroundColor: '#e27a14',
    borderColor: '#e27a14',
  },
  filterIcon: {
    marginRight: 6,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  filterTextActive: {
    color: '#fff',
  },
  listContent: {
    padding: 20,
    paddingBottom: 100, // Space for tab bar
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#fff5eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: '#f5f5f5',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
    lineHeight: 22,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#e27a14',
  },
  priceUnit: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: '30%',
  },
  cardInfoText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
    flex: 1,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  reviewCountText: {
    fontSize: 12,
    color: '#666',
  },
  rateSellerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#fff5eb',
    borderWidth: 1,
    borderColor: '#e27a14',
  },
  rateSellerText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#e27a14',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bbb',
    textAlign: 'center',
  },
});
