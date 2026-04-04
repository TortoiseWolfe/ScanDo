import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/theme/colors';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background.primary },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="+not-found"
          options={{
            headerShown: true,
            title: 'Not Found',
            headerStyle: { backgroundColor: colors.background.secondary },
            headerTintColor: colors.text.primary,
          }}
        />
      </Stack>
    </>
  );
}
