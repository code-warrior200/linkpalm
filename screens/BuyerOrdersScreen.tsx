import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OrdersStackParamList, Order } from '../types';
import { useAlert, alertHelpers } from '../contexts/AlertContext';
import Button from '../components/Button';

type BuyerOrdersScreenNavigationProp = NativeStackNavigationProp<OrdersStackParamList, 'Orders'>;

interface BuyerOrdersScreenProps {
  navigation: BuyerOrdersScreenNavigationProp;
}

const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    listingTitle: 'Premium Red Palm Oil - 25L',
    quantity: '5 kegs',
    totalPrice: 400,
    status: 'confirmed',
    date: '2024-01-15',
    seller: 'Golden Farms Ltd',
    orderNumber: 'ORD-2024-001',
  },
  {
    id: '2',
    listingTitle: 'Village-processed Palm Oil - 5L',
    quantity: '10 gallons',
    totalPrice: 200,
    status: 'delivered',
    date: '2024-01-10',
    seller: 'Mama Grace',
    orderNumber: 'ORD-2024-002',
  },
  {
    id: '3',
    listingTitle: 'Organic Palm Oil - 10L',
    quantity: '3 containers',
    totalPrice: 105,
    status: 'pending',
    date: '2024-01-18',
    seller: 'Green Valley Farms',
    orderNumber: 'ORD-2024-003',
  },
  {
    id: '4',
    listingTitle: 'Bulk Palm Oil - 200L drums',
    quantity: '2 drums',
    totalPrice: 1000,
    status: 'delivered',
    date: '2024-01-05',
    seller: 'Niger Delta Oils',
    orderNumber: 'ORD-2024-004',
  },
  {
    id: '5',
    listingTitle: 'Refined Palm Oil - 50L',
    quantity: '1 drum',
    totalPrice: 150,
    status: 'cancelled',
    date: '2024-01-12',
    seller: 'Premium Oils Co',
    orderNumber: 'ORD-2024-005',
  },
];

type OrderStatus = 'all' | 'pending' | 'confirmed' | 'delivered' | 'cancelled';

const STATUS_FILTERS: Array<{ id: OrderStatus; label: string; icon: keyof typeof Ionicons.glyphMap }> = [
  { id: 'all', label: 'All', icon: 'list-outline' },
  { id: 'pending', label: 'Pending', icon: 'time-outline' },
  { id: 'confirmed', label: 'Confirmed', icon: 'checkmark-circle-outline' },
  { id: 'delivered', label: 'Delivered', icon: 'checkmark-done-outline' },
  { id: 'cancelled', label: 'Cancelled', icon: 'close-circle-outline' },
];

