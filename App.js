import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TransactionScreen from './TransactionScreen';
import LoginScreen from './LoginScreen';
import WelcomeScreen from './WelcomeScreen';
import Dashboard from './Dashboard';
import DetailTransactionScreen from './DetailTransactionScreen';


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="Transaksi" component={TransactionScreen} />
        <Stack.Screen name="DetailTransaksi" component={DetailTransactionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;