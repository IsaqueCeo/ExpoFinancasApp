import React, { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FinancialScreen from './screens/FinancialScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import NovaMovimentacaoScreen from './screens/NovaMovimentacaoScreen';
import CadastroScreen from './screens/CadastroScreen';

const Stack = createStackNavigator();

export default function App() {
  // useEffect(() => {
  //   const prepare = async () => {
  //     try {
        
  //       await SplashScreen.preventAutoHideAsync();
        
  //       await new Promise(resolve => setTimeout(resolve, 3000));
        
  //       await SplashScreen.hideAsync();
  //     } catch (e) {
  //       console.warn(e);
  //     }
  //   };
    
  //   prepare();
  // }, []);

  
  useEffect(() =>{
    setTimeout(async()=> {
      await SplashScreen.hideAsync();
    },2000)
  },[])


  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name='Home' component={HomeScreen} />
        <Stack.Screen name="FinancialScreen" component={FinancialScreen} />
        <Stack.Screen name="Nova Movimentação" component={NovaMovimentacaoScreen} />
        <Stack.Screen name="CadastroScreen" component={CadastroScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
