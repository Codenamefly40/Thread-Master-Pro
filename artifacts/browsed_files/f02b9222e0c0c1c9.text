import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#0A0A0A' },
          headerTintColor: '#F3F4F6',
          headerTitleStyle: { color: '#F3F4F6', fontWeight: '700' },
          contentStyle: { backgroundColor: '#0A0A0A' },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="threads" options={{ title: 'Select Thread' }} />
        <Stack.Screen name="pipe" options={{ title: 'Pipe Threads' }} />
        <Stack.Screen name="spec" options={{ title: 'Thread Spec' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
