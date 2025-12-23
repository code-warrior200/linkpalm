import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { BuyerStackParamList, Review } from '../types';
import { useReviewsStore } from '../stores/reviewsStore';
import { useAuthStore } from '../stores/authStore';
import { useAlert, alertHelpers } from '../contexts/AlertContext';
import Button from '../components/Button';

type ReviewListingScreenNavigationProp = NativeStackNavigationProp<BuyerStackParamList, 'ReviewListing'>;
type ReviewListingScreenRouteProp = RouteProp<BuyerStackParamList, 'ReviewListing'>;

interface ReviewListingScreenProps {
  navigation: ReviewListingScreenNavigationProp;
  route: ReviewListingScreenRouteProp;
}

export default function ReviewListingScreen({ route, navigation }: ReviewListingScreenProps): React.ReactElement {
  const { listing, orderId } = route.params;
  const insets = useSafeAreaInsets();
  const { showAlert } = useAlert();
  const user = useAuthStore((state) => state.user);
  const addReview = useReviewsStore((state) => state.addReview);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      showAlert(alertHelpers.warning('Rating Required', 'Please select a rating before submitting.'));
      return;
    }

    if (!comment.trim()) {
      showAlert(alertHelpers.warning('Comment Required', 'Please write a comment about your experience.'));
      return;
    }

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newReview: Review = {
      id: Date.now().toString(),
      listingId: listing.id,
      sellerId: listing.sellerId,
      buyerId: user?.id || '',
      buyerName: user?.name || 'Anonymous',
      rating,
      comment: comment.trim(),
      date: new Date().toISOString(),
    };

    addReview(newReview);
    setIsSubmitting(false);

    showAlert(alertHelpers.success('Review Submitted!', 'Thank you for your feedback.', () => navigation.goBack()));
  };

  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)} activeOpacity={0.7}>
            <Ionicons
              name={rating >= star ? 'star' : 'star-outline'}
              size={40}
              color={rating >= star ? '#ffc107' : '#ddd'}
              style={styles.starIcon}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const getRatingText = () => {
    switch (rating) {
      case 1:
        return 'Poor';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Very Good';
      case 5:
        return 'Excellent';
      default:
        return 'Tap to rate';
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Write a Review</Text>
          <Text style={styles.headerSubtitle}>Share your experience with this product</Text>
        </View>

        {/* Listing Info */}
        <View style={styles.listingCard}>
          <Text style={styles.listingTitle}>{listing.title}</Text>
          <Text style={styles.sellerName}>
            <Ionicons name="storefront-outline" size={14} color="#666" /> {listing.seller}
          </Text>
        </View>

        {/* Rating */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Rating</Text>
          {renderStars()}
          <Text style={styles.ratingText}>{getRatingText()}</Text>
        </View>

        {/* Comment */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Review</Text>
          <TextInput
            style={styles.commentInput}
            placeholder="Tell others about your experience with this product and seller..."
            placeholderTextColor="#999"
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            maxLength={500}
          />
          <Text style={styles.charCount}>{comment.length}/500 characters</Text>
        </View>

        {/* Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Tips for a helpful review:</Text>
          <Text style={styles.tipText}>• Describe the product quality and condition</Text>
          <Text style={styles.tipText}>• Share your experience with the seller</Text>
          <Text style={styles.tipText}>• Mention delivery time and packaging</Text>
          <Text style={styles.tipText}>• Be honest and constructive</Text>
        </View>
      </ScrollView>

      {/* Action Bar */}
      <View style={[styles.actionBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Button
          title="Submit Review"
          onPress={handleSubmit}
          variant="primary"
          size="medium"
          loading={isSubmitting}
          disabled={rating === 0 || !comment.trim()}
          icon="checkmark-circle"
          iconPosition="left"
          fullWidth
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  listingCard: {
    backgroundColor: '#fff',
    marginTop: 12,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  listingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  sellerName: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  starIcon: {
    marginHorizontal: 4,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e27a14',
    textAlign: 'center',
  },
  commentInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    height: 150,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 8,
  },
  tipsCard: {
    backgroundColor: '#fff5eb',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e27a14',
  },
  tipsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#d66a00',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 13,
    color: '#d66a00',
    lineHeight: 20,
    marginBottom: 4,
  },
  actionBar: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
});

