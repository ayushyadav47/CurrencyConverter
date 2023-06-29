import React from 'react';

import Watchlist from './components/Watchlist';
import Home from './components/Home';
import Exchangechart from './components/Exchangechart';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={{
          headerStyle: {
            backgroundColor: '#242B2E',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} name="Welcome to the Currency Converter App" component={Home} />


        <Stack.Screen options={{
          headerStyle: {
            backgroundColor: '#242B2E',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} name="Watchlist" component={Watchlist} />
        
        <Stack.Screen options={{
          headerStyle: {
            backgroundColor: '#242B2E',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} name="Exchangechart" component={Exchangechart} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;


