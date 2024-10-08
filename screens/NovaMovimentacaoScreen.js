import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import CurrencyInput from 'react-native-currency-input'; // Biblioteca para formatar moeda

export default function NovaMovimentacao({ navigation }) {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState(null);
  const [isEntry, setIsEntry] = useState(true); // True para receita, false para despesa
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Função para salvar a movimentação
  const salvarMovimentacao = async () => {
    try {
      // Carrega as movimentações já salvas
      const movimentacoesSalvas = await AsyncStorage.getItem('MovimentacoesFinanceiras');
      let movimentacoes = movimentacoesSalvas ? JSON.parse(movimentacoesSalvas) : [];

      // Adiciona a nova movimentação
      const novaMovimentacao = {
        id: (movimentacoes.length + 1).toString(), // Adicione o id aqui
        description: descricao,
        value: valor,
        isEntry: isEntry,
        date: date.toLocaleDateString('pt-BR'),
        time: date.toLocaleTimeString('pt-BR'),
      };

      // Adiciona a nova movimentação no array de movimentações da data atual (ou cria nova data)
      const hoje = date.toLocaleDateString('pt-BR');
      const dataExistente = movimentacoes.find(mov => mov.date === hoje);
      if (dataExistente) {
        dataExistente.items.push(novaMovimentacao);
      } else {
        movimentacoes.push({
          id: (movimentacoes.length + 1).toString(), // Altere este id para o correto
          date: hoje,
          items: [novaMovimentacao],
        });
      }

      // Salva de volta no AsyncStorage
      await AsyncStorage.setItem('MovimentacoesFinanceiras', JSON.stringify(movimentacoes));

      // Navega de volta para a tela de movimentações
      navigation.navigate('FinancialScreen');
    } catch (error) {
      console.error('Erro ao salvar movimentação:', error);
    }
  };

  // Função para abrir o seletor de data
  const showDatePickerHandler = () => {
    setShowDatePicker(true);
  };

  // Função para abrir o seletor de hora
  const showTimePickerHandler = () => {
    setShowTimePicker(true);
  };

  // Função para selecionar a data
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios'); // Para iOS
    setDate(currentDate);
  };

  // Função para selecionar a hora
  const onChangeTime = (event, selectedTime) => {
    const currentTime = selectedTime || date;
    setShowTimePicker(Platform.OS === 'ios'); // Para iOS
    setDate(currentTime);
  };

  return (
    <View style={styles.container}>
      {/* Campo de Descrição */}
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
      />

      {/* Campo de Data */}
      <TouchableOpacity onPress={showDatePickerHandler} style={styles.input}>
        <Text>{date.toLocaleDateString('pt-BR')}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}

      {/* Campo de Hora */}
      <TouchableOpacity onPress={showTimePickerHandler} style={styles.input}>
        <Text>{date.toLocaleTimeString('pt-BR')}</Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={date}
          mode="time"
          display="default"
          onChange={onChangeTime}
        />
      )}

      {/* Campo de Valor formatado */}
      <CurrencyInput
        style={styles.input}
        value={valor}
        onChangeValue={setValor}
        prefix="R$ "
        delimiter="."
        separator=","
        precision={2}
        placeholder="Valor"
        keyboardType="numeric"
      />

      {/* Botões para Receita ou Despesa */}
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.button, isEntry ? styles.activeButtonGreen : styles.inactiveButton]}
          onPress={() => setIsEntry(true)}
        >
          <Text style={styles.textButton}>Receita</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, !isEntry ? styles.activeButtonRed : styles.inactiveButton]}
          onPress={() => setIsEntry(false)}
        >
          <Text style={styles.textButton}>Despesa</Text>
        </TouchableOpacity>
      </View>

      {/* Botão para cadastrar a movimentação */}
      <TouchableOpacity style={styles.buttonCadastrar} onPress={salvarMovimentacao}>
        <Text style={styles.textButtonCadastrar}>Cadastrar</Text>
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
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  activeButtonGreen: {
    backgroundColor: '#28a745', // Verde para receita
  },
  activeButtonRed: {
    backgroundColor: '#dc3545', // Vermelho para despesa
  },
  inactiveButton: {
    backgroundColor: '#ccc',
  },
  buttonCadastrar: {
    backgroundColor: '#000', // Preto para cadastrar
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
  textButtonCadastrar: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
