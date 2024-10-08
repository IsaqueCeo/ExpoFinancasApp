import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NovaMovimentacao({ navigation }) {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [isEntry, setIsEntry] = useState(true); // True para receita, false para despesa

  // Função para salvar a movimentação
  const salvarMovimentacao = async () => {
    try {
      // Carrega as movimentações já salvas
      const movimentacoesSalvas = await AsyncStorage.getItem('MovimentacoesFinanceiras');
      let movimentacoes = movimentacoesSalvas ? JSON.parse(movimentacoesSalvas) : [];

      // Adiciona a nova movimentação
      const novaMovimentacao = {
        description: descricao,
        value: valor,
        isEntry: isEntry,
      };

      // Adiciona a nova movimentação no array de movimentações da data atual (ou cria nova data)
      const hoje = new Date().toLocaleDateString('pt-BR');
      const dataExistente = movimentacoes.find(mov => mov.date === hoje);
      if (dataExistente) {
        dataExistente.items.push(novaMovimentacao);
      } else {
        movimentacoes.push({
          id: (movimentacoes.length + 1).toString(),
          date: hoje,
          items: [novaMovimentacao],
        });
      }

      // Salva de volta no AsyncStorage
      await AsyncStorage.setItem('MovimentacoesFinanceiras', JSON.stringify(movimentacoes));

      // Navega de volta para a tela de movimentações, enviando as novas movimentações
      navigation.navigate('FinancialScreen', { novasMovimentacoes: movimentacoes });
    } catch (error) {
      console.error('Erro ao salvar movimentação:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
      />
      <TextInput
        style={styles.input}
        placeholder="Valor"
        value={valor}
        onChangeText={setValor}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={() => setIsEntry(true)}>
        <Text style={[styles.buttonText, isEntry && styles.active]}>Receita</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => setIsEntry(false)}>
        <Text style={[styles.buttonText, !isEntry && styles.active]}>Despesa</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={salvarMovimentacao}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f9fa',
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 15,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputHalf: {
        width: '48%',
    },
    picker: {
        height: 50,
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    button: {
        backgroundColor: '#333',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    textButton: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
