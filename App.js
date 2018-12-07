/**
 * @format
 * @flow
 */
import React from 'react'
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import GraphScreen from './src/GraphScreen'
import GraphListScreen from './src/GraphListScreen';

const routes = {
  Graph: GraphScreen,
  GraphList: GraphListScreen,
};

const config = {
  initialRouteName: 'GraphList',
};

const AppNavigator = createStackNavigator(routes, config);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
