import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BuyerBrowseScreen from './screens/BuyerBrowseScreen';
import BuyerOrdersScreen from './screens/BuyerOrdersScreen';
import BuyerProfileScreen from './screens/BuyerProfileScreen';
import MyListingsScreen from './screens/MyListingsScreen';
import CreateListingScreen from './screens/CreateListingScreen';
import SellerAnalyticsScreen from './screens/SellerAnalyticsScreen';
import SellerProfileScreen from './screens/SellerProfileScreen';
import ListingDetailsScreen from './screens/ListingDetailsScreen';
import OrderDetailsScreen from './screens/OrderDetailsScreen';
import SellerContactScreen from './screens/SellerContactScreen';
import SellerLocationMapScreen from './screens/SellerLocationMapScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import ReviewListingScreen from './screens/ReviewListingScreen';
import RateSellerScreen from './screens/RateSellerScreen';
import MessagesScreen from './screens/MessagesScreen';
import ChatScreen from './screens/ChatScreen';
import SellerOrdersScreen from './screens/SellerOrdersScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import LoadingScreen from './screens/LoadingScreen';
import CustomTabBar from './components/CustomTabBar';
import {
  BuyerStackParamList,
  OrdersStackParamList,
  SellerStackParamList,
  BuyerTabParamList,
  SellerTabParamList,
  AuthStackParamList,
} from './types';
import { useAuthStore } from './stores/authStore';

const BuyerTab = createBottomTabNavigator<BuyerTabParamList>();
const SellerTab = createBottomTabNavigator<SellerTabParamList>();
const BuyerStack = createNativeStackNavigator<BuyerStackParamList>();
const OrdersStack = createNativeStackNavigator<OrdersStackParamList>();
const SellerStack = createNativeStackNavigator<SellerStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

// Buyer Navigation Stack
function BuyerStackNavigator(): React.ReactElement {
  return (
    <BuyerStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 20,
        },
        headerShadowVisible: false,
        headerBackTitle: '',
      }}
    >
      <BuyerStack.Screen
        name="BrowseHome"
        component={BuyerBrowseScreen}
        options={{ headerShown: false }}
      />
      <BuyerStack.Screen
        name="ListingDetails"
        component={ListingDetailsScreen}
        options={{
          title: 'Listing Details',
          headerShown: true,
        }}
      />
      <BuyerStack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          headerShown: false,
        }}
      />
      <BuyerStack.Screen
        name="SellerContact"
        component={SellerContactScreen}
        options={{
          title: 'Contact Seller',
          headerShown: true,
        }}
      />
      <BuyerStack.Screen
        name="SellerLocationMap"
        component={SellerLocationMapScreen}
        options={{
          headerShown: false,
        }}
      />
      <BuyerStack.Screen
        name="PlaceOrder"
        component={PlaceOrderScreen}
        options={{
          title: 'Place Order',
          headerShown: true,
        }}
      />
      <BuyerStack.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          headerShown: false,
        }}
      />
      <BuyerStack.Screen
        name="ReviewListing"
        component={ReviewListingScreen}
        options={{
          title: 'Write a Review',
          headerShown: true,
        }}
      />
      <BuyerStack.Screen
        name="RateSeller"
        component={RateSellerScreen}
        options={{
          headerShown: false,
        }}
      />
      <BuyerStack.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          headerShown: false,
        }}
      />
      <BuyerStack.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          headerShown: true,
        }}
      />
    </BuyerStack.Navigator>
  );
}

// Orders Navigation Stack
function OrdersStackNavigator(): React.ReactElement {
  return (
    <OrdersStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 20,
        },
        headerShadowVisible: false,
        headerBackTitle: '',
      }}
    >
      <OrdersStack.Screen
        name="OrdersHome"
        component={BuyerOrdersScreen}
        options={{ headerShown: false }}
      />
      <OrdersStack.Screen
        name="OrderDetails"
        component={OrderDetailsScreen}
        options={{
          title: 'Order Details',
          headerShown: true,
        }}
      />
      <OrdersStack.Screen
        name="SellerContact"
        component={SellerContactScreen}
        options={{
          title: 'Contact Seller',
          headerShown: true,
        }}
      />
      <OrdersStack.Screen
        name="SellerLocationMap"
        component={SellerLocationMapScreen}
        options={{
          headerShown: false,
        }}
      />
      <OrdersStack.Screen
        name="ReviewListing"
        component={ReviewListingScreen}
        options={{
          title: 'Write a Review',
          headerShown: true,
        }}
      />
    </OrdersStack.Navigator>
  );
}

