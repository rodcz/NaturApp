import { useEffect } from 'react';
import { Stack } from 'expo-router';
import DatabaseService from '../src/services/databaseService';

export default function RootLayout() {
  useEffect(() => {
    // Inicializar SQLite al arrancar la app
    const initDB = async () => {
      try {
        await DatabaseService.init();
        console.log('DB Lista desde _layout');
      } catch (err) {
        console.error('Error crítico inicializando DB:', err);
      }
    };

    initDB();
  }, []);

  return (
    <Stack screenOptions={{
      headerStyle: { backgroundColor: '#1A5276' },
      headerTintColor: '#FFF',
    }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="product/[id]" options={{ title: 'Detalle' }} />
    </Stack>
  );
}
