import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const handleLogout = async () => {
    await AsyncStorage.removeItem('loggedIn');
    navigation.navigate('LoginScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hora de transformar suas finanças</Text>
      <Text style={styles.subtitle}>
        O caminho está à sua frente. Estando aqui, você já deu o maior passo
        para sua transformação financeira. E nós te guiaremos no processo.
      </Text>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogout}>
        <Text style={styles.loginButtonText}>Logar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('CadastroScreen')}>
        <Text style={styles.loginButtonText}>Cadastro de Usuário</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 40,
  },
  loginButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 25,
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // registerText: {
  //   color: '#000',
  //   fontSize: 14,
  //   marginTop: 20,
  // },
});

export default HomeScreen;
