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
import { SellerStackParamList, Order } from '../types';
import { useOrdersStore } from '../stores/ordersStore';
import { useAuthStore } from '../stores/authStore';

type SellerOrdersScreenNavigationProp = NativeStackNavigationProp<SellerStackParamList, 'SellerOrders'>;

interface SellerOrdersScreenProps {
  navigation: SellerOrdersScreenNavigationProp;
}

const MOCK_SELLER_ORDERS: Order[] = [
  {
    id: 'so1',
    listingId: 'm1',
    listingTitle: 'Organic village palm oil - 20L',
    quantity: 5,
    totalPrice: 325,
    status: 'pending',
    date: new Date().toISOString(),
    seller: 'Demo Trader',
    sellerId: 'seller1',
    buyer: 'John Doe',
    buyerId: 'buyer1',
    orderNumber: 'ORD-2024-001',
    deliveryAddress: '123 Main St, Lagos, Nigeria',
  },
  {
    id: 'so2',
    listingId: 'm1',
    listingTitle: 'Organic village palm oil - 20L',
    quantity: 10,
    totalPrice: 650,
    status: 'confirmed',
    date: new Date(Date.now() - 86400000).toISOString(),
    seller: 'Demo Trader',
    sellerId: 'seller1',
    buyer: 'Jane Smith',
    buyerId: 'buyer2',
    orderNumber: 'ORD-2024-002',
    deliveryAddress: '456 Market Rd, Abuja, Nigeria',
  },
];

export default function SellerOrdersScreen({ navigation }: SellerOrdersScreenProps): React.ReactElement {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);
  const [orders, setOrders] = useState<Order[]>(MOCK_SELLER_ORDERS);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'in-transit' | 'delivered'>('all');

  const onRefresh = (): void => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return '#ff9800';
      case 'confirmed':
        return '#2196f3';
      case 'in-transit':
        return '#9c27b0';
      case 'delivered':
        return '#4caf50';
      case 'cancelled':
        return '#f44336';
      default:
        return '#666';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'time-outline';
      case 'confirmed':
        return 'checkmark-circle-outline';
      case 'in-transit':
        return 'car-outline';
      case 'delivered':
        return 'checkmark-done-circle-outline';
      case 'cancelled':
        return 'close-circle-outline';
      default:
        return 'help-circle-outline';
    }
  };

  const renderFilterButton = (
    filterValue: typeof filter,
    label: string,
    count: number
  ) => (
    <TouchableOpacity
      style={[styles.filterButton, filter === filterValue && styles.filterButtonActive]}
      onPress={() => setFilter(filterValue)}
      activeOpacity={0.7}
    >
      <Text style={[styles.filterButtonText, filter === filterValue && styles.filterButtonTextActive]}>
        {label}
      </Text>
      <View style={[styles.filterBadge, filter === filterValue && styles.filterBadgeActive]}>
        <Text style={[styles.filterBadgeText, filter === filterValue && styles.filterBadgeTextActive]}>
          {count}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('OrderDetails', { order: item })}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.orderNumberContainer}>
          <Text style={styles.orderNumber}>{item.orderNumber}</Text>
          <Text style={styles.orderDate}>
            {new Date(item.date).toLocaleDateString()}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
          <Ionicons name={getStatusIcon(item.status)} size={14} color={getStatusColor(item.status)} />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      <Text style={styles.listingTitle}>{item.listingTitle}</Text>

      <View style={styles.orderDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="person-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{item.buyer}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="cube-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{item.quantity} units</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.totalPrice}>₦{item.totalPrice.toFixed(2)}</Text>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('OrderDetails', { order: item })}
          activeOpacity={0.7}
        >
          <Text style={styles.actionButtonText}>Manage</Text>
          <Ionicons name="chevron-forward" size={16} color="#e27a14" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="receipt-outline" size={80} color="#ddd" />
      <Text style={styles.emptyTitle}>No Orders Yet</Text>
      <Text style={styles.emptyText}>
        Your incoming orders will appear here
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Orders</Text>
        <Text style={styles.headerSubtitle}>Manage your incoming orders</Text>
      </View>

      <View style={styles.filtersContainer}>
        {renderFilterButton('all', 'All', orders.length)}
        {renderFilterButton('pending', 'Pending', orders.filter((o) => o.status === 'pending').length)}
        {renderFilterButton('confirmed', 'Confirmed', orders.filter((o) => o.status === 'confirmed').length)}
        {renderFilterButton('in-transit', 'In Transit', orders.filter((o) => o.status === 'in-transit').length)}
      </View>

      <FlatList
        data={filteredOrders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#e27a14']} />}
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
  filtersContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    display: 'inline-flex',
  },
  filterButtonActive: {
    backgroundColor: '#fff5eb',
    borderWidth: 1,
    borderColor: '#e27a14',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginRight: 8,
  },
  filterButtonTextActive: {
    color: '#e27a14',
  },
  filterBadge: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 24,
    alignItems: 'center',
  },
  filterBadgeActive: {
    backgroundColor: '#e27a14',
  },
  filterBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  filterBadgeTextActive: {
    color: '#fff',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderNumberContainer: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 13,
    color: '#666',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  listingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  orderDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#e27a14',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fff5eb',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e27a14',
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
  },
});

