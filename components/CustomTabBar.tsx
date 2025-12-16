import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

interface TabIconConfig {
  [key: string]: {
    icon: keyof typeof Ionicons.glyphMap;
    activeIcon: keyof typeof Ionicons.glyphMap;
    label: string;
  };
}

const BUYER_TAB_ICONS: TabIconConfig = {
  Browse: {
    icon: 'search-outline',
    label: 'Browse',
    activeIcon: 'search',
  },
  Orders: {
    icon: 'receipt-outline',
    label: 'Orders',
    activeIcon: 'receipt',
  },
  BuyerProfile: {
    icon: 'person-outline',
    label: 'Profile',
    activeIcon: 'person',
  },
};

const SELLER_TAB_ICONS: TabIconConfig = {
  MyListings: {
    icon: 'list-outline',
    label: 'Listings',
    activeIcon: 'list',
  },
  Analytics: {
    icon: 'bar-chart-outline',
    label: 'Analytics',
    activeIcon: 'bar-chart',
  },
  SellerProfile: {
    icon: 'person-outline',
    label: 'Profile',
    activeIcon: 'person',
  },
};

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps): React.ReactElement | null {
  const insets = useSafeAreaInsets();
  // Determine if we're using buyer or seller icons
  const isBuyer = state.routes[0].name === 'Browse';
  const tabIcons = isBuyer ? BUYER_TAB_ICONS : SELLER_TAB_ICONS;

  // Check if current screen should hide tab bar (ListingDetails, OrderDetails, Notifications, or Profile screens)
  const currentRoute = state.routes[state.index];
  const currentRouteName = currentRoute.name;
  
  // Hide tab bar on Profile screens
  if (currentRouteName === 'BuyerProfile' || currentRouteName === 'SellerProfile') {
    return null;
  }
  
  // For nested navigators, check the nested route
  let shouldHideTabBar = false;
  if (currentRouteName === 'Browse' || currentRouteName === 'MyListings') {
    // Check nested stack navigator state
    const nestedState = (currentRoute as { state?: { routes: Array<{ name: string }>; index: number } }).state;
    if (nestedState && nestedState.routes && nestedState.routes[nestedState.index]) {
      const nestedRoute = nestedState.routes[nestedState.index];
      if (nestedRoute.name === 'ListingDetails' || nestedRoute.name === 'Notifications' || nestedRoute.name === 'CreateListing' || nestedRoute.name === 'SellerContact' || nestedRoute.name === 'SellerLocationMap') {
        shouldHideTabBar = true;
      }
    }
  } else if (currentRouteName === 'Orders') {
    // Check nested stack navigator state for Orders
    const nestedState = (currentRoute as { state?: { routes: Array<{ name: string }>; index: number } }).state;
    if (nestedState && nestedState.routes && nestedState.routes[nestedState.index]) {
      const nestedRoute = nestedState.routes[nestedState.index];
      if (nestedRoute.name === 'OrderDetails' || nestedRoute.name === 'SellerContact' || nestedRoute.name === 'SellerLocationMap') {
        shouldHideTabBar = true;
      }
    }
  }

  if (shouldHideTabBar) {
    return null;
  }

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;
          const iconConfig = tabIcons[route.name] || {
            icon: 'ellipse-outline' as keyof typeof Ionicons.glyphMap,
            activeIcon: 'ellipse' as keyof typeof Ionicons.glyphMap,
            label: String(label),
          };

          const onPress = (): void => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = (): void => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, isFocused && styles.iconContainerActive]}>
                <Ionicons
                  name={isFocused ? iconConfig.activeIcon : iconConfig.icon}
                  size={24}
                  color={isFocused ? '#e27a14' : '#999'}
                />
              </View>
              <Text style={[styles.label, isFocused && styles.labelActive]}>
                {iconConfig.label}
              </Text>
              {isFocused && <View style={styles.indicator} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    paddingTop: 8,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: Platform.OS === 'ios' ? 8 : 10,
    borderRadius: 28,
    paddingVertical: 10,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 12,
    borderTopWidth: 0,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    position: 'relative',
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    backgroundColor: 'transparent',
  },
  iconContainerActive: {
    backgroundColor: '#fff5eb',
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: '#999',
    marginTop: 2,
    letterSpacing: 0.2,
  },
  labelActive: {
    color: '#e27a14',
    fontWeight: '700',
  },
  indicator: {
    position: 'absolute',
    top: 2,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#e27a14',
  },
});
