import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function FinancialScreen({ navigation, route }) {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [saldoAtual, setSaldoAtual] = useState(0);

  const loadMovimentacoes = async () => {
    try {
      const movimentacoesSalvas = await AsyncStorage.getItem('MovimentacoesFinanceiras');
      if (movimentacoesSalvas) {
        const parsedMovimentacoes = JSON.parse(movimentacoesSalvas);
        setMovimentacoes(parsedMovimentacoes);
        calcularSaldo(parsedMovimentacoes);
      } else {
        setMovimentacoes([]);
        setSaldoAtual(0);
      }
    } catch (error) {
      console.error('Erro ao carregar movimentações:', error);
    }
  };

  const calcularSaldo = (movs = []) => {
    if (!Array.isArray(movs)) {
      movs = [];
    }
  
    const saldo = movs.reduce((acc, item) => {
      if (!Array.isArray(item.items)) {
        item.items = [];
      }
  
      const totalMovItem = item.items.reduce((itemAcc, mov) => {
        return itemAcc + (mov.isEntry ? parseFloat(mov.value) : -parseFloat(mov.value));
      }, 0);
  
      return acc + totalMovItem;
    }, 0);
  
    setSaldoAtual(saldo);
    AsyncStorage.setItem('SaldoAtual', saldo.toString());
  };

  useFocusEffect(
    useCallback(() => {
      loadMovimentacoes();
    }, [])
  );

  useEffect(() => {
    if (route.params?.novasMovimentacoes) {
      const novasMovimentacoes = [...movimentacoes, route.params.novasMovimentacoes];
      setMovimentacoes(novasMovimentacoes);
      AsyncStorage.setItem('MovimentacoesFinanceiras', JSON.stringify(novasMovimentacoes));
      calcularSaldo(novasMovimentacoes);
    }
  }, [route.params?.novasMovimentacoes]);

  const excluirMovimentacao = (movIndex, movItemIndex) => {
    const novasMovimentacoes = [...movimentacoes];
    const [removed] = novasMovimentacoes[movIndex].items.splice(movItemIndex, 1);

    if (novasMovimentacoes[movIndex].items.length === 0) {
      novasMovimentacoes.splice(movIndex, 1);
    }

    const novoSaldo = removed.isEntry
      ? saldoAtual - parseFloat(removed.value)
      : saldoAtual + parseFloat(removed.value);

    setMovimentacoes(novasMovimentacoes);
    setSaldoAtual(novoSaldo);

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
            
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => excluirMovimentacao(movIndex, movItemIndex)}
            >
              <Text style={styles.deleteButtonText}><FontAwesome name="trash" size={24} color="black" /></Text>
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
          keyExtractor={(item) => item.date.toString()}
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
    // backgroundColor: '#ff6666',
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
