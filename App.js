/**
 * @format
 * @flow
 */
import React from 'react'
import {
  createAppContainer,
  createDrawerNavigator,
} from 'react-navigation';
import {
  Icon,
} from 'react-native-elements'
import { createStackNavigator } from 'react-navigation-stack';
import GraphScreen from './src/screen/GraphScreen'
import GraphConfigScreen from './src/screen/GraphConfigScreen';
import GraphEditScreen from './src/screen/GraphEditScreen';
import GraphListScreen from './src/screen/GraphListScreen';
import LoginScreen from './src/screen/LoginScreen';
import SignupScreen from './src/screen/SignupScreen';
import TermsScreen from './src/screen/TermsScreen';
import UserScreen from './src/screen/UserScreen';

const graphStack = createStackNavigator({
  GraphList: {
    screen: GraphListScreen,
    navigationOptions: {
      gesturesEnabled: false,
    },
  },
  GraphEdit: GraphEditScreen,
  Graph: GraphScreen,
  GraphConfig: GraphConfigScreen,
}, {
  navigationOptions: ({navigation}) => ({
    drawerLabel: 'Graph List',
    drawerLockMode: (
      navigation.state.routes[navigation.state.index].params || {}
    ).drawerLockMode,
    drawerIcon: (<Icon
      name="list"
      type="font-awesome"
    />),
  })
})

const userStack = createStackNavigator({
  User: {
    screen: UserScreen,
    navigationOptions: {
      gesturesEnabled: false,
    },
  },
}, {
  navigationOptions: ({navigation}) => ({
    drawerLabel: 'User',
    drawerLockMode: (
      navigation.state.routes[navigation.state.index].params || {}
    ).drawerLockMode,
    drawerIcon: (<Icon
      name="user"
      type="font-awesome"
    />),
  })
})

const pixelaDrawer = createDrawerNavigator({
  GraphDrawer: {
    path: '/graph',
    screen: graphStack,
  },
  UserStack: {
    path: '/user',
    screen: userStack,
  },
}, {
  initialRouteName: 'GraphDrawer',
  navigationOptions: {
    header: null,
  },
  contentOptions: {
    activeTintColor: '#e91e63',
  },
})

const AppNavigator = createStackNavigator({
  Login: LoginScreen,
  Signup: SignupScreen,
  Terms: TermsScreen,
  Pixela: pixelaDrawer,
}, {
  initialRouteName: 'Login',
})

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
