import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function CartItemRow({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: item.image || 'https://via.placeholder.com/150' }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.price}>S/ {item.price.toFixed(2)}</Text>
        <View style={styles.actions}>
          <View style={styles.qtyBox}>
            <TouchableOpacity onPress={onDecrease} style={styles.btn}><Text style={styles.btnText}>-</Text></TouchableOpacity>
            <Text style={styles.qty}>{item.quantity}</Text>
            <TouchableOpacity onPress={onIncrease} style={styles.btn}><Text style={styles.btnText}>+</Text></TouchableOpacity>
          </View>
          <TouchableOpacity onPress={onRemove}>
            <Text style={styles.removeText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', backgroundColor: '#FFF', padding: 10, marginVertical: 6, borderRadius: 10, elevation: 1
  },
  image: { width: 80, height: 80, borderRadius: 8 },
  details: { flex: 1, marginLeft: 12, justifyContent: 'space-between' },
  name: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  price: { fontSize: 15, color: '#148F77', fontWeight: '600' },
  actions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  qtyBox: { flexDirection: 'row', alignItems: 'center' },
  btn: { backgroundColor: '#E0E0E0', width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontSize: 18, fontWeight: 'bold' },
  qty: { marginHorizontal: 12, fontSize: 16, fontWeight: 'bold' },
  removeText: { color: '#E74C3C', fontWeight: 'bold' }
});
