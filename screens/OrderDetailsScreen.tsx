import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { OrdersStackParamList } from '../types';
import Button from '../components/Button';

type OrderDetailsScreenNavigationProp = NativeStackNavigationProp<OrdersStackParamList, 'OrderDetails'>;
type OrderDetailsScreenRouteProp = RouteProp<OrdersStackParamList, 'OrderDetails'>;

interface Order {
  id: string;
  listingTitle: string;
  quantity: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  date: string;
  seller: string;
  orderNumber: string;
}

interface OrderDetailsScreenProps {
  navigation: OrderDetailsScreenNavigationProp;
  route: OrderDetailsScreenRouteProp;
}

export default function OrderDetailsScreen({ route, navigation }: OrderDetailsScreenProps): React.ReactElement {
  const { order } = route.params;
  const insets = useSafeAreaInsets();

  const getStatusConfig = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return {
          color: '#ff9800',
          bgColor: '#fff3e0',
          icon: 'time' as keyof typeof Ionicons.glyphMap,
          label: 'Pending',
          description: 'Your order is being processed',
        };
      case 'confirmed':
        return {
          color: '#2196f3',
          bgColor: '#e3f2fd',
          icon: 'checkmark-circle' as keyof typeof Ionicons.glyphMap,
          label: 'Confirmed',
          description: 'Your order has been confirmed by the seller',
        };
      case 'delivered':
        return {
          color: '#4caf50',
          bgColor: '#e8f5e9',
          icon: 'checkmark-done' as keyof typeof Ionicons.glyphMap,
          label: 'Delivered',
          description: 'Your order has been delivered',
        };
      case 'cancelled':
        return {
          color: '#f44336',
          bgColor: '#ffebee',
          icon: 'close-circle' as keyof typeof Ionicons.glyphMap,
          label: 'Cancelled',
          description: 'This order has been cancelled',
        };
      default:
        return {
          color: '#666',
          bgColor: '#f5f5f5',
          icon: 'ellipse' as keyof typeof Ionicons.glyphMap,
          label: status,
          description: '',
        };
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const statusConfig = getStatusConfig(order.status);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
      >
        {/* Status Header */}
        <View style={[styles.statusHeader, { backgroundColor: statusConfig.bgColor }]}>
          <View style={styles.statusIconContainer}>
            <Ionicons name={statusConfig.icon} size={48} color={statusConfig.color} />
          </View>
          <Text style={[styles.statusLabel, { color: statusConfig.color }]}>{statusConfig.label}</Text>
          <Text style={styles.statusDescription}>{statusConfig.description}</Text>
        </View>

        {/* Order Information */}
        <View style={styles.section}>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="receipt-outline" size={20} color="#e27a14" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Order Number</Text>
                <Text style={styles.infoValue}>{order.orderNumber}</Text>
              </View>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={20} color="#e27a14" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Order Date</Text>
                <Text style={styles.infoValue}>{formatDate(order.date)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Product Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Product Details</Text>
          <View style={styles.productCard}>
            <View style={styles.productHeader}>
              <View style={styles.productIcon}>
                <Ionicons name="cube-outline" size={24} color="#e27a14" />
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productTitle}>{order.listingTitle}</Text>
                <View style={styles.productMeta}>
                  <Ionicons name="storefront-outline" size={14} color="#666" />
                  <Text style={styles.productMetaText}>{order.seller}</Text>
                </View>
              </View>
            </View>
            <View style={styles.productDetails}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Quantity</Text>
                <Text style={styles.detailValue}>{order.quantity}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>₦{order.totalPrice.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={styles.summaryValue}>₦0.00</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotalLabel}>Total</Text>
              <Text style={styles.summaryTotalValue}>₦{order.totalPrice.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        {order.status === 'pending' && (
          <View style={styles.section}>
            <Button
              title="Cancel Order"
              onPress={() => {}}
              variant="outline"
              size="medium"
              icon="close-circle"
              iconPosition="left"
              fullWidth
              style={styles.cancelButton}
              textStyle={styles.cancelButtonText}
            />
          </View>
        )}

        {order.status === 'delivered' && (
          <View style={styles.section}>
            <Button
              title="Rate & Review"
              onPress={() => {}}
              variant="outline"
              size="medium"
              icon="star"
              iconPosition="left"
              fullWidth
              style={styles.reviewButton}
              textStyle={styles.reviewButtonText}
            />
          </View>
        )}

        {/* Contact Seller */}
        <View style={styles.section}>
          <Button
            title="Contact Seller"
            onPress={() => navigation.navigate('SellerContact', { sellerName: order.seller })}
            variant="secondary"
            size="medium"
            icon="chatbubble-outline"
            iconPosition="left"
            fullWidth
            style={styles.contactButton}
          />
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
  },
  statusHeader: {
    padding: 32,
    alignItems: 'center',
    marginBottom: 20,
  },
  statusIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  statusLabel: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  statusDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
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
  productHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  productIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#fff5eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 6,
    lineHeight: 22,
  },
  productMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productMetaText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
  },
  productDetails: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
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
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 12,
  },
  summaryTotalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  summaryTotalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#e27a14',
  },
  cancelButton: {},
  cancelButtonText: {
    color: '#f44336',
  },
  reviewButton: {},
  reviewButtonText: {
    color: '#ffc107',
  },
  contactButton: {},
});

