import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default LoginScreen =({navigation}) => {
 const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
 
  useEffect(()=>{
    //Verifica se o usuario já está logado
    const checkLoginStatus = async() =>{
      const loggedIn = await AsyncStorage.getItem('loggedIn');
      if (loggedIn ==='true'){
        navigation.replace('Home')
      }
    }
    checkLoginStatus();
  },[])

  const handleLogin = async() =>{
    if(username === 'admin' && password ==='1234' ){
      await AsyncStorage.setItem('loggedIn','true');
      navigation.replace('Home'); //Navaga para a tela principal
    }else{
      Alert.alert('Erro','Usuario ou senha inválidos!')
    }
  }


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput style={styles.input}
      placeholder="Usuario"
      value={username}
      onChangeText={setUsername}/>
      
      <TextInput style={styles.input}
      placeholder="Senha"
      value={password}
      onChangeText={setPassword}/>
      <Button title="Entrar" onPress={handleLogin}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal:20,
  },
  title:{
    fontSize:24,
    marginBottom:20,
    textAlign:'center',
  },
  input:{
    borderWidth:1,
    borderColor:'#ccc',
    padding:10,
    marginBottom:10,
    borderRadius:5,

  }
});