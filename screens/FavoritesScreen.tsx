import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BuyerStackParamList, Listing } from '../types';
import { useFavoritesStore } from '../stores/favoritesStore';

type FavoritesScreenNavigationProp = NativeStackNavigationProp<BuyerStackParamList, 'Favorites'>;

interface FavoritesScreenProps {
  navigation: FavoritesScreenNavigationProp;
}

export default function FavoritesScreen({ navigation }: FavoritesScreenProps): React.ReactElement {
  const insets = useSafeAreaInsets();
  const favorites = useFavoritesStore((state) => state.favorites);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);

  const renderItem = ({ item }: { item: Listing }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ListingDetails', { listing: item })}
      activeOpacity={0.7}
    >
      {item.image && (
        <View style={styles.cardImageContainer}>
          <Image
            source={typeof item.image === 'number' ? item.image : { uri: item.image }}
            style={styles.cardImage}
            resizeMode="cover"
          />
        </View>
      )}
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => removeFavorite(item.id)}
        activeOpacity={0.7}
      >
        <Ionicons name="heart" size={20} color="#e27a14" />
      </TouchableOpacity>

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>₦{item.pricePerUnit}</Text>
          <Text style={styles.priceUnit}>/{item.unit}</Text>
        </View>

        <View style={styles.cardMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={14} color="#666" />
            <Text style={styles.metaText} numberOfLines={1}>
              {item.location}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="storefront-outline" size={14} color="#666" />
            <Text style={styles.metaText} numberOfLines={1}>
              {item.seller}
            </Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#ffc107" />
            <Text style={styles.rating}>{item.rating || 4.5}</Text>
            <Text style={styles.ratingCount}>({item.reviewCount || 0})</Text>
          </View>
          <View style={styles.availabilityBadge}>
            <Text style={styles.availabilityText}>{item.quantityAvailable}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="heart-outline" size={80} color="#ddd" />
      <Text style={styles.emptyTitle}>No Favorites Yet</Text>
      <Text style={styles.emptyText}>
        Start adding your favorite listings to find them easily later
      </Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => navigation.navigate('BrowseHome')}
        activeOpacity={0.7}
      >
        <Text style={styles.browseButtonText}>Browse Listings</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Favorites</Text>
        <Text style={styles.headerSubtitle}>{favorites.length} saved items</Text>
      </View>

      <FlatList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
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
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardImageContainer: {
    width: '100%',
    height: 180,
    backgroundColor: '#f0f0f0',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    padding: 16,
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
    marginBottom: 12,
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
  cardMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  metaText: {
    fontSize: 13,
    color: '#666',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  ratingCount: {
    fontSize: 12,
    color: '#666',
  },
  availabilityBadge: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2e7d32',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#e27a14',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: '#e27a14',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

