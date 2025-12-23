import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { BuyerStackParamList } from '../types';
import { useAuthStore } from '../stores/authStore';
import { useAlert, alertHelpers } from '../contexts/AlertContext';
import Button from '../components/Button';

type RateSellerScreenNavigationProp = NativeStackNavigationProp<BuyerStackParamList, 'RateSeller'>;
type RateSellerScreenRouteProp = RouteProp<BuyerStackParamList, 'RateSeller'>;

interface RateSellerScreenProps {
  navigation: RateSellerScreenNavigationProp;
  route: RateSellerScreenRouteProp;
}

const RATING_CATEGORIES = [
  { id: 'quality', label: 'Product Quality', icon: 'checkmark-circle-outline' as const },
  { id: 'communication', label: 'Communication', icon: 'chatbubble-outline' as const },
  { id: 'delivery', label: 'Delivery Speed', icon: 'rocket-outline' as const },
  { id: 'professionalism', label: 'Professionalism', icon: 'business-outline' as const },
];

export default function RateSellerScreen({ route, navigation }: RateSellerScreenProps): React.ReactElement {
  const { sellerName, sellerId } = route.params;
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);
  const { showAlert } = useAlert();

  const [overallRating, setOverallRating] = useState<number>(0);
  const [categoryRatings, setCategoryRatings] = useState<{ [key: string]: number }>({
    quality: 0,
    communication: 0,
    delivery: 0,
    professionalism: 0,
  });
  const [review, setReview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleOverallRatingPress = (rating: number): void => {
    setOverallRating(rating);
  };

  const handleCategoryRatingPress = (categoryId: string, rating: number): void => {
    setCategoryRatings((prev) => ({
      ...prev,
      [categoryId]: rating,
    }));
  };

  const handleSubmitRating = async (): Promise<void> => {
    if (overallRating === 0) {
      showAlert(alertHelpers.warning(
        'Rating Required',
        'Please provide an overall rating for the seller.'
      ));
      return;
    }

    if (review.trim().length < 10) {
      showAlert(alertHelpers.warning(
        'Review Too Short',
        'Please write at least 10 characters about your experience.'
      ));
      return;
    }

    setIsSubmitting(true);

    // Simulate API call - replace with actual API call in production
    setTimeout(() => {
      setIsSubmitting(false);
      
      showAlert(alertHelpers.success(
        'Rating Submitted!',
        `Thank you for rating ${sellerName}. Your feedback helps improve the community.`
      ));

      // Navigate back after successful submission
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    }, 1000);
  };

  const renderStars = (
    currentRating: number,
    onPress: (rating: number) => void,
    size: number = 40,
    disabled: boolean = false
  ) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => !disabled && onPress(star)}
            activeOpacity={0.7}
            disabled={disabled}
          >
            <Ionicons
              name={star <= currentRating ? 'star' : 'star-outline'}
              size={size}
              color={star <= currentRating ? '#FFD700' : '#ddd'}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderCategoryRating = (category: typeof RATING_CATEGORIES[0]) => {
    return (
      <View key={category.id} style={styles.categoryCard}>
        <View style={styles.categoryHeader}>
          <Ionicons name={category.icon} size={24} color="#e27a14" />
          <Text style={styles.categoryLabel}>{category.label}</Text>
        </View>
        {renderStars(
          categoryRatings[category.id],
          (rating) => handleCategoryRatingPress(category.id, rating),
          32
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Rate Seller</Text>
          <Text style={styles.headerSubtitle}>{sellerName}</Text>
        </View>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Overall Rating Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="star" size={24} color="#e27a14" />
            <Text style={styles.sectionTitle}>Overall Rating</Text>
          </View>
          <Text style={styles.sectionDescription}>
            How would you rate your overall experience with this seller?
          </Text>
          <View style={styles.overallRatingContainer}>
            {renderStars(overallRating, handleOverallRatingPress, 48)}
          </View>
          {overallRating > 0 && (
            <Text style={styles.ratingText}>
              {overallRating === 5 && '⭐ Excellent!'}
              {overallRating === 4 && '😊 Very Good'}
              {overallRating === 3 && '👍 Good'}
              {overallRating === 2 && '😐 Fair'}
              {overallRating === 1 && '😞 Poor'}
            </Text>
          )}
        </View>

        {/* Category Ratings Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="analytics-outline" size={24} color="#e27a14" />
            <Text style={styles.sectionTitle}>Detailed Ratings</Text>
          </View>
          <Text style={styles.sectionDescription}>
            Rate specific aspects of your experience (optional)
          </Text>
          <View style={styles.categoriesContainer}>
            {RATING_CATEGORIES.map(renderCategoryRating)}
          </View>
        </View>

        {/* Review Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="create-outline" size={24} color="#e27a14" />
            <Text style={styles.sectionTitle}>Your Review</Text>
          </View>
          <Text style={styles.sectionDescription}>
            Share your experience with this seller (minimum 10 characters)
          </Text>
          <TextInput
            style={styles.reviewInput}
            placeholder="Tell others about your experience with this seller..."
            placeholderTextColor="#999"
            value={review}
            onChangeText={setReview}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            maxLength={500}
          />
          <Text style={styles.characterCount}>{review.length}/500 characters</Text>
        </View>

        {/* Tips Section */}
        <View style={styles.tipsContainer}>
          <View style={styles.tipCard}>
            <Ionicons name="information-circle-outline" size={20} color="#3b82f6" />
            <Text style={styles.tipText}>
              Your honest feedback helps other buyers make informed decisions
            </Text>
          </View>
          <View style={styles.tipCard}>
            <Ionicons name="shield-checkmark-outline" size={20} color="#10b981" />
            <Text style={styles.tipText}>
              Reviews are anonymous to sellers but visible to other buyers
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Button
          title={isSubmitting ? 'Submitting Rating...' : 'Submit Rating'}
          onPress={handleSubmitRating}
          variant="primary"
          size="large"
          fullWidth
          loading={isSubmitting}
          disabled={isSubmitting}
          icon="checkmark-circle"
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginLeft: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  overallRatingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e27a14',
    marginTop: 16,
    textAlign: 'center',
  },
  categoriesContainer: {
    gap: 12,
  },
  categoryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  reviewInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: '#333',
    minHeight: 140,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  characterCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 8,
  },
  tipsContainer: {
    gap: 12,
    marginTop: 8,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
  },
  tipText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 12,
    flex: 1,
    lineHeight: 18,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
});

