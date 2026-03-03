import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { BuyerStackParamList, OrdersStackParamList } from '../types';
import { getLocationCoordinates } from '../utils/locationCoordinates';

type SellerLocationMapScreenNavigationProp =
  | NativeStackNavigationProp<BuyerStackParamList, 'SellerLocationMap'>
  | NativeStackNavigationProp<OrdersStackParamList, 'SellerLocationMap'>;
type SellerLocationMapScreenRouteProp =
  | RouteProp<BuyerStackParamList, 'SellerLocationMap'>
  | RouteProp<OrdersStackParamList, 'SellerLocationMap'>;

interface SellerLocationMapScreenProps {
  navigation: SellerLocationMapScreenNavigationProp;
  route: SellerLocationMapScreenRouteProp;
}

export default function SellerLocationMapScreen({ route, navigation }: SellerLocationMapScreenProps): React.ReactElement {
  const { sellerName, address } = route.params;
  const insets = useSafeAreaInsets();
  const location = getLocationCoordinates(sellerName, address);
  const googleMapsUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {sellerName}
          </Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            {location.address}
          </Text>
        </View>
      </View>

      <View style={styles.mapPlaceholder}>
        <View style={styles.mapPlaceholderContent}>
          <Ionicons name="map" size={64} color="#e27a14" />
          <Text style={styles.mapPlaceholderText}>Maps are available on mobile</Text>
          <Text style={styles.mapPlaceholderSubtext}>Open this link on your phone or use the button below to view in Google Maps</Text>
        </View>
      </View>

      <View style={[styles.infoCard, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.infoCardHeader}>
          <View style={styles.infoIcon}>
            <Ionicons name="storefront" size={20} color="#e27a14" />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>{sellerName}</Text>
            <Text style={styles.infoAddress}>{location.address}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.directionsButton}
          onPress={() => Linking.openURL(googleMapsUrl)}
          activeOpacity={0.7}
        >
          <Ionicons name="navigate" size={20} color="#fff" />
          <Text style={styles.directionsButtonText}>Open in Google Maps</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  mapPlaceholderContent: {
    alignItems: 'center',
    maxWidth: 320,
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: 16,
    textAlign: 'center',
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff5eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  infoAddress: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e27a14',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  directionsButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
