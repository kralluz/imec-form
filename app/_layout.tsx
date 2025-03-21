// app/_layout.tsx
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PDFDataProvider } from './context/PDFDataContext';
import { AuthProvider } from './context/AuthContext';
import { QuestionnaireProvider } from './context/QuestionnaireContext';
import { UsersProvider } from './context/UsersContext';

export default function RootLayout() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).frameworkReady?.();
    }
  }, []);

  return (
    <PDFDataProvider>
      <AuthProvider>
        <QuestionnaireProvider>
          <UsersProvider>
            <Stack screenOptions={{ headerShown: false, animation: 'simple_push' }}>
              <Stack.Screen name="(auth)" options={{ presentation: 'modal' }} />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </UsersProvider>
        </QuestionnaireProvider>
      </AuthProvider>
    </PDFDataProvider>
  );
}
