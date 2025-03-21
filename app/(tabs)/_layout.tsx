// app/(tabs)/_layout.tsx
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function TabsLayout() {
  return (
    <ProtectedRoute>
      <Stack>
        <Stack.Screen name="index" />
        <Stack.Screen name="forms" />
        <Stack.Screen name="technicians" />
        <Stack.Screen name="questionnaires" />
        <Stack.Screen
          name="settings"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="form/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="consent/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="success" options={{ presentation: 'modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ProtectedRoute>
  );
}
