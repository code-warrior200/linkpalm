import React from 'react';
import RootNavigation from './navigation';
import { AlertProvider } from './contexts/AlertContext';

export default function App(): React.ReactElement {
  return (
    <AlertProvider>
      <RootNavigation />
    </AlertProvider>
  );
}
