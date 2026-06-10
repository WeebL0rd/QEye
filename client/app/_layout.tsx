import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../src/context/AuthContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="edit-questionnaire" options={{ headerShown: true, title: 'Editar cuestionario' }} />
          <Stack.Screen name="create-questionnaire" options={{ headerShown: true, title: 'Nuevo cuestionario' }} />
        </Stack>
      </AuthProvider>
    </SafeAreaProvider>
  );
}