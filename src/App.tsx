import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';

function App(): React.JSX.Element {

    const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
        <Stack.Navigator screenOptions={{
          title: 'DuoClient',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 16
          },
          headerShadowVisible: false,
          contentStyle: {
            padding: 5
          }
        }}>
            <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
