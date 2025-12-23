import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

export type AlertType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

export interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface AlertProps {
  visible: boolean;
  type?: AlertType;
  title: string;
  message: string;
  buttons?: AlertButton[];
  onDismiss?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}

const ALERT_CONFIGS = {
  success: {
    icon: 'checkmark-circle' as keyof typeof Ionicons.glyphMap,
    color: '#10b981',
    backgroundColor: '#d1fae5',
  },
  error: {
    icon: 'close-circle' as keyof typeof Ionicons.glyphMap,
    color: '#ef4444',
    backgroundColor: '#fee2e2',
  },
  warning: {
    icon: 'warning' as keyof typeof Ionicons.glyphMap,
    color: '#f59e0b',
    backgroundColor: '#fef3c7',
  },
  info: {
    icon: 'information-circle' as keyof typeof Ionicons.glyphMap,
    color: '#3b82f6',
    backgroundColor: '#dbeafe',
  },
  confirm: {
    icon: 'help-circle' as keyof typeof Ionicons.glyphMap,
    color: '#8b5cf6',
    backgroundColor: '#ede9fe',
  },
};

export default function Alert({
  visible,
  type = 'info',
  title,
  message,
  buttons = [{ text: 'OK', style: 'default' }],
  onDismiss,
  icon,
}: AlertProps): React.ReactElement {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const config = ALERT_CONFIGS[type];
  const displayIcon = icon || config.icon;

  const handleButtonPress = (button: AlertButton) => {
    if (button.onPress) {
      button.onPress();
    }
    if (onDismiss) {
      onDismiss();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />
        
        <Animated.View
          style={[
            styles.alertContainer,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          {/* Icon */}
          <View style={[styles.iconContainer, { backgroundColor: config.backgroundColor }]}>
            <Ionicons name={displayIcon} size={48} color={config.color} />
          </View>

          {/* Content */}
          <View style={styles.contentContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {buttons.map((button, index) => {
              const isDestructive = button.style === 'destructive';
              const isCancel = button.style === 'cancel';
              const isLast = index === buttons.length - 1;

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.button,
                    isDestructive && styles.destructiveButton,
                    isCancel && styles.cancelButton,
                    !isLast && styles.buttonWithBorder,
                  ]}
                  onPress={() => handleButtonPress(button)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      isDestructive && styles.destructiveButtonText,
                      isCancel && styles.cancelButtonText,
                      !isCancel && !isDestructive && styles.defaultButtonText,
                    ]}
                  >
                    {button.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  alertContainer: {
    width: width - 80,
    maxWidth: 340,
    backgroundColor: '#fff',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 20,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonWithBorder: {
    borderRightWidth: 1,
    borderRightColor: '#f3f4f6',
  },
  destructiveButton: {
    backgroundColor: '#fef2f2',
  },
  cancelButton: {
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  defaultButtonText: {
    color: '#e27a14',
  },
  destructiveButtonText: {
    color: '#ef4444',
  },
  cancelButtonText: {
    color: '#6b7280',
  },
});

