import React, { useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, RefreshControl } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useOrders } from '../../src/viewmodels/useOrders';

export default function OrdersScreen() {
  const { orders, loading, error, refresh } = useOrders();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Pedidos</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      
      {loading && orders.length === 0 ? (
        <ActivityIndicator size="large" color="#148F77" />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.header}>
                <Text style={styles.date}>{item.getFormattedDate()}</Text>
                <Text style={[styles.status, { color: item.getStatusColor() }]}>{item.status}</Text>
              </View>
              <Text style={styles.total}>S/ {item.total.toFixed(2)}</Text>
              <Text style={styles.address}>Envío a: {item.address}</Text>
              <Text style={styles.items}>{item.items.length} productos</Text>
            </View>
          )}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
          ListEmptyComponent={!loading && <Text style={styles.empty}>No tienes pedidos anteriores.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1A5276', marginBottom: 16 },
  card: { backgroundColor: '#FFF', padding: 16, borderRadius: 10, marginBottom: 12, elevation: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  date: { fontSize: 16, color: '#333', fontWeight: 'bold' },
  status: { fontSize: 14, fontWeight: 'bold', textTransform: 'capitalize' },
  total: { fontSize: 18, color: '#148F77', fontWeight: 'bold', marginVertical: 4 },
  address: { color: '#666', fontSize: 14 },
  items: { color: '#888', fontSize: 12, marginTop: 4 },
  error: { color: '#E74C3C', textAlign: 'center', marginBottom: 10 },
  empty: { textAlign: 'center', marginTop: 40, fontSize: 16, color: '#999' }
});
