import React, { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FinancialScreen from './screens/FinancialScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import NovaMovimentacaoScreen from './screens/NovaMovimentacaoScreen';
import CadastroScreen from './screens/CadastroScreen';
import { TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    setTimeout(async() => {
      await SplashScreen.hideAsync();
    }, 2000);
  }, []);

  const handleLogout = async (navigation) => {
    await AsyncStorage.removeItem('loggedIn');
    navigation.replace('Home');
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name='Home' component={HomeScreen} />
        <Stack.Screen 
          name="FinancialScreen" 
          component={FinancialScreen}
          options={({ navigation }) => ({
            title: 'Financial',
            headerRight: () => (
              <TouchableOpacity onPress={() => handleLogout(navigation)}>
                <Text style={{ marginRight: 10 }}><MaterialCommunityIcons name="logout" size={24} color="black" /></Text>
              </TouchableOpacity>
            ),
            headerTitleAlign: 'left',
          })}
        />
        <Stack.Screen name="Nova Movimentação" component={NovaMovimentacaoScreen} />
        <Stack.Screen name="CadastroScreen" component={CadastroScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
