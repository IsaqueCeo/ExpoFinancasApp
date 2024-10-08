// screens/HomeScreen.js
import React from 'react';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const handleLogout = async () => {
    await AsyncStorage.setItem('loggedIn', 'false');
    navigation.replace('Login');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Bem-vindo à tela inicial!</Text>
      <Button title="Logar" onPress={handleLogout} />
    </View>
  );
};

export default HomeScreen;
