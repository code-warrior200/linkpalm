import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SellerStackParamList } from '../types';
import Button from '../components/Button';

type CreateListingScreenNavigationProp = NativeStackNavigationProp<SellerStackParamList, 'CreateListing'>;

interface CreateListingScreenProps {
  navigation: CreateListingScreenNavigationProp;
}

const UNIT_OPTIONS = [
  '5L gallon',
  '10L container',
  '15L container',
  '20L keg',
  '25L keg',
  '50L drum',
  '200L drum',
];

export default function CreateListingScreen({
  navigation,
}: CreateListingScreenProps): React.ReactElement {
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState<string>('');
  const [pricePerUnit, setPricePerUnit] = useState<string>('');
  const [unit, setUnit] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [quantityAvailable, setQuantityAvailable] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [productImage, setProductImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showUnitPicker, setShowUnitPicker] = useState<boolean>(false);

  const requestImagePickerPermissions = async (): Promise<boolean> => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Sorry, we need camera roll permissions to upload product images!',
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
      'Select Product Image',
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
              aspect: [4, 3],
              quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
              setProductImage(result.assets[0].uri);
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
              aspect: [4, 3],
              quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
              setProductImage(result.assets[0].uri);
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
      'Remove Image',
      'Are you sure you want to remove this image?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setProductImage(null);
          },
        },
      ]
    );
  };

  const handleSubmit = async (): Promise<void> => {
    if (!title || !pricePerUnit || !unit || !location || !quantityAvailable) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    const price = parseFloat(pricePerUnit);
    if (isNaN(price) || price <= 0) {
      Alert.alert('Invalid Price', 'Please enter a valid price greater than 0.');
      return;
    }

    setIsSubmitting(true);
    // Simulate API call (in real app, upload image and create listing)
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);

    Alert.alert('Success', 'Your palm oil listing has been created successfully!', [
      {
        text: 'OK',
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  const renderInputField = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholder: string,
    icon: keyof typeof Ionicons.glyphMap,
    keyboardType: 'default' | 'numeric' = 'default',
    multiline: boolean = false,
    required: boolean = true
  ) => {
    const fieldId = label.toLowerCase().replace(/\s+/g, '-');
    const isFocused = focusedField === fieldId;
    const isEmpty = !value;

    return (
      <View style={styles.inputGroup}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
        </View>
        <View
          style={[
            styles.inputWrapper,
            isFocused && styles.inputWrapperFocused,
            isEmpty && !isFocused && styles.inputWrapperEmpty,
          ]}
        >
          <Ionicons
            name={icon}
            size={20}
            color={isFocused ? '#e27a14' : '#999'}
            style={styles.inputIcon}
          />
          <TextInput
            style={[styles.input, multiline && styles.inputMultiline]}
            placeholder={placeholder}
            placeholderTextColor="#999"
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            multiline={multiline}
            numberOfLines={multiline ? 4 : 1}
            onFocus={() => setFocusedField(fieldId)}
            onBlur={() => setFocusedField(null)}
          />
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>Create Listing</Text>
            <View style={styles.placeholder} />
          </View>
          <Text style={styles.headerSubtitle}>Add your palm oil listing to start selling</Text>
        </View>

        {/* Image Upload Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Product Image</Text>
          {productImage ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: productImage }} style={styles.productImage} />
              <View style={styles.imageOverlay}>
                <TouchableOpacity
                  style={styles.imageActionButton}
                  onPress={handleImagePicker}
                  activeOpacity={0.8}
                >
                  <Ionicons name="camera" size={20} color="#fff" />
                  <Text style={styles.imageActionText}>Change</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.imageActionButton, styles.removeButton]}
                  onPress={handleRemoveImage}
                  activeOpacity={0.8}
                >
                  <Ionicons name="trash" size={20} color="#fff" />
                  <Text style={styles.imageActionText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.imageUpload}
              onPress={handleImagePicker}
              activeOpacity={0.7}
            >
              <View style={styles.imageUploadContent}>
                <Ionicons name="camera-outline" size={32} color="#e27a14" />
                <Text style={styles.imageUploadText}>Add Product Photo</Text>
                <Text style={styles.imageUploadHint}>Tap to upload image</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Basic Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          {renderInputField(
            'Product Title',
            title,
            setTitle,
            'e.g. Premium Red Palm Oil - 25L',
            'pricetag-outline',
            'default',
            false,
            true
          )}

          {renderInputField(
            'Description',
            description,
            setDescription,
            'Describe your palm oil product...',
            'document-text-outline',
            'default',
            true,
            false
          )}
        </View>

        {/* Pricing Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing & Details</Text>
          <View style={styles.row}>
            <View style={styles.rowItem}>
              {renderInputField(
                'Price',
                pricePerUnit,
                setPricePerUnit,
                '0.00',
                'cash-outline',
                'numeric',
                false,
                true
              )}
            </View>
            <View style={styles.rowItem}>
              <View style={styles.inputGroup}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>
                    Unit <Text style={styles.required}>*</Text>
                  </Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.inputWrapper,
                    showUnitPicker && styles.inputWrapperFocused,
                    !unit && !showUnitPicker && styles.inputWrapperEmpty,
                  ]}
                  onPress={() => setShowUnitPicker(!showUnitPicker)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="cube-outline"
                    size={20}
                    color={showUnitPicker ? '#e27a14' : '#999'}
                    style={styles.inputIcon}
                  />
                  <Text style={[styles.input, !unit && styles.inputPlaceholder]}>
                    {unit || 'Select unit'}
                  </Text>
                  <Ionicons
                    name={showUnitPicker ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#999"
                  />
                </TouchableOpacity>
                {showUnitPicker && (
                  <View style={styles.unitPicker}>
                    {UNIT_OPTIONS.map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.unitOption,
                          unit === option && styles.unitOptionSelected,
                        ]}
                        onPress={() => {
                          setUnit(option);
                          setShowUnitPicker(false);
                        }}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.unitOptionText,
                            unit === option && styles.unitOptionTextSelected,
                          ]}
                        >
                          {option}
                        </Text>
                        {unit === option && (
                          <Ionicons name="checkmark" size={18} color="#e27a14" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Location & Inventory Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location & Inventory</Text>
          {renderInputField(
            'Location',
            location,
            setLocation,
            'e.g. Lagos, Nigeria',
            'location-outline',
            'default',
            false,
            true
          )}

          {renderInputField(
            'Quantity Available',
            quantityAvailable,
            setQuantityAvailable,
            'e.g. 200 kegs',
            'cube-outline',
            'default',
            false,
            true
          )}
        </View>

        {/* Submit Button */}
        <Button
          title="Create Listing"
          onPress={handleSubmit}
          variant="primary"
          size="large"
          loading={isSubmitting}
          disabled={isSubmitting}
          icon="checkmark-circle"
          iconPosition="left"
          fullWidth
          style={styles.submitButton}
        />

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  placeholder: {
    width: 32,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
  },
  imageUpload: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    borderRadius: 12,
    backgroundColor: '#fafafa',
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageUploadContent: {
    alignItems: 'center',
    gap: 8,
  },
  imageUploadText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
  },
  imageUploadHint: {
    fontSize: 12,
    color: '#999',
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    minHeight: 200,
    backgroundColor: '#f5f5f5',
  },
  productImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 12,
    gap: 8,
  },
  imageActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e27a14',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  removeButton: {
    backgroundColor: '#dc3545',
  },
  imageActionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  required: {
    color: '#e27a14',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    backgroundColor: '#fafafa',
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 52,
  },
  inputWrapperFocused: {
    borderColor: '#e27a14',
    backgroundColor: '#fff',
    shadowColor: '#e27a14',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  inputWrapperEmpty: {
    borderColor: '#e0e0e0',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    padding: 0,
  },
  inputPlaceholder: {
    color: '#999',
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  rowItem: {
    flex: 1,
  },
  unitPicker: {
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    maxHeight: 200,
  },
  unitOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  unitOptionSelected: {
    backgroundColor: '#fff5eb',
  },
  unitOptionText: {
    fontSize: 15,
    color: '#333',
  },
  unitOptionTextSelected: {
    color: '#e27a14',
    fontWeight: '600',
  },
  submitButton: {
    marginHorizontal: 20,
    marginTop: 24,
  },
});
