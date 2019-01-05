/**
 * @format
 * @flow
 */
import React from 'react'
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import GraphScreen from './src/GraphScreen'
import GraphConfigScreen from './src/GraphConfigScreen';
import GraphEditScreen from './src/GraphEditScreen';
import GraphListScreen from './src/GraphListScreen';
import LoginScreen from './src/LoginScreen';

const routes = {
  Graph: GraphScreen,
  GraphConfig: GraphConfigScreen,
  GraphEdit: GraphEditScreen,
  GraphList: GraphListScreen,
  Login: LoginScreen,
};

const config = {
  initialRouteName: 'Login',
};

const AppNavigator = createStackNavigator(routes, config);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
