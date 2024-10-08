import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput, Button, Alert, Image, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Caminho da imagem
const primoPobreImg = require('../img/primo_pobre.jpg');

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Verifica se o usuário já está logado
    const checkLoginStatus = async () => {
      const loggedIn = await AsyncStorage.getItem('loggedIn');
      if (loggedIn === 'true') {
        navigation.replace('Home');
      }
    };
    checkLoginStatus();
  }, [navigation]);

  const handleLogin = async () => {
    if (username === 'admin' && password === '1234') {
      await AsyncStorage.setItem('loggedIn', 'true');
      navigation.replace('Financial');
    } else {
      Alert.alert('Erro', 'Usuário ou senha inválidos!');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={primoPobreImg} style={styles.image} />
      <Text style={styles.title}>Bem-vindo!</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuário"
        placeholderTextColor="#aaa"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center", // Alinha o conteúdo no centro horizontal
    paddingHorizontal: 20,
    backgroundColor: '#f0f4f7', // Cor de fundo suave
  },
  image: {
    width: 150, // Ajuste o tamanho da imagem
    height: 150,
    borderRadius: 75, // Torna a imagem circular
    resizeMode: 'cover', // Cobre o espaço da imagem mantendo a proporção
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    marginBottom: 30,
    color: '#333', 
    textAlign: 'center',
    fontWeight: 'bold', 
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    width: '100%',
    backgroundColor: '#007bff', 
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