export default function BuyerOrdersScreen({ navigation }: BuyerOrdersScreenProps): React.ReactElement {
  const insets = useSafeAreaInsets();
  const { showAlert } = useAlert();
  const [selectedFilter, setSelectedFilter] = useState<OrderStatus>('all');
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);

  const onRefresh = (): void => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const filteredOrders = orders.filter((order) => {
    if (selectedFilter === 'all') return true;
    return order.status === selectedFilter;
  });

  const getStatusConfig = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return {
          color: '#ff9800',
          bgColor: '#fff3e0',
          icon: 'time' as keyof typeof Ionicons.glyphMap,
          label: 'Pending',
        };
      case 'confirmed':
        return {
          color: '#2196f3',
          bgColor: '#e3f2fd',
          icon: 'checkmark-circle' as keyof typeof Ionicons.glyphMap,
          label: 'Confirmed',
        };
      case 'delivered':
        return {
          color: '#4caf50',
          bgColor: '#e8f5e9',
          icon: 'checkmark-done' as keyof typeof Ionicons.glyphMap,
          label: 'Delivered',
        };
      case 'cancelled':
        return {
          color: '#f44336',
          bgColor: '#ffebee',
          icon: 'close-circle' as keyof typeof Ionicons.glyphMap,
          label: 'Cancelled',
        };
      default:
        return {
          color: '#666',
          bgColor: '#f5f5f5',
          icon: 'ellipse' as keyof typeof Ionicons.glyphMap,
          label: status,
        };
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const handleCancelOrder = (orderId: string, orderNumber: string): void => {
    showAlert({
      type: 'warning',
      title: 'Cancel Order',
      message: `Are you sure you want to cancel order ${orderNumber}? This action cannot be undone.`,
      buttons: [
        { text: 'No, Keep Order', style: 'cancel' },
        {
          text: 'Yes, Cancel Order',
          style: 'destructive',
          onPress: () => {
            setOrders((prevOrders) =>
              prevOrders.map((order) =>
                order.id === orderId ? { ...order, status: 'cancelled' as const } : order
              )
            );
            showAlert(alertHelpers.success('Order Cancelled', `Order ${orderNumber} has been cancelled successfully.`));
          },
        },
      ],
    });
  };

  const getOrderStats = () => {
    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === 'pending').length,
      confirmed: orders.filter((o) => o.status === 'confirmed').length,
      delivered: orders.filter((o) => o.status === 'delivered').length,
    };
  };

  const stats = getOrderStats();

  const getActiveIcon = (icon: keyof typeof Ionicons.glyphMap): keyof typeof Ionicons.glyphMap => {
    const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
      'list-outline': 'list',
      'time-outline': 'time',
      'checkmark-circle-outline': 'checkmark-circle',
      'checkmark-done-outline': 'checkmark-done',
      'close-circle-outline': 'close-circle',
    };
    return iconMap[icon] || icon;
  };

  const renderFilterChip = (filter: { id: OrderStatus; label: string; icon: keyof typeof Ionicons.glyphMap }) => {
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

  const renderOrderCard = ({ item }: { item: Order }) => {
    const statusConfig = getStatusConfig(item.status);

    return (
      <TouchableOpacity style={styles.card} activeOpacity={0.8}>
        {/* Order Header */}
        <View style={styles.cardHeader}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderNumber}>{item.orderNumber}</Text>
            <Text style={styles.orderDate}>{formatDate(item.date)}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
            <Ionicons name={statusConfig.icon} size={14} color={statusConfig.color} />
            <Text style={[styles.statusText, { color: statusConfig.color }]}>{statusConfig.label}</Text>
          </View>
        </View>

        {/* Order Details */}
        <View style={styles.cardBody}>
          <View style={styles.productInfo}>
            <View style={styles.productIcon}>
              <Ionicons name="cube-outline" size={20} color="#e27a14" />
            </View>
            <View style={styles.productDetails}>
              <Text style={styles.productTitle} numberOfLines={2}>
                {item.listingTitle}
              </Text>
              <View style={styles.productMeta}>
                <Ionicons name="storefront-outline" size={12} color="#666" />
                <Text style={styles.productMetaText}>{item.seller}</Text>
              </View>
            </View>
          </View>

          <View style={styles.orderDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="cube-outline" size={14} color="#999" />
              <Text style={styles.detailLabel}>Quantity:</Text>
              <Text style={styles.detailValue}>{item.quantity}</Text>
            </View>
          </View>
        </View>

        {/* Order Footer */}
        <View style={styles.cardFooter}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Total</Text>
            <Text style={styles.priceValue}>₦{item.totalPrice.toFixed(2)}</Text>
          </View>
          <View style={styles.actionButtons}>
            {item.status === 'pending' && (
              <Button
                title="Cancel"
                onPress={() => handleCancelOrder(item.id, item.orderNumber)}
                variant="text"
                size="small"
                icon="close"
                iconPosition="left"
                style={styles.actionButton}
                textStyle={styles.cancelButtonText}
              />
            )}
            {item.status === 'delivered' && (
              <Button
                title="Review"
                onPress={() => {}}
                variant="text"
                size="small"
                icon="star-outline"
                iconPosition="left"
                style={styles.actionButton}
                textStyle={styles.reviewButtonText}
              />
            )}
            <Button
              title="View Details"
              onPress={() => {
                navigation.navigate('OrderDetails', { order: item });
              }}
              variant="outline"
              size="small"
              icon="chevron-forward"
              iconPosition="right"
              style={styles.viewButton}
            />
          </View>
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
            <Text style={styles.heading}>My Orders</Text>
            <Text style={styles.subheading}>{stats.total} total orders</Text>
          </View>
        </View>

        {/* Stats Cards */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="time-outline" size={20} color="#ff9800" />
            <Text style={styles.statValue}>{stats.pending}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#2196f3" />
            <Text style={styles.statValue}>{stats.confirmed}</Text>
            <Text style={styles.statLabel}>Confirmed</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-done-outline" size={20} color="#4caf50" />
            <Text style={styles.statValue}>{stats.delivered}</Text>
            <Text style={styles.statLabel}>Delivered</Text>
          </View>
        </ScrollView>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          {STATUS_FILTERS.map(renderFilterChip)}
        </ScrollView>
      </View>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="receipt-outline" size={64} color="#ddd" />
          <Text style={styles.emptyText}>No orders found</Text>
          <Text style={styles.emptySubtext}>
            {selectedFilter === 'all'
              ? 'Start browsing to make your first purchase'
              : `No ${selectedFilter} orders at the moment`}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrderCard}
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 100 }]}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#e27a14" />}
        />
      )}
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
    marginBottom: 16,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  subheading: {
    fontSize: 14,
    color: '#666',
  },
  statsContainer: {
    paddingRight: 20,
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 80,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    color: '#999',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardBody: {
    marginBottom: 16,
  },
  productInfo: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  productIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#fff5eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  productDetails: {
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
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  orderDetails: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 13,
    color: '#666',
    marginLeft: 6,
    marginRight: 8,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  cardFooter: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#e27a14',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {},
  cancelButtonText: {
    color: '#f44336',
  },
  reviewButtonText: {
    color: '#ffc107',
  },
  viewButton: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingHorizontal: 40,
  },
});
