import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function CategoryChip({ label, active, onPress }) {
  return (
    <TouchableOpacity 
      style={[styles.chip, active && styles.chipActive]} 
      onPress={onPress}
    >
      <Text style={[styles.text, active && styles.textActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  chipActive: {
    backgroundColor: '#148F77',
  },
  text: {
    fontSize: 14,
    color: '#333',
    textTransform: 'capitalize'
  },
  textActive: {
    color: '#FFF',
    fontWeight: 'bold'
  }
});
