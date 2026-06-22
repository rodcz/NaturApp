import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ApiService from '../../src/services/apiService';
import { useCart } from '../../src/viewmodels/useCart';
import { Product } from '../../src/models/Product';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const router = useRouter();

  useEffect(() => {
    ApiService.getProductById(id)
      .then(data => setProduct(Product.fromJSON(data)))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addItem(product);
      alert(`${product.name} agregado al carrito`);
      router.back();
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#148F77" style={styles.center} />;
  if (!product) return <Text style={styles.center}>Producto no encontrado.</Text>;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.image || 'https://via.placeholder.com/400' }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>{product.getFormattedPrice()}</Text>
        
        <Text style={styles.descTitle}>Descripción</Text>
        <Text style={styles.description}>{product.description}</Text>
        
        {product.benefits && product.benefits.length > 0 && (
          <>
            <Text style={styles.descTitle}>Beneficios</Text>
            {product.benefits.map((b, i) => <Text key={i} style={styles.bullet}>• {b}</Text>)}
          </>
        )}

        <TouchableOpacity style={styles.addBtn} onPress={handleAddToCart}>
          <Text style={styles.addBtnText}>Agregar al Carrito</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: 300 },
  content: { padding: 20 },
  category: { color: '#888', textTransform: 'uppercase', fontWeight: 'bold', fontSize: 12 },
  name: { fontSize: 24, fontWeight: 'bold', color: '#333', marginVertical: 8 },
  price: { fontSize: 22, color: '#148F77', fontWeight: 'bold', marginBottom: 16 },
  descTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A5276', marginTop: 16, marginBottom: 8 },
  description: { fontSize: 15, color: '#555', lineHeight: 22 },
  bullet: { fontSize: 15, color: '#555', marginVertical: 2, paddingLeft: 10 },
  addBtn: { backgroundColor: '#148F77', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 30, marginBottom: 40 },
  addBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});
