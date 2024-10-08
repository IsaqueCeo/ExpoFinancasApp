import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FinancialScreen({ navigation, route }) {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [saldoAtual, setSaldoAtual] = useState(0);

  const loadMovimentacoes = async () => {
    try {
      const movimentacoesSalvas = await AsyncStorage.getItem('MovimentacoesFinanceiras');
      if (movimentacoesSalvas) {
        setMovimentacoes(JSON.parse(movimentacoesSalvas));
      } else {
        setMovimentacoes([]); // Inicializa como array vazio caso não haja dados
      }

      const saldo = await AsyncStorage.getItem('SaldoAtual');
      setSaldoAtual(saldo ? parseFloat(saldo) : 0);
    } catch (error) {
      console.error('Erro ao carregar movimentações:', error);
    }
  };

  useEffect(() => {
    loadMovimentacoes();
  }, []);

  useEffect(() => {
    if (route.params?.novasMovimentacoes) {
      setMovimentacoes(route.params.novasMovimentacoes);
      AsyncStorage.setItem('MovimentacoesFinanceiras', JSON.stringify(route.params.novasMovimentacoes));
    }
  }, [route.params?.novasMovimentacoes]);

  const excluirMovimentacao = (movIndex, movItem) => {
    // Remove a movimentação e atualiza o saldo
    const novasMovimentacoes = [...movimentacoes];
    const [removed] = novasMovimentacoes[movIndex].items.splice(movItem, 1);

    // Atualiza o saldo
    const novoSaldo = removed.isEntry
      ? saldoAtual - parseFloat(removed.value)
      : saldoAtual + parseFloat(removed.value);

    // Atualiza o estado
    setMovimentacoes(novasMovimentacoes);
    setSaldoAtual(novoSaldo);

    // Salva as alterações no AsyncStorage
    AsyncStorage.setItem('MovimentacoesFinanceiras', JSON.stringify(novasMovimentacoes));
    AsyncStorage.setItem('SaldoAtual', novoSaldo.toString());
  };

  const renderMovimentacoes = ({ item, index: movIndex }) => (
    <View>
      <Text style={styles.date}>{item.date}</Text>
      <ScrollView style={styles.scrollArea}>
        {Array.isArray(item.items) ? item.items.map((mov, movItemIndex) => (
          <View key={movItemIndex} style={styles.movimentacaoContainer}>
            <Text style={styles.movimentacaoValue}>R$ {mov.value}</Text>
            <Text style={styles.movimentacaoDescription}>{mov.description}</Text>
            <View style={[styles.indicator, { backgroundColor: mov.isEntry ? 'green' : 'red' }]} />
            
            {/* Botão para excluir a movimentação */}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => excluirMovimentacao(movIndex, movItemIndex)}
            >
              <Text style={styles.deleteButtonText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )) : null}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={saldoAtual >= 0 ? ['#e5f8e0', '#f5fff5'] : ['#ffe6e6', '#fff5f5']}
        style={[styles.balanceContainer, { borderColor: saldoAtual >= 0 ? '#6FCF97' : '#ff6666' }]}
      >
        <Text style={styles.balanceTitle}>Saldo Atual</Text>
        <Text style={[styles.balance, { color: saldoAtual >= 0 ? 'green' : 'red' }]}>
          R$ {saldoAtual.toFixed(2)}
        </Text>
      </LinearGradient>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('Nova Movimentação')}
      >
        <Text style={styles.addButtonText}>+ Movimentação</Text>
      </TouchableOpacity>

      {movimentacoes.length === 0 ? (
        <Text style={styles.noDataText}>Nenhuma movimentação cadastrada.</Text>
      ) : (
        <FlatList
          data={movimentacoes}
          renderItem={renderMovimentacoes}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
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
    padding: 20,
    borderRadius: 10,
    borderWidth: 2,
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
  deleteButton: {
    backgroundColor: '#ff6666',
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  noDataText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
  },
});