// Seller Navigation Stack
function SellerListingsStackNavigator(): React.ReactElement {
  return (
    <SellerStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 20,
        },
        headerShadowVisible: false,
        headerBackTitle: '',
      }}
    >
      <SellerStack.Screen
        name="MyListingsHome"
        component={MyListingsScreen}
        options={{ headerShown: false }}
      />
      <SellerStack.Screen
        name="CreateListing"
        component={CreateListingScreen}
        options={{
          title: 'New Listing',
          headerShown: true,
        }}
      />
      <SellerStack.Screen
        name="ListingDetails"
        component={ListingDetailsScreen}
        options={{
          title: 'Listing Details',
          headerShown: true,
        }}
      />
      <SellerStack.Screen
        name="SellerOrders"
        component={SellerOrdersScreen}
        options={{
          title: 'My Orders',
          headerShown: true,
        }}
      />
      <SellerStack.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          headerShown: false,
        }}
      />
      <SellerStack.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          headerShown: true,
        }}
      />
    </SellerStack.Navigator>
  );
}

// Buyer Tab Navigator
function BuyerTabNavigator(): React.ReactElement {
  return (
    <BuyerTab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <BuyerTab.Screen
        name="Browse"
        component={BuyerStackNavigator}
        options={{
          tabBarLabel: 'Browse',
          tabBarAccessibilityLabel: 'Browse palm oil listings',
        }}
      />
      <BuyerTab.Screen
        name="Orders"
        component={OrdersStackNavigator}
        options={{
          tabBarLabel: 'Orders',
          tabBarAccessibilityLabel: 'View your orders',
          headerShown: false,
        }}
      />
      <BuyerTab.Screen
        name="BuyerProfile"
        component={BuyerProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarAccessibilityLabel: 'View your profile',
          headerShown: false,
        }}
      />
    </BuyerTab.Navigator>
  );
}

// Seller Tab Navigator
function SellerTabNavigator(): React.ReactElement {
  return (
    <SellerTab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <SellerTab.Screen
        name="MyListings"
        component={SellerListingsStackNavigator}
        options={{
          tabBarLabel: 'Listings',
          tabBarAccessibilityLabel: 'Manage your listings',
        }}
      />
      <SellerTab.Screen
        name="Analytics"
        component={SellerAnalyticsScreen}
        options={{
          tabBarLabel: 'Analytics',
          tabBarAccessibilityLabel: 'View sales analytics',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 20,
          },
          headerShadowVisible: false,
        }}
      />
      <SellerTab.Screen
        name="SellerProfile"
        component={SellerProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarAccessibilityLabel: 'View your profile',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 20,
          },
          headerShadowVisible: false,
        }}
      />
    </SellerTab.Navigator>
  );
}

// Auth Navigator
function AuthNavigator({ isOnboardingComplete }: { isOnboardingComplete: boolean }): React.ReactElement {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={isOnboardingComplete ? 'Login' : 'Onboarding'}
    >
      <AuthStack.Screen name="Onboarding" component={OnboardingScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
    </AuthStack.Navigator>
  );
}

// Root Navigation
export default function RootNavigation(): React.ReactElement {
  const user = useAuthStore((state) => state.user);
  const isPostLoginLoading = useAuthStore((state) => state.isPostLoginLoading);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);

  useEffect(() => {
    const checkOnboardingStatus = async (): Promise<void> => {
      try {
        const value = await AsyncStorage.getItem('onboarding_completed');
        setIsOnboardingComplete(value === 'true');
      } catch (error) {
        // If error, assume onboarding not completed
        setIsOnboardingComplete(false);
      }
    };

    checkOnboardingStatus();
  }, []);

  // Show loading state while checking onboarding status
  if (isOnboardingComplete === null) {
    return <NavigationContainer><View style={{ flex: 1, backgroundColor: '#fff' }} /></NavigationContainer>;
  }

  // Show animated loader after successful login
  if (user && isPostLoginLoading) {
    return (
      <NavigationContainer>
        <LoadingScreen />
      </NavigationContainer>
    );
  }

  if (!user) {
    return (
      <NavigationContainer>
        <AuthNavigator isOnboardingComplete={isOnboardingComplete} />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      {user.role === 'buyer' ? <BuyerTabNavigator /> : <SellerTabNavigator />}
    </NavigationContainer>
  );
}
