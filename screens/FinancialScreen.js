import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FinancialScreen({ navigation }) {
  const [movimentacoes, setMovimentacoes] = useState([]);

  // Função para carregar as movimentações do AsyncStorage
  const loadMovimentacoes = async () => {
    try {
      const movimentacoesSalvas = await AsyncStorage.getItem('MovimentacoesFinanceiras');
      if (movimentacoesSalvas) {
        setMovimentacoes(JSON.parse(movimentacoesSalvas));
      }
    } catch (error) {
      console.error('Erro ao carregar movimentações:', error);
    }
  };

  // UseEffect para carregar movimentações ao montar a tela
  useEffect(() => {
    loadMovimentacoes();
  }, []);

  // Função para renderizar as movimentações
  const renderMovimentacoes = ({ item }) => (
    <View>
      <Text style={styles.date}>{item.date}</Text>
      <ScrollView style={styles.scrollArea}>
        {item.items.map((mov, index) => (
          <View key={index} style={styles.movimentacaoContainer}>
            <Text style={styles.movimentacaoValue}>{mov.value}</Text>
            <Text style={styles.movimentacaoDescription}>{mov.description}</Text>
            <View style={[styles.indicator, { backgroundColor: mov.isEntry ? 'green' : 'red' }]} />
          </View>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#e5f8e0', '#f5fff5']} style={styles.balanceContainer}>
        <Text style={styles.balanceTitle}>Saldo Atual</Text>
        <Text style={styles.balance}>R$ 97,25</Text>
      </LinearGradient>

      {/* Botão para adicionar nova movimentação */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('Nova Movimentação')}
      >
        <Text style={styles.addButtonText}>+ Movimentação</Text>
      </TouchableOpacity>

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
  scrollArea: {
    maxHeight: 150,
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
