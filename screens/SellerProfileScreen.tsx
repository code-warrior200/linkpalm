import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
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

  const handleLogout = (): void => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
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
        Alert.alert(
          'Permission Required',
          'Sorry, we need camera roll permissions to upload your profile picture!',
          [{ text: 'OK' }]
        );
        return false;
      }
    }
    return true;
  };

  const requestCameraPermissions = async (): Promise<boolean> => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Sorry, we need camera permissions to take photos!',
          [{ text: 'OK' }]
        );
        return false;
      }
    }
    return true;
  };

  const handleImagePicker = async (): Promise<void> => {
    Alert.alert(
      'Select Profile Picture',
      'Choose an option',
      [
        {
          text: 'Camera',
          onPress: async () => {
            const hasPermission = await requestCameraPermissions();
            if (!hasPermission) return;

            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const handleRemoveImage = (): void => {
    Alert.alert(
      'Remove Profile Picture',
      'Are you sure you want to remove your profile picture?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setProfileImage(null);
          },
        },
      ]
    );
  };

  const menuItems: MenuItem[] = [
    {
      id: '1',
      title: 'Business Information',
      icon: 'business-outline',
      iconColor: '#2196f3',
      onPress: () => Alert.alert('Business Information', 'Business information settings'),
    },
    {
      id: '2',
      title: 'Payment Settings',
      icon: 'card-outline',
      iconColor: '#4caf50',
      onPress: () => Alert.alert('Payment Settings', 'Payment settings'),
    },
    {
      id: '3',
      title: 'Shipping Options',
      icon: 'car-outline',
      iconColor: '#ff9800',
      onPress: () => Alert.alert('Shipping Options', 'Shipping options'),
    },
    {
      id: '4',
      title: 'Notifications',
      icon: 'notifications-outline',
      iconColor: '#e27a14',
      onPress: () => Alert.alert('Notifications', 'Notification settings'),
    },
    {
      id: '5',
      title: 'Privacy & Security',
      icon: 'lock-closed-outline',
      iconColor: '#9c27b0',
      onPress: () => Alert.alert('Privacy & Security', 'Privacy and security settings'),
    },
    {
      id: '6',
      title: 'Help & Support',
      icon: 'help-circle-outline',
      iconColor: '#607d8b',
      onPress: () => Alert.alert('Help & Support', 'Get help and support'),
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
          onPress={() => Alert.alert('Edit Profile', 'Edit profile functionality')}
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
              <Text style={styles.statValue}>$12,450</Text>
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
