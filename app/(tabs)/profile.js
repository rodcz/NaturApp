import React from 'react';
import { View, Text, Switch, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useProfile } from '../../src/viewmodels/useProfile';

export default function ProfileScreen() {
  const {
    name, setName, email, setEmail,
    darkTheme, notifications,
    saveProfile, toggleTheme, toggleNotifications
  } = useProfile();

  const handleSave = async () => {
    await saveProfile();
    Alert.alert('Éxito', 'Perfil actualizado correctamente');
  };

  return (
    <View style={[styles.container, darkTheme && styles.containerDark]}>
      <Text style={[styles.title, darkTheme && styles.textDark]}>Mi Perfil</Text>
      
      <View style={styles.section}>
        <Text style={[styles.label, darkTheme && styles.textDark]}>Nombre:</Text>
        <TextInput 
          style={[styles.input, darkTheme && styles.inputDark]} 
          value={name} 
          onChangeText={setName} 
          placeholder="Tu nombre" 
        />
        
        <Text style={[styles.label, darkTheme && styles.textDark]}>Correo:</Text>
        <TextInput 
          style={[styles.input, darkTheme && styles.inputDark]} 
          value={email} 
          onChangeText={setEmail} 
          placeholder="Tu correo" 
          keyboardType="email-address" 
        />
        
        <TouchableOpacity style={styles.btn} onPress={handleSave}>
          <Text style={styles.btnText}>Guardar Cambios</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, darkTheme && styles.textDark]}>Preferencias</Text>
        <View style={styles.row}>
          <Text style={[styles.prefText, darkTheme && styles.textDark]}>Tema Oscuro</Text>
          <Switch value={darkTheme} onValueChange={toggleTheme} />
        </View>
        <View style={styles.row}>
          <Text style={[styles.prefText, darkTheme && styles.textDark]}>Notificaciones</Text>
          <Switch value={notifications} onValueChange={toggleNotifications} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 16 },
  containerDark: { backgroundColor: '#2C3E50' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1A5276', marginBottom: 20 },
  textDark: { color: '#FFF' },
  section: { backgroundColor: '#FFF', padding: 16, borderRadius: 10, marginBottom: 20, elevation: 1 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#333' },
  label: { fontSize: 14, color: '#555', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 10, marginBottom: 16, fontSize: 16 },
  inputDark: { backgroundColor: '#34495E', color: '#FFF', borderColor: '#2C3E50' },
  btn: { backgroundColor: '#148F77', padding: 12, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8 },
  prefText: { fontSize: 16, color: '#333' }
});
