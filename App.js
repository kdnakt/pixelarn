/**
 * @format
 * @flow
 */
import React from 'react'
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import GraphScreen from './src/GraphScreen'

const routes = {
  Graph: GraphScreen,
};

const config = {
  initialRouteName: 'Graph',
};

const AppNavigator = createStackNavigator(routes, config);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
