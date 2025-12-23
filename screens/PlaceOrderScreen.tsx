import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { BuyerStackParamList, Order } from '../types';
import { useOrdersStore } from '../stores/ordersStore';
import { useAuthStore } from '../stores/authStore';
import { useAlert, alertHelpers } from '../contexts/AlertContext';
import Button from '../components/Button';

type PlaceOrderScreenNavigationProp = NativeStackNavigationProp<BuyerStackParamList, 'PlaceOrder'>;
type PlaceOrderScreenRouteProp = RouteProp<BuyerStackParamList, 'PlaceOrder'>;

interface PlaceOrderScreenProps {
  navigation: PlaceOrderScreenNavigationProp;
  route: PlaceOrderScreenRouteProp;
}

export default function PlaceOrderScreen({ route, navigation }: PlaceOrderScreenProps): React.ReactElement {
  const { listing, quantity } = route.params;
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);
  const addOrder = useOrdersStore((state) => state.addOrder);
  const { showAlert } = useAlert();

  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPrice = listing.pricePerUnit * quantity;

  const handlePlaceOrder = async () => {
    if (!deliveryAddress.trim() || !contactPhone.trim()) {
      showAlert(alertHelpers.warning(
        'Missing Information',
        'Please provide delivery address and contact phone.'
      ));
      return;
    }

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newOrder: Order = {
      id: Date.now().toString(),
      listingId: listing.id,
      listingTitle: listing.title,
      quantity,
      totalPrice,
      status: 'pending',
      date: new Date().toISOString(),
      seller: listing.seller,
      sellerId: listing.sellerId,
      buyer: user?.name || 'Unknown Buyer',
      buyerId: user?.id || '',
      orderNumber: `ORD-${Date.now()}`,
      deliveryAddress: deliveryAddress.trim(),
      notes: notes.trim() || undefined,
    };

    addOrder(newOrder);
    setIsSubmitting(false);

    showAlert(alertHelpers.success(
      'Order Placed!',
      `Your order (${newOrder.orderNumber}) has been placed successfully. The seller will contact you soon.`,
      () => navigation.navigate('BrowseHome' as never)
    ));
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

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryCard}>
            <Text style={styles.listingTitle}>{listing.title}</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Price per unit:</Text>
              <Text style={styles.summaryValue}>₦{listing.pricePerUnit}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Quantity:</Text>
              <Text style={styles.summaryValue}>{quantity} {listing.unit}(s)</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Seller:</Text>
              <Text style={styles.summaryValue}>{listing.seller}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>₦{totalPrice.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Delivery Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Information</Text>
          <View style={styles.inputGroup}>
            <View style={styles.labelContainer}>
              <Ionicons name="location-outline" size={18} color="#666" />
              <Text style={styles.label}>Delivery Address *</Text>
            </View>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter your full delivery address"
              placeholderTextColor="#999"
              value={deliveryAddress}
              onChangeText={setDeliveryAddress}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelContainer}>
              <Ionicons name="call-outline" size={18} color="#666" />
              <Text style={styles.label}>Contact Phone *</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="+234 XXX XXX XXXX"
              placeholderTextColor="#999"
              value={contactPhone}
              onChangeText={setContactPhone}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelContainer}>
              <Ionicons name="document-text-outline" size={18} color="#666" />
              <Text style={styles.label}>Additional Notes</Text>
            </View>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Any special instructions or requirements..."
              placeholderTextColor="#999"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {/* Payment Notice */}
        <View style={styles.noticeCard}>
          <Ionicons name="information-circle-outline" size={24} color="#2196f3" />
          <View style={styles.noticeContent}>
            <Text style={styles.noticeTitle}>Payment on Delivery</Text>
            <Text style={styles.noticeText}>
              Payment will be made upon delivery. The seller will contact you to arrange delivery.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Action Bar */}
      <View style={[styles.actionBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <View style={styles.priceInfo}>
          <Text style={styles.priceInfoLabel}>Total Amount</Text>
          <Text style={styles.priceInfoValue}>₦{totalPrice.toFixed(2)}</Text>
        </View>
        <Button
          title="Place Order"
          onPress={handlePlaceOrder}
          variant="primary"
          size="medium"
          loading={isSubmitting}
          icon="checkmark-circle"
          iconPosition="left"
          style={styles.placeOrderButton}
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
  summaryCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  listingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#e27a14',
  },
  inputGroup: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  noticeCard: {
    flexDirection: 'row',
    backgroundColor: '#e3f2fd',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  noticeContent: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1565c0',
    marginBottom: 4,
  },
  noticeText: {
    fontSize: 13,
    color: '#1565c0',
    lineHeight: 18,
  },
  actionBar: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  priceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceInfoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  priceInfoValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#e27a14',
  },
  placeOrderButton: {
    width: '100%',
  },
});

