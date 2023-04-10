import {StyleSheet,  ActivityIndicator} from 'react-native';
import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Splash from '../pages/Splash';
import Home from '../pages/Home';
import auth from '@react-native-firebase/auth';
import Details from '../pages/BlogDetails';
import CategoryDetails from '../pages/BlogCategoryDetails';

import BottomTabs from './BottomTabs';

const AppNavigator = () => {

  // navigation
  const Stack = createStackNavigator();

  const [loggedin, setLoggedin] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // authentication

  const onAuthStateChanged = user => {
    if (user) {
      setLoggedin(true);
    } else {
      setLoggedin(false);
    }
    if (loading) {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator color="black" size={40} />;
  }
  useEffect(() => {
    const subscribe = auth().onAuthStateChanged(onAuthStateChanged);
    return subscribe;
  }, []);

  if (!loggedin) {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen
            options={{headerShown: false}}
            name="Splash"
            component={Splash}
          />
          <Stack.Screen
            options={{
              headerStyle: {
                backgroundColor: 'black',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
            name="Login"
            component={Login}
          />
          <Stack.Screen
            name="Signup"
            options={{
              headerStyle: {
                backgroundColor: 'black',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
            component={Signup}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  // stack navigation

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          options={{
            headerShown: false,
          }}
          component={BottomTabs}
        />
        <Stack.Screen name="Details" component={Details} />
        <Stack.Screen name="CategoryDetails" component={CategoryDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({});
