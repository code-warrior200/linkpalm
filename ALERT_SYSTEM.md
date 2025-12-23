# Custom Alert System Documentation

## Overview

LinkPalm now features a beautiful, reusable custom Alert component with an intuitive UI that replaces React Native's default `Alert.alert()` throughout the entire app.

## Features

✨ **Beautiful UI Design**
- Smooth animations (scale & fade)
- Blur backdrop for focus
- Color-coded icons for each alert type
- Modern rounded corners and shadows
- Responsive button layout

🎨 **5 Alert Types**
- **Success** (✅ Green) - Confirmations, completions
- **Error** (❌ Red) - Failures, critical issues
- **Warning** (⚠️ Orange) - Cautions, missing info
- **Info** (ℹ️ Blue) - Information, help text
- **Confirm** (❓ Purple) - Yes/No questions

🔘 **3 Button Styles**
- **Default** - Primary action (orange theme color)
- **Cancel** - Secondary/dismiss (gray)
- **Destructive** - Dangerous actions (red)

## Architecture

### Files Created

```
components/Alert.tsx           # Main Alert component
contexts/AlertContext.tsx     # Context provider & hooks
App.tsx                       # Wrapped with AlertProvider
```

### Updated Files (10 screens)

All screens now use the custom alert:
- `PlaceOrderScreen.tsx` ✅
- `SellerProfileScreen.tsx` ✅
- `BuyerProfileScreen.tsx` ✅
- `BuyerOrdersScreen.tsx` ✅
- `ListingDetailsScreen.tsx` ✅
- `NotificationsScreen.tsx` ✅
- `LoginScreen.tsx` ✅
- `SignUpScreen.tsx` ✅
- `ReviewListingScreen.tsx` ✅
- `CreateListingScreen.tsx` ✅

## Usage

### Basic Usage

```typescript
import { useAlert, alertHelpers } from '../contexts/AlertContext';

function MyScreen() {
  const { showAlert } = useAlert();

  // Simple success alert
  const handleSuccess = () => {
    showAlert(alertHelpers.success(
      'Success!',
      'Your order has been placed successfully.'
    ));
  };

  // Alert with callback
  const handleDelete = () => {
    showAlert(alertHelpers.delete(
      'Delete Item',
      'Are you sure? This cannot be undone.',
      () => console.log('Deleted!'),
      () => console.log('Cancelled')
    ));
  };
}
```

### Helper Functions

```typescript
// Success alert
alertHelpers.success(title, message, onOk?)

// Error alert
alertHelpers.error(title, message, onOk?)

// Warning alert
alertHelpers.warning(title, message, onOk?)

// Info alert
alertHelpers.info(title, message, onOk?)

// Confirm dialog
alertHelpers.confirm(title, message, onConfirm?, onCancel?)

// Delete confirmation
alertHelpers.delete(title, message, onDelete?, onCancel?)
```

### Advanced Usage

```typescript
// Custom alert with multiple buttons
showAlert({
  type: 'info',
  title: 'Edit Profile',
  message: 'What would you like to edit?',
  buttons: [
    {
      text: 'Edit Name',
      onPress: () => console.log('Edit name'),
    },
    {
      text: 'Edit Email',
      onPress: () => console.log('Edit email'),
    },
    {
      text: 'Edit Phone',
      onPress: () => console.log('Edit phone'),
    },
    { text: 'Cancel', style: 'cancel' },
  ],
});

// Custom icon
showAlert({
  type: 'success',
  title: 'Welcome!',
  message: 'Thanks for joining LinkPalm',
  icon: 'heart',  // Any Ionicons name
  buttons: [{ text: 'Get Started' }],
});
```

## Migration Pattern

**Before:**
```typescript
import { Alert } from 'react-native';

Alert.alert('Title', 'Message');

Alert.alert('Confirm', 'Are you sure?', [
  { text: 'Cancel', style: 'cancel' },
  { text: 'OK', onPress: () => doSomething() },
]);
```

**After:**
```typescript
import { useAlert, alertHelpers } from '../contexts/AlertContext';

const { showAlert } = useAlert();

showAlert(alertHelpers.info('Title', 'Message'));

showAlert(alertHelpers.confirm(
  'Confirm',
  'Are you sure?',
  () => doSomething()
));
```

## Examples from LinkPalm

### Order Confirmation (Success)
```typescript
showAlert(alertHelpers.success(
  'Order Placed!',
  `Your order (${orderNumber}) has been placed successfully.`,
  () => navigation.navigate('BrowseHome')
));
```

### Missing Form Fields (Warning)
```typescript
showAlert(alertHelpers.warning(
  'Missing Information',
  'Please provide delivery address and contact phone.'
));
```

### Login Error (Error)
```typescript
showAlert(alertHelpers.error(
  'Login Failed',
  error.message || 'Invalid credentials'
));
```

### Delete Confirmation (Destructive)
```typescript
showAlert(alertHelpers.delete(
  'Remove Profile Picture',
  'Are you sure you want to remove your profile picture?',
  () => setProfileImage(null)
));
```

### Permission Request (Info)
```typescript
showAlert(alertHelpers.info(
  'Select Profile Picture',
  'Choose an option',
));
```

### Logout Confirmation
```typescript
showAlert({
  type: 'confirm',
  title: 'Logout',
  message: 'Are you sure you want to logout?',
  buttons: [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Logout', style: 'destructive', onPress: logout },
  ],
});
```

## Design Specifications

### Colors
- **Success**: `#10b981` (Green 500)
- **Error**: `#ef4444` (Red 500)
- **Warning**: `#f59e0b` (Amber 500)
- **Info**: `#3b82f6` (Blue 500)
- **Confirm**: `#8b5cf6` (Violet 500)
- **Theme**: `#e27a14` (LinkPalm Orange)

### Typography
- **Title**: 20px, Bold (700)
- **Message**: 15px, Regular, Line height 22px
- **Button**: 16px, Semibold (600)

### Spacing
- **Modal Width**: Screen width - 80px (max 340px)
- **Border Radius**: 24px
- **Icon Container**: 48px icon, 32px padding
- **Button Height**: 48px (16px padding)

### Animations
- **Scale**: 0 → 1 (spring animation)
- **Opacity**: 0 → 1 (200ms)
- **Tension**: 50
- **Friction**: 7

## Benefits

1. **Consistent UX** - Same look and feel across all alerts
2. **Beautiful Design** - Modern, polished UI with animations
3. **Type Safety** - Full TypeScript support
4. **Easy to Use** - Simple helper functions
5. **Flexible** - Supports custom icons, multiple buttons
6. **Accessible** - Clear visual hierarchy and feedback
7. **Maintainable** - Centralized alert logic

## Technical Details

### Dependencies
- `expo-blur` - BlurView backdrop
- `@expo/vector-icons` - Ionicons
- `react-native-safe-area-context` - Safe area handling

### State Management
- Uses React Context API
- Single alert instance (modal overlay)
- Queue support (one alert at a time)

### Performance
- Optimized animations with `useNativeDriver`
- Memoized callbacks
- Minimal re-renders

## Future Enhancements

- [ ] Alert queue system (show multiple alerts sequentially)
- [ ] Toast notifications (auto-dismiss)
- [ ] Custom sound effects
- [ ] Haptic feedback integration
- [ ] Dark mode support
- [ ] Animation customization options

---

**Created**: December 2024
**Version**: 1.0.0 (MVP)

