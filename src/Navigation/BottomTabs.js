import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import CreateBlog from '../pages/CreateBlog';
import Icon from 'react-native-vector-icons/Ionicons';
import Category from '../pages/BlogCategory';
import UserBlogs from '../pages/UserBlogs';
import Home from '../pages/Home';
import CustomDrawer from './CustomDrawer';
import Profile from '../pages/Profile';
import {createDrawerNavigator} from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();
function MyDrawer() {
    return (
      <Drawer.Navigator drawerContent={props => <CustomDrawer {...props} />}>
        <Drawer.Screen name="Profile" component={Profile} />
      </Drawer.Navigator>
    );
  }

export default function BottomTabs() {
  const BottomTab = createBottomTabNavigator();

 
    return (
      <BottomTab.Navigator
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
        <BottomTab.Screen
          name="Home"
          options={{headerShown: false}}
          component={Home}
        />
        <BottomTab.Screen
          name="Category"
          options={{headerShown: false}}
          component={Category}
        />
        <BottomTab.Screen
          name="CreateBlog"
          options={{headerShown: false}}
          component={CreateBlog}
        />
        <BottomTab.Screen
          name="YourBlogs"
          options={{
            headerStyle: {backgroundColor: '#2E2F41'},
            headerTintColor: 'white',
          }}
          component={UserBlogs}
        />
        <BottomTab.Screen
          name="Profile"
          options={{
            headerShown: false,
          }}
          component={MyDrawer}
        />
      </BottomTab.Navigator>
    );
  }
