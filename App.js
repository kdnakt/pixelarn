/**
 * @format
 * @flow
 */

import React, {
  Component
} from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import Pixela from './src/Pixela'

const svgurl = "https://pixe.la/v1/users/kdnakt/graphs/test-graph"

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = { svgXmlData: null}
  }

  componentDidMount() {
    fetch(svgurl).then(res => this.setState({svgXmlData:res._bodyText}))
  }

  render() {
    return (
      <View style={styles.container}>
        <Pixela data={this.state.svgXmlData} />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});
