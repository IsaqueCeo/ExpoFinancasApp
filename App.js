import React,{useEffect} from 'react';
import * as SplashScreen from 'expo-splash-screen'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// import HomeScreen from './screens/HomeScreen'
import LoginScreen from './screens/LoginScreen'

const Stack = createStackNavigator();
SplashScreen.preventAutoHideAsync();

export default function App(){
  useEffect(() =>{
    setTimeout(async()=> {
      await SplashScreen.hideAsync();
    },3000)
  },[])

  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name='Login' component={LoginScreen}/>
        {/* <Stack.Screen name='Home' component={HomeScreen}/> */}
      </Stack.Navigator>
    </NavigationContainer>
  )
}