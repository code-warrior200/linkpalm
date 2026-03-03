import { Ionicons } from '@expo/vector-icons';

export type OrderStatus = 'pending' | 'confirmed' | 'in-transit' | 'delivered' | 'cancelled';

type IconName = keyof typeof Ionicons.glyphMap;

export interface StatusConfig {
  color: string;
  bgColor: string;
  icon: IconName;
  label: string;
  description?: string;
}

const STATUS_CONFIG: Record<OrderStatus, Omit<StatusConfig, 'description'>> = {
  pending: { color: '#ff9800', bgColor: '#fff3e0', icon: 'time', label: 'Pending' },
  confirmed: { color: '#2196f3', bgColor: '#e3f2fd', icon: 'checkmark-circle', label: 'Confirmed' },
  'in-transit': { color: '#9c27b0', bgColor: '#f3e5f5', icon: 'car', label: 'In Transit' },
  delivered: { color: '#4caf50', bgColor: '#e8f5e9', icon: 'checkmark-done', label: 'Delivered' },
  cancelled: { color: '#f44336', bgColor: '#ffebee', icon: 'close-circle', label: 'Cancelled' },
};

const STATUS_DESCRIPTIONS: Partial<Record<OrderStatus, string>> = {
  'in-transit': 'Your order is on the way',
  pending: 'Your order is being processed',
  confirmed: 'Your order has been confirmed by the seller',
  delivered: 'Your order has been delivered',
  cancelled: 'This order has been cancelled',
};

export function getStatusConfig(status: OrderStatus, includeDescription = false): StatusConfig {
  const config = STATUS_CONFIG[status] ?? {
    color: '#666',
    bgColor: '#f5f5f5',
    icon: 'ellipse' as IconName,
    label: status,
  };
  const description = includeDescription ? STATUS_DESCRIPTIONS[status] : undefined;
  return { ...config, description };
}

export function getStatusColor(status: OrderStatus): string {
  return STATUS_CONFIG[status]?.color ?? '#666';
}

export function getStatusIcon(status: OrderStatus): IconName {
  const iconMap: Record<OrderStatus, IconName> = {
    pending: 'time-outline',
    confirmed: 'checkmark-circle-outline',
    'in-transit': 'car-outline',
    delivered: 'checkmark-done-circle-outline',
    cancelled: 'close-circle-outline',
  };
  return iconMap[status] ?? ('help-circle-outline' as IconName);
}
