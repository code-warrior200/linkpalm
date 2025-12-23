import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '../stores/authStore';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { SellerTabParamList } from '../types';
import { useAlert, alertHelpers } from '../contexts/AlertContext';
import Button from '../components/Button';

type SellerProfileScreenNavigationProp = BottomTabNavigationProp<SellerTabParamList, 'SellerProfile'>;

interface MenuItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  onPress?: () => void;
}

export default function SellerProfileScreen(): React.ReactElement {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<SellerProfileScreenNavigationProp>();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const { showAlert } = useAlert();

  const handleLogout = (): void => {
    showAlert({
      type: 'confirm',
      title: 'Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ],
    });
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleBackPress = (): void => {
    navigation.navigate('MyListings');
  };

  const requestImagePickerPermissions = async (): Promise<boolean> => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        showAlert(alertHelpers.warning(
          'Permission Required',
          'Sorry, we need camera roll permissions to upload your profile picture!'
        ));
        return false;
      }
    }
    return true;
  };

  const requestCameraPermissions = async (): Promise<boolean> => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        showAlert(alertHelpers.warning(
          'Permission Required',
          'Sorry, we need camera permissions to take photos!'
        ));
        return false;
      }
    }
    return true;
  };

  const handleImagePicker = async (): Promise<void> => {
    showAlert({
      type: 'info',
      title: 'Select Profile Picture',
      message: 'Choose an option',
      buttons: [
        {
          text: 'Camera',
          onPress: async () => {
            const hasPermission = await requestCameraPermissions();
            if (!hasPermission) return;

            const result = await ImagePicker.launchCameraAsync({
              // @ts-ignore - Using new mediaType API (replaces deprecated mediaTypes)
              mediaType: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
              setProfileImage(result.assets[0].uri);
            }
          },
        },
        {
          text: 'Photo Library',
          onPress: async () => {
            const hasPermission = await requestImagePickerPermissions();
            if (!hasPermission) return;

            const result = await ImagePicker.launchImageLibraryAsync({
              // @ts-ignore - Using new mediaType API (replaces deprecated mediaTypes)
              mediaType: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
              setProfileImage(result.assets[0].uri);
            }
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ],
    });
  };

  const handleRemoveImage = (): void => {
    showAlert(alertHelpers.delete(
      'Remove Profile Picture',
      'Are you sure you want to remove your profile picture?',
      () => setProfileImage(null)
    ));
  };

  const handleEditProfile = (): void => {
    showAlert({
      type: 'info',
      title: 'Edit Profile',
      message: 'Update your seller profile information',
      buttons: [
        {
          text: 'Edit Business Name',
          onPress: () => showAlert(alertHelpers.info('Edit Business Name', `Current: ${user?.name}\n\nEnter new business name in the form`)),
        },
        {
          text: 'Edit Email',
          onPress: () => showAlert(alertHelpers.info('Edit Email', `Current: ${user?.email}\n\nEnter new email address`)),
        },
        {
          text: 'Edit Phone',
          onPress: () => showAlert(alertHelpers.info('Edit Phone', 'Update your contact phone number')),
        },
        { text: 'Cancel', style: 'cancel' },
      ],
    });
  };

  const handleBusinessInfo = (): void => {
    showAlert({
      type: 'info',
      title: 'Business Information',
      message: 'Company Name: ' + (user?.name || 'N/A') + '\nLocation: Lagos, Nigeria\nBusiness Type: Palm Oil Supplier',
      buttons: [
        {
          text: 'Edit',
          onPress: () => showAlert(alertHelpers.info('Edit', 'Edit functionality will open a form to update business details')),
        },
        { text: 'OK' },
      ],
    });
  };

  const handlePaymentSettings = (): void => {
    showAlert({
      type: 'info',
      title: 'Payment Settings',
      message: 'Configure your payment methods and bank account details for receiving payments.',
      buttons: [
        {
          text: 'Add Bank Account',
          onPress: () => showAlert(alertHelpers.info('Add Bank Account', 'Form to add bank account details will open here')),
        },
        {
          text: 'View Accounts',
          onPress: () => showAlert(alertHelpers.info('Bank Accounts', 'No bank accounts added yet')),
        },
        { text: 'Cancel', style: 'cancel' },
      ],
    });
  };

  const handleShippingOptions = (): void => {
    showAlert({
      type: 'info',
      title: 'Shipping Options',
      message: 'Set your shipping preferences and delivery areas.',
      buttons: [
        {
          text: 'Delivery Areas',
          onPress: () => showAlert(alertHelpers.info('Delivery Areas', 'Lagos, Abuja, Port Harcourt\n\nTap Edit to modify')),
        },
        {
          text: 'Shipping Rates',
          onPress: () => showAlert(alertHelpers.info('Shipping Rates', 'Standard: ₦10\nExpress: ₦25\n\nTap Edit to modify')),
        },
        { text: 'Cancel', style: 'cancel' },
      ],
    });
  };

  const handleNotifications = (): void => {
    showAlert({
      type: 'info',
      title: 'Notification Settings',
      message: 'Choose what notifications you want to receive.',
      buttons: [
        {
          text: 'Order Updates',
          onPress: () => showAlert(alertHelpers.info('Order Updates', 'Currently: ON\n\nGet notified about new orders and status changes')),
        },
        {
          text: 'Messages',
          onPress: () => showAlert(alertHelpers.info('Messages', 'Currently: ON\n\nGet notified about new messages from buyers')),
        },
        {
          text: 'Reviews',
          onPress: () => showAlert(alertHelpers.info('Reviews', 'Currently: ON\n\nGet notified about new product reviews')),
        },
        { text: 'Cancel', style: 'cancel' },
      ],
    });
  };

  const handlePrivacySecurity = (): void => {
    showAlert({
      type: 'info',
      title: 'Privacy & Security',
      message: 'Manage your account security and privacy settings.',
      buttons: [
        {
          text: 'Change Password',
          onPress: () => showAlert(alertHelpers.info('Change Password', 'Password change form will open here')),
        },
        {
          text: 'Two-Factor Auth',
          onPress: () => showAlert(alertHelpers.info('Two-Factor Authentication', 'Currently: OFF\n\nEnable 2FA for extra security')),
        },
        {
          text: 'Privacy Policy',
          onPress: () => showAlert(alertHelpers.info('Privacy Policy', 'View our privacy policy and data handling practices')),
        },
        { text: 'Cancel', style: 'cancel' },
      ],
    });
  };

  const handleHelpSupport = (): void => {
    showAlert({
      type: 'info',
      title: 'Help & Support',
      message: 'Get help with using LinkPalm',
      buttons: [
        {
          text: 'Contact Support',
          onPress: () => showAlert(alertHelpers.info('Contact Support', 'Email: support@linkpalm.com\nPhone: +234 XXX XXX XXXX\n\nSupport hours: 9AM - 5PM WAT')),
        },
        {
          text: 'FAQs',
          onPress: () => showAlert(alertHelpers.info('FAQs', 'Common questions:\n\n1. How do I add a listing?\n2. How do payments work?\n3. Shipping guidelines\n\n...and more')),
        },
        {
          text: 'Report Issue',
          onPress: () => showAlert(alertHelpers.info('Report Issue', 'Describe your issue and we\'ll get back to you within 24 hours')),
        },
        { text: 'Cancel', style: 'cancel' },
      ],
    });
  };

  const menuItems: MenuItem[] = [
    {
      id: '1',
      title: 'Business Information',
      icon: 'business-outline',
      iconColor: '#2196f3',
      onPress: handleBusinessInfo,
    },
    {
      id: '2',
      title: 'Payment Settings',
      icon: 'card-outline',
      iconColor: '#4caf50',
      onPress: handlePaymentSettings,
    },
    {
      id: '3',
      title: 'Shipping Options',
      icon: 'car-outline',
      iconColor: '#ff9800',
      onPress: handleShippingOptions,
    },
    {
      id: '4',
      title: 'Notifications',
      icon: 'notifications-outline',
      iconColor: '#e27a14',
      onPress: handleNotifications,
    },
    {
      id: '5',
      title: 'Privacy & Security',
      icon: 'lock-closed-outline',
      iconColor: '#9c27b0',
      onPress: handlePrivacySecurity,
    },
    {
      id: '6',
      title: 'Help & Support',
      icon: 'help-circle-outline',
      iconColor: '#607d8b',
      onPress: handleHelpSupport,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Custom Header with Back Button */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.editButton}
          onPress={handleEditProfile}
          activeOpacity={0.7}
        >
          <Ionicons name="create-outline" size={20} color="#e27a14" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <TouchableOpacity
              style={styles.avatar}
              onLongPress={profileImage ? handleRemoveImage : undefined}
              activeOpacity={0.8}
            >
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarText}>{getInitials(user?.name || 'Seller')}</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editAvatarButton}
              onPress={handleImagePicker}
              activeOpacity={0.7}
            >
              <Ionicons name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{user?.name || 'Seller'}</Text>
          <Text style={styles.email}>{user?.email || ''}</Text>
          <View style={styles.roleBadge}>
            <Ionicons name="checkmark-circle" size={14} color="#4caf50" />
            <Text style={styles.roleText}>Verified Seller</Text>
          </View>
        </View>

        {/* Business Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: '#e3f2fd' }]}>
                <Ionicons name="list-outline" size={24} color="#2196f3" />
              </View>
              <Text style={styles.statValue}>8</Text>
              <Text style={styles.statLabel}>Total Listings</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: '#f1f8f4' }]}>
                <Ionicons name="cash-outline" size={24} color="#4caf50" />
              </View>
              <Text style={styles.statValue}>₦12,450</Text>
              <Text style={styles.statLabel}>Total Sales</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: '#fff3e0' }]}>
                <Ionicons name="checkmark-circle-outline" size={24} color="#ff9800" />
              </View>
              <Text style={styles.statValue}>47</Text>
              <Text style={styles.statLabel}>Orders Completed</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: '#fffbf0' }]}>
                <Ionicons name="star-outline" size={24} color="#ffc107" />
              </View>
              <Text style={styles.statValue}>4.8</Text>
              <Text style={styles.statLabel}>Average Rating</Text>
            </View>
          </View>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <View style={styles.menuContainer}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemLeft}>
                  <View style={[styles.menuIconContainer, { backgroundColor: `${item.iconColor}15` }]}>
                    <Ionicons name={item.icon} size={20} color={item.iconColor} />
                  </View>
                  <Text style={styles.menuText}>{item.title}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ddd" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Logout Button */}
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="destructive"
          size="medium"
          icon="log-out-outline"
          iconPosition="left"
          style={styles.logoutButton}
        />

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  editButton: {
    padding: 4,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  profileHeader: {
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 32,
    paddingBottom: 24,
    marginBottom: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e27a14',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 46,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e27a14',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f8f4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4caf50',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '47%',
    backgroundColor: '#fafafa',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  menuContainer: {
    gap: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  logoutButton: {
    marginHorizontal: 20,
    marginTop: 24,
  },
});
