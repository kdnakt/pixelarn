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
import GraphScreen from './src/GraphScreen'
import GraphConfigScreen from './src/GraphConfigScreen';
import GraphEditScreen from './src/GraphEditScreen';
import GraphListScreen from './src/GraphListScreen';
import LoginScreen from './src/LoginScreen';
import UserScreen from './src/UserScreen';

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
