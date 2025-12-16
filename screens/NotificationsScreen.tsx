import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  RefreshControl,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BuyerStackParamList } from '../types';

type NotificationsScreenNavigationProp = NativeStackNavigationProp<BuyerStackParamList, 'Notifications'>;

interface Notification {
  id: string;
  type: 'order' | 'promotion' | 'system' | 'message';
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionUrl?: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'order',
    title: 'Order Confirmed',
    message: 'Your order ORD-2024-001 has been confirmed by Golden Farms Ltd',
    time: '2 hours ago',
    read: false,
  },
  {
    id: '2',
    type: 'promotion',
    title: 'Special Offer',
    message: 'Get 10% off on all palm oil orders this week! Use code SAVE10',
    time: '5 hours ago',
    read: false,
  },
  {
    id: '3',
    type: 'order',
    title: 'Order Delivered',
    message: 'Your order ORD-2024-002 has been delivered successfully',
    time: '1 day ago',
    read: true,
  },
  {
    id: '4',
    type: 'system',
    title: 'Account Verified',
    message: 'Your buyer account has been verified successfully',
    time: '2 days ago',
    read: true,
  },
  {
    id: '5',
    type: 'message',
    title: 'New Message',
    message: 'You have a new message from Mama Grace regarding your order',
    time: '3 days ago',
    read: true,
  },
];

interface NotificationsScreenProps {
  navigation: NotificationsScreenNavigationProp;
}

export default function NotificationsScreen({ navigation }: NotificationsScreenProps): React.ReactElement {
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const onRefresh = (): void => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const markAsRead = (id: string): void => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const deleteNotification = (id: string): void => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const markAllAsRead = (): void => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const clearAllNotifications = (): void => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to delete all notifications? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            setNotifications([]);
          },
        },
      ]
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type: Notification['type']): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case 'order':
        return 'receipt';
      case 'promotion':
        return 'pricetag';
      case 'system':
        return 'checkmark-circle';
      case 'message':
        return 'chatbubble';
      default:
        return 'notifications';
    }
  };

  const getNotificationColor = (type: Notification['type']): string => {
    switch (type) {
      case 'order':
        return '#2196f3';
      case 'promotion':
        return '#e27a14';
      case 'system':
        return '#4caf50';
      case 'message':
        return '#9c27b0';
      default:
        return '#666';
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => {
    const iconColor = getNotificationColor(item.type);
    const isUnread = !item.read;

    return (
      <View style={[styles.notificationCard, isUnread && styles.notificationCardUnread]}>
        <View style={styles.notificationContent}>
          <View style={[styles.iconWrapper, { backgroundColor: `${iconColor}15` }]}>
            <Ionicons name={getNotificationIcon(item.type)} size={22} color={iconColor} />
          </View>
          <View style={styles.textContent}>
            <View style={styles.titleRow}>
              <Text style={[styles.notificationTitle, isUnread && styles.notificationTitleUnread]}>
                {item.title}
              </Text>
              {isUnread && <View style={styles.unreadIndicator} />}
            </View>
            <Text style={styles.notificationMessage} numberOfLines={2}>
              {item.message}
            </Text>
            <View style={styles.footerRow}>
              <View style={styles.timeContainer}>
                <Ionicons name="time-outline" size={12} color="#999" />
                <Text style={styles.timeText}>{item.time}</Text>
              </View>
              <View style={styles.actionButtons}>
                {isUnread && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => markAsRead(item.id)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="checkmark" size={16} color="#4caf50" />
                    <Text style={styles.actionButtonText}>Mark read</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => deleteNotification(item.id)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="trash-outline" size={16} color="#f44336" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Modern Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Notifications</Text>
            {unreadCount > 0 && (
              <View style={styles.unreadBadgeContainer}>
                <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>
          {notifications.length > 0 && (
            <TouchableOpacity
              style={styles.moreButton}
              onPress={clearAllNotifications}
              activeOpacity={0.7}
            >
              <Ionicons name="ellipsis-horizontal" size={24} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        {/* Action Bar */}
        {notifications.length > 0 && (
          <View style={styles.actionBar}>
            {unreadCount > 0 && (
              <TouchableOpacity
                style={styles.actionBarButton}
                onPress={markAllAsRead}
                activeOpacity={0.7}
              >
                <Ionicons name="checkmark-done" size={18} color="#4caf50" />
                <Text style={styles.actionBarText}>Mark all read</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.actionBarButton, styles.clearAllButton]}
              onPress={clearAllNotifications}
              activeOpacity={0.7}
            >
              <Ionicons name="trash" size={18} color="#f44336" />
              <Text style={[styles.actionBarText, styles.clearAllText]}>Clear all</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="notifications-off-outline" size={80} color="#ddd" />
          </View>
          <Text style={styles.emptyTitle}>No Notifications</Text>
          <Text style={styles.emptySubtitle}>You're all caught up!{'\n'}New notifications will appear here.</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 120 }]}
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
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    marginBottom: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    marginRight: 12,
  },
  headerTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: -0.5,
  },
  unreadBadgeContainer: {
    backgroundColor: '#e27a14',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  moreButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  },
  actionBar: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 8,
  },
  actionBarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    gap: 6,
  },
  actionBarText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4caf50',
  },
  clearAllButton: {
    backgroundColor: '#fff5f5',
  },
  clearAllText: {
    color: '#f44336',
  },
  listContent: {
    padding: 20,
    gap: 12,
  },
  notificationCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  notificationCardUnread: {
    borderLeftWidth: 4,
    borderLeftColor: '#e27a14',
    backgroundColor: '#fffbf5',
    ...Platform.select({
      ios: {
        shadowColor: '#e27a14',
        shadowOpacity: 0.1,
      },
    }),
  },
  notificationContent: {
    flexDirection: 'row',
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    flex: 1,
  },
  notificationTitleUnread: {
    fontWeight: '700',
    color: '#1a1a1a',
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e27a14',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    gap: 4,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4caf50',
  },
  deleteButton: {
    backgroundColor: '#fff5f5',
    paddingHorizontal: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 80,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
  },
});
