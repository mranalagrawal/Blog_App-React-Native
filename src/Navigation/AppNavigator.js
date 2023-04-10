import {StyleSheet,  ActivityIndicator} from 'react-native';
import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Splash from '../pages/Splash';
import Home from '../pages/Home';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import CreateBlog from '../pages/CreateBlog';
import Icon from 'react-native-vector-icons/Ionicons';
import Category from '../pages/BlogCategory';
import UserBlogs from '../pages/UserBlogs';
import Profile from '../pages/Profile';
import auth from '@react-native-firebase/auth';
import Details from '../pages/BlogDetails';
import CategoryDetails from '../pages/BlogCategoryDetails';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawer from './CustomDrawer';

const AppNavigator = () => {

  // navigation
  const Stack = createStackNavigator();
  const bottomTab = createBottomTabNavigator();
  const Drawer = createDrawerNavigator();

  const [loggedin, setLoggedin] = useState(false);
  const [loading, setLoading] = useState(false);

  // Drawer Navigation

  function MyDrawer() {
    return (
      <Drawer.Navigator drawerContent={props => <CustomDrawer {...props} />}>
        <Drawer.Screen name="Profile" component={Profile} />
      </Drawer.Navigator>
    );
  }

  // Tab Navigation
  function BottomTabs() {
    return (
      <bottomTab.Navigator
        screenOptions={({route}) => ({
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: 'white',
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: '#2E2F41',
            height: 70,
          },
          tabBarIcon: ({focused, size, color}) => {
            let iconName;
            if (route.name === 'Home') {
              (iconName = focused ? 'ios-home' : 'ios-home-outline'),
                (size = focused ? size + 15 : size + 5);
            } else if (route.name === 'Category') {
              (iconName = focused ? 'list' : 'list-outline'),
                (size = focused ? size + 15 : size + 5);
            } else if (route.name === 'CreateBlog') {
              (iconName = focused ? 'ios-create' : 'ios-create-outline'),
                (size = focused ? size + 15 : size + 5);
            } else if (route.name === 'YourBlogs') {
              (iconName = focused ? 'bookmark' : 'bookmark-outline'),
                (size = focused ? size + 15 : size + 5);
            } else if (route.name === 'Profile') {
              (iconName = focused
                ? 'person-circle-sharp'
                : 'person-circle-outline'),
                (size = focused ? size + 15 : size + 5);
            }
            return <Icon name={iconName} size={size} color={color} />;
          },
        })}>
        <bottomTab.Screen
          name="Home"
          options={{headerShown: false}}
          component={Home}
        />
        <bottomTab.Screen
          name="Category"
          options={{headerShown: false}}
          component={Category}
        />
        <bottomTab.Screen
          name="CreateBlog"
          options={{headerShown: false}}
          component={CreateBlog}
        />
        <bottomTab.Screen
          name="YourBlogs"
          options={{
            headerStyle: {backgroundColor: '#2E2F41'},
            headerTintColor: 'white',
          }}
          component={UserBlogs}
        />
        <bottomTab.Screen
          name="Profile"
          options={{
            headerShown: false,
          }}
          component={MyDrawer}
        />
      </bottomTab.Navigator>
    );
  }

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
