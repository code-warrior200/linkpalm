import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
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
  const [mapReady, setMapReady] = useState<boolean>(false);
  const location = getLocationCoordinates(sellerName, address);

  useEffect(() => {
    // Small delay to ensure map is ready
    const timer = setTimeout(() => {
      setMapReady(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
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

      {/* Map View */}
      <View style={styles.mapContainer}>
        {!mapReady && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#e27a14" />
            <Text style={styles.loadingText}>Loading map...</Text>
          </View>
        )}
        <MapView
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          onMapReady={() => setMapReady(true)}
          showsUserLocation={false}
          showsMyLocationButton={false}
          toolbarEnabled={false}
        >
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title={sellerName}
            description={location.address}
          >
            <View style={styles.markerContainer}>
              <View style={styles.markerPin}>
                <Ionicons name="location" size={24} color="#fff" />
              </View>
            </View>
          </Marker>
        </MapView>
      </View>

      {/* Info Card */}
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
          onPress={() => {
            // Open directions in external app
            const encodedLocation = encodeURIComponent(location.address);
            const url = Platform.select({
              ios: `maps://maps.apple.com/?daddr=${encodedLocation}`,
              android: `google.navigation:q=${encodedLocation}`,
            });
            if (url) {
              Linking.openURL(url).catch(() => {
                Linking.openURL(`https://maps.google.com/?daddr=${encodedLocation}`);
              });
            }
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="navigate" size={20} color="#fff" />
          <Text style={styles.directionsButtonText}>Get Directions</Text>
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
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
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
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerPin: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e27a14',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  infoCard: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
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

