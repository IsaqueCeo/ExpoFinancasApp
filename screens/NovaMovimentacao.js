import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NovaMovimentacaoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nova Movimentação</Text>
      {/* Aqui você vai adicionar os inputs para nova movimentação */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
