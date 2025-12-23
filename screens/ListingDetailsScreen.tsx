import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  Share,
  FlatList,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { BuyerStackParamList, SellerStackParamList } from '../types';
import { useAuthStore } from '../stores/authStore';
import { useFavoritesStore } from '../stores/favoritesStore';
import { useAlert, alertHelpers } from '../contexts/AlertContext';
import Button from '../components/Button';

type ListingDetailsScreenNavigationProp =
  | NativeStackNavigationProp<BuyerStackParamList, 'ListingDetails'>
  | NativeStackNavigationProp<SellerStackParamList, 'ListingDetails'>;

type ListingDetailsScreenRouteProp =
  | RouteProp<BuyerStackParamList, 'ListingDetails'>
  | RouteProp<SellerStackParamList, 'ListingDetails'>;

interface ListingDetailsScreenProps {
  navigation: ListingDetailsScreenNavigationProp;
  route: ListingDetailsScreenRouteProp;
}

export default function ListingDetailsScreen({ route, navigation }: ListingDetailsScreenProps): React.ReactElement {
  const { listing } = route.params;
  const user = useAuthStore((state) => state.user);
  const insets = useSafeAreaInsets();
  const { showAlert } = useAlert();
  const isBuyer = user?.role === 'buyer';
  const [quantity, setQuantity] = useState<number>(1);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const flatListRef = useRef<FlatList>(null);
  const screenWidth = Dimensions.get('window').width;
  
  const addFavorite = useFavoritesStore((state) => state.addFavorite);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);
  const isFavorite = useFavoritesStore((state) => state.isFavorite);
  const [isListingFavorite, setIsListingFavorite] = useState(isFavorite(listing.id));

  const getAllImages = (): (string | number)[] => {
    if (listing.images && listing.images.length > 0) {
      return listing.images;
    }
    if (listing.image) {
      return [listing.image];
    }
    return [];
  };

  const images = getAllImages();

  // Default images from local assets when listing has no images
  const defaultImages = [
    require('../assets/images/oil1.jpg'),
    require('../assets/images/palm2.jpg'),
    require('../assets/images/palm3.jpg'),
    require('../assets/images/palm4.jpg'),
  ];

  const displayImages = images.length > 0 ? images : defaultImages;

  const handleContactSeller = (): void => {
    if (isBuyer) {
      (navigation as unknown as NativeStackNavigationProp<BuyerStackParamList, 'SellerContact'>).navigate('SellerContact', {
        sellerName: listing.seller,
      });
    }
  };

  const handleViewProfile = (): void => {
    if (isBuyer) {
      (navigation as unknown as NativeStackNavigationProp<BuyerStackParamList, 'SellerContact'>).navigate('SellerContact', {
        sellerName: listing.seller,
        sellerId: listing.sellerId,
      });
    }
  };

  const handleRateSeller = (): void => {
    if (isBuyer) {
      (navigation as unknown as NativeStackNavigationProp<BuyerStackParamList, 'RateSeller'>).navigate('RateSeller', {
        sellerName: listing.seller,
        sellerId: listing.sellerId,
      });
    }
  };

  const handlePlaceOrder = (): void => {
    if (isBuyer) {
      (navigation as unknown as NativeStackNavigationProp<BuyerStackParamList, 'PlaceOrder'>).navigate('PlaceOrder', {
        listing,
        quantity,
      });
    }
  };

  const handleToggleFavorite = (): void => {
    if (isListingFavorite) {
      removeFavorite(listing.id);
      setIsListingFavorite(false);
      showAlert(alertHelpers.info('Removed', 'Listing removed from favorites'));
    } else {
      addFavorite(listing);
      setIsListingFavorite(true);
      showAlert(alertHelpers.success('Added', 'Listing added to favorites'));
    }
  };

  const handleShare = async (): Promise<void> => {
    try {
      await Share.share({
        message: `Check out this palm oil listing: ${listing.title} - ₦${listing.pricePerUnit}/${listing.unit}`,
        title: listing.title,
      });
    } catch (error) {
      // Share was cancelled or an error occurred
    }
  };

  const handleEdit = (): void => {
    // TODO: Implement edit listing functionality
    showAlert(alertHelpers.info('Edit Listing', 'Edit functionality will be implemented here.'));
  };

  const incrementQuantity = (): void => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = (): void => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const unit = listing.unit.toLowerCase();
  let sizeIcon: keyof typeof Ionicons.glyphMap = 'cube-outline';
  if (unit.includes('5l') || unit.includes('10l')) {
    sizeIcon = 'cube-outline';
  } else if (unit.includes('15l') || unit.includes('20l') || unit.includes('25l')) {
    sizeIcon = 'layers-outline';
  } else if (unit.includes('50l') || unit.includes('200l')) {
    sizeIcon = 'archive-outline';
  }

  const totalPrice = listing.pricePerUnit * quantity;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Image Gallery Section */}
        <View style={styles.imageContainer}>
          {displayImages.length > 0 ? (
            <>
              <FlatList
                ref={flatListRef}
                data={displayImages}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => `image-${index}`}
                onMomentumScrollEnd={(event) => {
                  const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
                  setCurrentImageIndex(index);
                }}
                renderItem={({ item }) => {
                  const imageSource = typeof item === 'number' 
                    ? item 
                    : { uri: String(item) };
                  return (
                    <Image
                      source={imageSource}
                      style={styles.productImage}
                      resizeMode="cover"
                    />
                  );
                }}
              />
              {displayImages.length > 1 && (
                <View style={styles.imageIndicators}>
                  {displayImages.map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.indicator,
                        index === currentImageIndex && styles.indicatorActive,
                      ]}
                    />
                  ))}
                </View>
              )}
              {displayImages.length > 1 && (
                <View style={styles.imageCounter}>
                  <Text style={styles.imageCounterText}>
                    {currentImageIndex + 1} / {displayImages.length}
                  </Text>
                </View>
              )}
            </>
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name={sizeIcon} size={64} color="#e27a14" />
              <Text style={styles.imagePlaceholderText}>Palm Oil</Text>
            </View>
          )}
          <View style={styles.actionButtons}>
            {isBuyer && (
              <TouchableOpacity style={styles.favoriteButton} onPress={handleToggleFavorite} activeOpacity={0.7}>
                <Ionicons name={isListingFavorite ? 'heart' : 'heart-outline'} size={20} color={isListingFavorite ? '#e27a14' : '#333'} />
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.shareButton} onPress={handleShare} activeOpacity={0.7}>
              <Ionicons name="share-outline" size={20} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.headerTop}>
            <View style={styles.badge}>
              <Ionicons name="checkmark-circle" size={14} color="#4caf50" />
              <Text style={styles.badgeText}>Verified Seller</Text>
            </View>
            <View style={styles.availabilityBadge}>
              <View style={styles.availabilityDot} />
              <Text style={styles.availabilityText}>In Stock</Text>
            </View>
          </View>
          <Text style={styles.title}>{listing.title}</Text>
          <View style={styles.priceRow}>
            <View>
              <Text style={styles.price}>₦{listing.pricePerUnit}</Text>
              <Text style={styles.priceUnit}>per {listing.unit}</Text>
            </View>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#ffc107" />
              <Text style={styles.rating}>4.8</Text>
              <Text style={styles.ratingCount}>(47)</Text>
            </View>
          </View>
        </View>

        {/* Quantity Selector (Buyers only) */}
        {isBuyer && (
          <View style={styles.quantitySection}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.quantitySelector}>
              <TouchableOpacity
                style={[styles.quantityButton, quantity === 1 && styles.quantityButtonDisabled]}
                onPress={decrementQuantity}
                disabled={quantity === 1}
                activeOpacity={0.7}
              >
                <Ionicons name="remove" size={20} color={quantity === 1 ? '#ccc' : '#333'} />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity style={styles.quantityButton} onPress={incrementQuantity} activeOpacity={0.7}>
                <Ionicons name="add" size={20} color="#333" />
              </TouchableOpacity>
            </View>
            <View style={styles.totalPriceContainer}>
              <Text style={styles.totalPriceLabel}>Total:</Text>
              <Text style={styles.totalPrice}>₦{totalPrice.toFixed(2)}</Text>
            </View>
          </View>
        )}

        {/* Information Cards */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <View style={styles.infoCardHeader}>
              <Ionicons name="location" size={20} color="#e27a14" />
              <Text style={styles.infoCardTitle}>Location</Text>
            </View>
            <Text style={styles.infoCardValue}>{listing.location}</Text>
          </View>

          {isBuyer && (
            <View style={styles.infoCard}>
              <View style={styles.infoCardHeader}>
                <Ionicons name="storefront" size={20} color="#e27a14" />
                <Text style={styles.infoCardTitle}>Seller</Text>
              </View>
              <Text style={styles.infoCardValue}>{listing.seller}</Text>
              <View style={styles.sellerActions}>
                <TouchableOpacity style={styles.rateSellerButtonCompact} onPress={handleRateSeller} activeOpacity={0.7}>
                  <Ionicons name="star-outline" size={16} color="#e27a14" />
                  <Text style={styles.rateSellerTextCompact}>Rate Seller</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.viewProfileButton} onPress={handleViewProfile} activeOpacity={0.7}>
                  <Text style={styles.viewProfileText}>View Profile</Text>
                  <Ionicons name="chevron-forward" size={16} color="#e27a14" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.infoCard}>
            <View style={styles.infoCardHeader}>
              <Ionicons name="cube" size={20} color="#e27a14" />
              <Text style={styles.infoCardTitle}>Availability</Text>
            </View>
            <Text style={styles.infoCardValue}>{listing.quantityAvailable}</Text>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoCardHeader}>
              <Ionicons name="information-circle" size={20} color="#e27a14" />
              <Text style={styles.infoCardTitle}>Unit Size</Text>
            </View>
            <Text style={styles.infoCardValue}>{listing.unit}</Text>
          </View>
        </View>

        {/* Description Section */}
        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>
            Premium quality palm oil sourced directly from trusted farms. This product is carefully processed to
            maintain its natural properties and nutritional value. Perfect for cooking, baking, and various
            culinary applications.
          </Text>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          {['100% Natural', 'Premium Quality', 'Direct from Farm', 'Fast Delivery'].map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={18} color="#4caf50" />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={[styles.actionBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          {isBuyer ? (
            <>
              <Button
                title="Contact"
                onPress={handleContactSeller}
                variant="secondary"
                size="medium"
                icon="chatbubble-outline"
                iconPosition="left"
                style={styles.secondaryButton}
              />
              <Button
                title="Place Order"
                onPress={handlePlaceOrder}
                variant="primary"
                size="medium"
                icon="arrow-forward"
                iconPosition="right"
                style={styles.primaryButton}
              />
            </>
          ) : (
            <Button
              title="Edit Listing"
              onPress={handleEdit}
              variant="primary"
              size="medium"
              icon="create-outline"
              iconPosition="left"
              fullWidth
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    paddingBottom: 20,
    paddingHorizontal: 0,
  },
  imageContainer: {
    position: 'relative',
    height: 280,
    backgroundColor: '#fff5eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: Dimensions.get('window').width,
    height: 280,
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  indicatorActive: {
    backgroundColor: '#fff',
    width: 24,
  },
  imageCounter: {
    position: 'absolute',
    top: 16,
    right: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  imageCounterText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    fontSize: 16,
    color: '#e27a14',
    marginTop: 12,
    fontWeight: '600',
  },
  actionButtons: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    gap: 8,
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  headerSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2e7d32',
    marginLeft: 4,
  },
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  availabilityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4caf50',
    marginRight: 6,
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2e7d32',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
    lineHeight: 32,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 32,
    fontWeight: '700',
    color: '#e27a14',
  },
  priceUnit: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbf0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 4,
  },
  ratingCount: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  quantitySection: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  quantityButtonDisabled: {
    opacity: 0.5,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    minWidth: 40,
    textAlign: 'center',
  },
  totalPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  totalPriceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#e27a14',
  },
  infoSection: {
    padding: 20,
    paddingTop: 12,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginLeft: 8,
  },
  infoCardValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginLeft: 28,
  },
  sellerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    marginLeft: 28,
    gap: 12,
  },
  rateSellerButtonCompact: {
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
  rateSellerTextCompact: {
    fontSize: 13,
    fontWeight: '600',
    color: '#e27a14',
  },
  viewProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewProfileText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e27a14',
    marginRight: 4,
  },
  descriptionSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 12,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#666',
  },
  featuresSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 12,
  },
  actionBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
  },
  secondaryButton: {
    flex: 0,
  },
});
