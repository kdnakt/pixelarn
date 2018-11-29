/**
 * @format
 * @flow
 */

import GraphScreen from './src/GraphScreen'
import {
  createStackNavigator,
  createAppContainer
} from "react-navigation";

const AppNavigator = createStackNavigator({
  Graph: {
    screen: GraphScreen
  }
});

export default createAppContainer(AppNavigator);