import React, { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FinancialScreen from './screens/FinancialScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import NovaMovimentacaoScreen from './screens/NovaMovimentacaoScreen';

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
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name='Login' component={LoginScreen} />
        <Stack.Screen name='Home' component={HomeScreen} />
        <Stack.Screen name='Financial' component={FinancialScreen} />
        <Stack.Screen name="Nova Movimentação" component={NovaMovimentacaoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
