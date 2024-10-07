import React, { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FinancialScreen from './screens/FinancialScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';


const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    const prepare = async () => {
      try {
        // Impedir a tela de splash de desaparecer automaticamente
        await SplashScreen.preventAutoHideAsync();
        
        // Adicionar um delay de 3 segundos antes de esconder a splash screen
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Esconder a splash screen
        await SplashScreen.hideAsync();
      } catch (e) {
        console.warn(e);
      }
    };
    
    prepare();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name='Login' component={LoginScreen} />
        <Stack.Screen name='Home' component={HomeScreen} />
        <Stack.Screen name='Financial' component={FinancialScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
