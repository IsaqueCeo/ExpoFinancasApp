import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import CurrencyInput from 'react-native-currency-input';

export default function NovaMovimentacao({ navigation }) {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState(null);
  const [isEntry, setIsEntry] = useState(true);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const salvarMovimentacao = async () => {
    try {
      const movimentacoesSalvas = await AsyncStorage.getItem('MovimentacoesFinanceiras');
      let movimentacoes = movimentacoesSalvas ? JSON.parse(movimentacoesSalvas) : [];

      const novaMovimentacao = {
        id: (movimentacoes.length + 1).toString(),
        description: descricao,
        value: valor,
        isEntry: isEntry,
        date: date.toLocaleDateString('pt-BR'),
        time: date.toLocaleTimeString('pt-BR'),
      };

      const hoje = date.toLocaleDateString('pt-BR');
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

      // Calcular o saldo atual
      let saldoAtual = await AsyncStorage.getItem('SaldoAtual');
      saldoAtual = saldoAtual ? parseFloat(saldoAtual) : 0;

      const novoSaldo = isEntry ? saldoAtual + valor : saldoAtual - valor;
      await AsyncStorage.setItem('SaldoAtual', novoSaldo.toString());

      await AsyncStorage.setItem('MovimentacoesFinanceiras', JSON.stringify(movimentacoes));

      navigation.navigate('FinancialScreen');
    } catch (error) {
      console.error('Erro ao salvar movimentação:', error);
    }
  };

  const showDatePickerHandler = () => {
    setShowDatePicker(true);
  };

  const showTimePickerHandler = () => {
    setShowTimePicker(true);
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    setShowDatePicker(false);
  };

  const onChangeTime = (event, selectedTime) => {
    const currentTime = selectedTime || date;
    setDate(currentTime);
    setShowTimePicker(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nova Movimentação</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
      />

      <View style={styles.dateTimeContainer}>
        <TouchableOpacity onPress={showDatePickerHandler} style={[styles.input, styles.dateInput]}>
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

        <TouchableOpacity onPress={showTimePickerHandler} style={[styles.input, styles.timeInput]}>
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
      </View>

      <CurrencyInput
        value={valor}
        onChangeValue={setValor}
        style={styles.input}
        placeholder="Valor"
        unit="R$"
        delimiter="."
        separator=","
        precision={2}
      />

      <View style={styles.entryExitContainer}>
        <TouchableOpacity
          onPress={() => setIsEntry(true)}
          style={[styles.entryExitButton, isEntry && styles.selectedButton]}
        >
          <View style={styles.radioButtonContainer}>
            <View style={[styles.radioButton, { backgroundColor: 'green' }]} />
            <Text style={styles.entryExitButtonText}>Receita</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setIsEntry(false)}
          style={[styles.entryExitButton, !isEntry && styles.selectedButton]}
        >
          <View style={styles.radioButtonContainer}>
            <View style={[styles.radioButton, { backgroundColor: 'red' }]} />
            <Text style={styles.entryExitButtonText}>Despesa</Text>
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={salvarMovimentacao}>
        <Text style={styles.saveButtonText}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateInput: {
    flex: 1,
    marginRight: 10,
  },
  timeInput: {
    flex: 1,
  },
  entryExitContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  entryExitButton: {
    flex: 1,
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  selectedButton: {
    borderColor: '#6200ee',
  },
  entryExitButtonText: {
    fontSize: 16,
    color: '#333',
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
