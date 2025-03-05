// app/_layout.tsx
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PDFDataProvider } from './context/PDFDataContext';

export default function RootLayout() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).frameworkReady?.();
    }
  }, []);

  return (
    <PDFDataProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="technicians" />
        <Stack.Screen name="questionnaires" />
        <Stack.Screen name="form/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="consent/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="success" options={{ presentation: 'modal' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </PDFDataProvider>
  );
}
