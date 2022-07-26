import React from 'react';
import Translate from '../screens/translate';
import SplashScreen from '../screens/splashScreen';
import Cards from '../screens/cards';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

const Routes = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="CardsScreen" component={Cards} />
        <Stack.Screen name="TranslateScreen" component={Translate} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
