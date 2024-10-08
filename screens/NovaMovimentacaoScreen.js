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
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
      />

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
    backgroundColor: '#28a745',
  },
  activeButtonRed: {
    backgroundColor: '#dc3545',
  },
  inactiveButton: {
    backgroundColor: '#ccc',
  },
  buttonCadastrar: {
    backgroundColor: '#000',
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
