import React, { createContext, useContext, useState, useCallback } from 'react';
import Alert, { AlertType, AlertButton } from '../components/Alert';

interface AlertOptions {
  type?: AlertType;
  title: string;
  message: string;
  buttons?: AlertButton[];
  icon?: keyof typeof import('@expo/vector-icons').Ionicons.glyphMap;
}

interface AlertContextType {
  showAlert: (options: AlertOptions) => void;
  hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertOptions, setAlertOptions] = useState<AlertOptions>({
    title: '',
    message: '',
    type: 'info',
  });

  const showAlert = useCallback((options: AlertOptions) => {
    setAlertOptions(options);
    setAlertVisible(true);
  }, []);

  const hideAlert = useCallback(() => {
    setAlertVisible(false);
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      <Alert
        visible={alertVisible}
        type={alertOptions.type}
        title={alertOptions.title}
        message={alertOptions.message}
        buttons={alertOptions.buttons}
        icon={alertOptions.icon}
        onDismiss={hideAlert}
      />
    </AlertContext.Provider>
  );
}

export function useAlert(): AlertContextType {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
}

// Convenience functions for common alert types
export const alertHelpers = {
  success: (title: string, message: string, onOk?: () => void) => ({
    type: 'success' as AlertType,
    title,
    message,
    buttons: [{ text: 'OK', onPress: onOk }],
  }),
  
  error: (title: string, message: string, onOk?: () => void) => ({
    type: 'error' as AlertType,
    title,
    message,
    buttons: [{ text: 'OK', onPress: onOk }],
  }),
  
  warning: (title: string, message: string, onOk?: () => void) => ({
    type: 'warning' as AlertType,
    title,
    message,
    buttons: [{ text: 'OK', onPress: onOk }],
  }),
  
  info: (title: string, message: string, onOk?: () => void) => ({
    type: 'info' as AlertType,
    title,
    message,
    buttons: [{ text: 'OK', onPress: onOk }],
  }),
  
  confirm: (title: string, message: string, onConfirm?: () => void, onCancel?: () => void) => ({
    type: 'confirm' as AlertType,
    title,
    message,
    buttons: [
      { text: 'Cancel', style: 'cancel' as const, onPress: onCancel },
      { text: 'Confirm', onPress: onConfirm },
    ],
  }),
  
  delete: (title: string, message: string, onDelete?: () => void, onCancel?: () => void) => ({
    type: 'warning' as AlertType,
    title,
    message,
    buttons: [
      { text: 'Cancel', style: 'cancel' as const, onPress: onCancel },
      { text: 'Delete', style: 'destructive' as const, onPress: onDelete },
    ],
  }),
};

