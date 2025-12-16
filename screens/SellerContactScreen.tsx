import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { BuyerStackParamList, OrdersStackParamList } from '../types';

type SellerContactScreenNavigationProp =
  | NativeStackNavigationProp<BuyerStackParamList, 'SellerContact'>
  | NativeStackNavigationProp<OrdersStackParamList, 'SellerContact'>;
type SellerContactScreenRouteProp =
  | RouteProp<BuyerStackParamList, 'SellerContact'>
  | RouteProp<OrdersStackParamList, 'SellerContact'>;

interface SellerContactInfo {
  fullName: string;
  phoneNumber: string;
  email: string;
  shopLocation: string;
}

interface SellerContactScreenProps {
  navigation: SellerContactScreenNavigationProp;
  route: SellerContactScreenRouteProp;
}

export default function SellerContactScreen({ route, navigation }: SellerContactScreenProps): React.ReactElement {
  const { sellerName } = route.params;
  const insets = useSafeAreaInsets();

  // Mock seller contact information - in real app, this would come from API
  const getSellerContactInfo = (name: string): SellerContactInfo => {
    const contactMap: Record<string, SellerContactInfo> = {
      'Golden Farms Ltd': {
        fullName: 'John Adebayo',
        phoneNumber: '+234 801 234 5678',
        email: 'john.adebayo@goldenfarms.com',
        shopLocation: '123 Palm Oil Street, Ikeja, Lagos, Nigeria',
      },
      'Mama Grace': {
        fullName: 'Grace Okafor',
        phoneNumber: '+234 802 345 6789',
        email: 'mamagrace@email.com',
        shopLocation: '45 Market Road, Benin City, Edo State, Nigeria',
      },
      'Green Valley Farms': {
        fullName: 'Michael Okonkwo',
        phoneNumber: '+234 803 456 7890',
        email: 'michael@greenvalleyfarms.com',
        shopLocation: '78 Farm Estate, Ibadan, Oyo State, Nigeria',
      },
      'Niger Delta Oils': {
        fullName: 'Sarah Williams',
        phoneNumber: '+234 804 567 8901',
        email: 'sarah@nigerdeltaoils.com',
        shopLocation: '12 Industrial Layout, Port Harcourt, Rivers State, Nigeria',
      },
      'Premium Oils Co': {
        fullName: 'David Chukwu',
        phoneNumber: '+234 805 678 9012',
        email: 'david@premiumoils.com',
        shopLocation: '56 Business District, Abuja, FCT, Nigeria',
      },
    };

    return (
      contactMap[name] || {
        fullName: 'Seller Name',
        phoneNumber: '+234 XXX XXX XXXX',
        email: 'seller@email.com',
        shopLocation: 'Location not available',
      }
    );
  };

  const contactInfo = getSellerContactInfo(sellerName);

  const handlePhoneCall = (): void => {
    const phoneNumber = contactInfo.phoneNumber.replace(/\s/g, '');
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmail = (): void => {
    Linking.openURL(`mailto:${contactInfo.email}`);
  };

  const handleLocation = (): void => {
    // Type assertion needed because navigation is a union type
    (navigation as unknown as NativeStackNavigationProp<BuyerStackParamList | OrdersStackParamList, 'SellerLocationMap'>).navigate('SellerLocationMap', {
      sellerName: sellerName,
      address: contactInfo.shopLocation,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.sellerIconContainer}>
            <Ionicons name="storefront" size={48} color="#e27a14" />
          </View>
          <Text style={styles.sellerName}>{sellerName}</Text>
          <Text style={styles.sellerSubtitle}>Contact Information</Text>
        </View>

        {/* Contact Information Cards */}
        <View style={styles.section}>
          {/* Full Name */}
          <View style={styles.contactCard}>
            <View style={styles.contactCardHeader}>
              <View style={[styles.iconContainer, { backgroundColor: '#e3f2fd' }]}>
                <Ionicons name="person" size={24} color="#2196f3" />
              </View>
              <View style={styles.contactCardContent}>
                <Text style={styles.contactLabel}>Full Name</Text>
                <Text style={styles.contactValue}>{contactInfo.fullName}</Text>
              </View>
            </View>
          </View>

          {/* Phone Number */}
          <TouchableOpacity
            style={styles.contactCard}
            onPress={handlePhoneCall}
            activeOpacity={0.7}
          >
            <View style={styles.contactCardHeader}>
              <View style={[styles.iconContainer, { backgroundColor: '#e8f5e9' }]}>
                <Ionicons name="call" size={24} color="#4caf50" />
              </View>
              <View style={styles.contactCardContent}>
                <Text style={styles.contactLabel}>Phone Number</Text>
                <Text style={styles.contactValue}>{contactInfo.phoneNumber}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </View>
            <Text style={styles.actionHint}>Tap to call</Text>
          </TouchableOpacity>

          {/* Email Address */}
          <TouchableOpacity
            style={styles.contactCard}
            onPress={handleEmail}
            activeOpacity={0.7}
          >
            <View style={styles.contactCardHeader}>
              <View style={[styles.iconContainer, { backgroundColor: '#fff3e0' }]}>
                <Ionicons name="mail" size={24} color="#ff9800" />
              </View>
              <View style={styles.contactCardContent}>
                <Text style={styles.contactLabel}>Email Address</Text>
                <Text style={styles.contactValue}>{contactInfo.email}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </View>
            <Text style={styles.actionHint}>Tap to send email</Text>
          </TouchableOpacity>

          {/* Shop/Office Location */}
          <TouchableOpacity
            style={styles.contactCard}
            onPress={handleLocation}
            activeOpacity={0.7}
          >
            <View style={styles.contactCardHeader}>
              <View style={[styles.iconContainer, { backgroundColor: '#fff5eb' }]}>
                <Ionicons name="location" size={24} color="#e27a14" />
              </View>
              <View style={styles.contactCardContent}>
                <Text style={styles.contactLabel}>Shop/Office Location</Text>
                <Text style={styles.contactValue}>{contactInfo.shopLocation}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </View>
            <Text style={styles.actionHint}>Tap to view on map</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickActionButton} onPress={handlePhoneCall} activeOpacity={0.7}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#e8f5e9' }]}>
                <Ionicons name="call" size={24} color="#4caf50" />
              </View>
              <Text style={styles.quickActionText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton} onPress={handleEmail} activeOpacity={0.7}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#fff3e0' }]}>
                <Ionicons name="mail" size={24} color="#ff9800" />
              </View>
              <Text style={styles.quickActionText}>Email</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton} onPress={handleLocation} activeOpacity={0.7}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#fff5eb' }]}>
                <Ionicons name="location" size={24} color="#e27a14" />
              </View>
              <Text style={styles.quickActionText}>Location</Text>
            </TouchableOpacity>
          </View>
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
  headerSection: {
    backgroundColor: '#fff',
    padding: 32,
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sellerIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff5eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  sellerName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
    textAlign: 'center',
  },
  sellerSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  contactCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
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
  contactCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactCardContent: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontWeight: '500',
  },
  contactValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    lineHeight: 22,
  },
  actionHint: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    fontStyle: 'italic',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
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
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
});

