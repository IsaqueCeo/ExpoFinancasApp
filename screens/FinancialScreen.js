import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const movimentacoes = [
  {
    id: '1',
    date: '12.08.22',
    items: [
      { description: 'Hambúrguer', value: '-14,00', isEntry: false },
      { description: 'Receita xyz', value: '+10,00', isEntry: true },
      { description: 'Receita abc', value: '+12:30', isEntry: true },
    ]
  },
  {
    id: '2',
    date: '11.08.22',
    items: [
      { description: 'Supermercado', value: '-190,10', isEntry: false },
      { description: 'Combustível', value: '-50,12', isEntry: false },
      { description: 'Padaria', value: '-5,10', isEntry: false },
      { description: 'Salário', value: '+1600,00', isEntry: true },
    ]
  },
];

export default function App() {
  const renderMovimentacoes = ({ item }) => (
    <View>
      <Text style={styles.date}>{item.date}</Text>
      {item.items.map((mov, index) => (
        <View key={index} style={styles.movimentacaoContainer}>
          <Text style={styles.movimentacaoValue}>{mov.value}</Text>
          <Text style={styles.movimentacaoDescription}>{mov.description}</Text>
          <View style={[styles.indicator, { backgroundColor: mov.isEntry ? 'green' : 'red' }]} />
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Saldo Atual */}
      <LinearGradient colors={['#e5f8e0', '#f5fff5']} style={styles.balanceContainer}>
        <Text style={styles.balanceTitle}>Saldo Atual</Text>
        <Text style={styles.balance}>R$ 97,25</Text>
      </LinearGradient>

      {/* Botão de Movimentação */}
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Movimentação</Text>
      </TouchableOpacity>

      {/* Lista de Movimentações */}
      <FlatList
        data={movimentacoes}
        renderItem={renderMovimentacoes}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  balanceContainer: {
    backgroundColor: '#f5fff5',
    padding: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#6FCF97',
    alignItems: 'center',
    marginBottom: 20,
  },
  balanceTitle: {
    fontSize: 16,
    color: '#333',
  },
  balance: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  date: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  movimentacaoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 10,
  },
  movimentacaoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  movimentacaoDescription: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginLeft: 10,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
