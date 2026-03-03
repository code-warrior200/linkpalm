import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import type { alertHelpers, AlertOptions } from '../contexts/AlertContext';

export interface UseImagePickerOptions {
  aspect?: [number, number];
  title?: string;
  permissionMessage?: string;
  cameraPermissionMessage?: string;
}

export function createImagePickerHandlers(
  showAlert: (options: AlertOptions) => void,
  alertHelpersObj: typeof alertHelpers,
  setImage: (uri: string | null) => void,
  options: UseImagePickerOptions = {}
) {
  const {
    aspect = [1, 1],
    title = 'Select Image',
    permissionMessage = 'Sorry, we need camera roll permissions to upload images!',
    cameraPermissionMessage = 'Sorry, we need camera permissions to take photos!',
  } = options;

  const requestMediaLibraryPermissions = async (): Promise<boolean> => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        showAlert(alertHelpersObj.warning('Permission Required', permissionMessage));
        return false;
      }
    }
    return true;
  };

  const requestCameraPermissions = async (): Promise<boolean> => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        showAlert(alertHelpersObj.warning('Permission Required', cameraPermissionMessage));
        return false;
      }
    }
    return true;
  };

  const pickImage = async (): Promise<void> => {
    showAlert({
      type: 'info',
      title,
      message: 'Choose an option',
      buttons: [
        {
          text: 'Camera',
          onPress: async () => {
            const hasPermission = await requestCameraPermissions();
            if (!hasPermission) return;
            const result = await ImagePicker.launchCameraAsync({
              // @ts-expect-error - expo-image-picker mediaType API
              mediaType: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect,
              quality: 0.8,
            });
            if (!result.canceled && result.assets[0]) {
              setImage(result.assets[0].uri);
            }
          },
        },
        {
          text: 'Photo Library',
          onPress: async () => {
            const hasPermission = await requestMediaLibraryPermissions();
            if (!hasPermission) return;
            const result = await ImagePicker.launchImageLibraryAsync({
              // @ts-expect-error - expo-image-picker mediaType API
              mediaType: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect,
              quality: 0.8,
            });
            if (!result.canceled && result.assets[0]) {
              setImage(result.assets[0].uri);
            }
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ],
    });
  };

  return { pickImage, requestMediaLibraryPermissions, requestCameraPermissions };
}
