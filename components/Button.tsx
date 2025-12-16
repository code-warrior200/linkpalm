import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text' | 'destructive';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
}: ButtonProps): React.ReactElement {
  const getButtonStyle = (): ViewStyle[] => {
    const baseStyle: ViewStyle[] = [styles.button, styles[`button_${size}`]];
    
    if (fullWidth) {
      baseStyle.push(styles.buttonFullWidth);
    }

    // Variant styles
    switch (variant) {
      case 'primary':
        baseStyle.push(styles.buttonPrimary);
        break;
      case 'secondary':
        baseStyle.push(styles.buttonSecondary);
        break;
      case 'outline':
        baseStyle.push(styles.buttonOutline);
        break;
      case 'text':
        baseStyle.push(styles.buttonText);
        break;
      case 'destructive':
        baseStyle.push(styles.buttonDestructive);
        break;
    }

    if (disabled || loading) {
      baseStyle.push(styles.buttonDisabled);
    }

    if (style) {
      baseStyle.push(style);
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle[] => {
    const baseStyle: TextStyle[] = [styles.text, styles[`text_${size}`]];

    switch (variant) {
      case 'primary':
        baseStyle.push(styles.textPrimary);
        break;
      case 'secondary':
        baseStyle.push(styles.textSecondary);
        break;
      case 'outline':
        baseStyle.push(styles.textOutline);
        break;
      case 'text':
        baseStyle.push(styles.textText);
        break;
      case 'destructive':
        baseStyle.push(styles.textDestructive);
        break;
    }

    if (textStyle) {
      baseStyle.push(textStyle);
    }

    return baseStyle;
  };

  const getIconColor = (): string => {
    if (disabled || loading) {
      return variant === 'primary' || variant === 'destructive' ? '#fff' : '#999';
    }

    switch (variant) {
      case 'primary':
      case 'destructive':
        return '#fff';
      case 'secondary':
      case 'outline':
        return '#e27a14';
      case 'text':
        return '#e27a14';
      default:
        return '#fff';
    }
  };

  const getIconSize = (): number => {
    switch (size) {
      case 'small':
        return 16;
      case 'large':
        return 24;
      default:
        return 20;
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          color={variant === 'primary' || variant === 'destructive' ? '#fff' : '#e27a14'}
          size={size === 'small' ? 'small' : 'small'}
        />
      );
    }

    const iconElement = icon ? (
      <Ionicons name={icon} size={getIconSize()} color={getIconColor()} />
    ) : null;

    return (
      <>
        {icon && iconPosition === 'left' && (
          <View style={{ marginRight: 8 }}>{iconElement}</View>
        )}
        <Text style={getTextStyle()}>{title}</Text>
        {icon && iconPosition === 'right' && (
          <View style={{ marginLeft: 8 }}>{iconElement}</View>
        )}
      </>
    );
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {renderContent()}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  button_small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  button_medium: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  button_large: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  buttonFullWidth: {
    width: '100%',
  },
  buttonPrimary: {
    backgroundColor: '#e27a14',
    shadowColor: '#e27a14',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonSecondary: {
    backgroundColor: '#fff5eb',
    borderWidth: 1,
    borderColor: '#e27a14',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#e27a14',
  },
  buttonText: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  buttonDestructive: {
    backgroundColor: '#dc3545',
    shadowColor: '#dc3545',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  text: {
    fontWeight: '600',
  },
  text_small: {
    fontSize: 13,
  },
  text_medium: {
    fontSize: 16,
  },
  text_large: {
    fontSize: 18,
    fontWeight: '700',
  },
  textPrimary: {
    color: '#fff',
  },
  textSecondary: {
    color: '#e27a14',
  },
  textOutline: {
    color: '#e27a14',
  },
  textText: {
    color: '#e27a14',
  },
  textDestructive: {
    color: '#fff',
  },
});

