import React, {
  Component
} from 'react'
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import Pixela from './Pixela'
const svgurl = "https://pixe.la/v1/users/kdnakt/graphs/test-graph"

export default class GraphScreen extends Component {
  constructor(props) {
    super(props)
    this.state = { svgXmlData: null}
  }

  componentDidMount() {
    fetch(svgurl).then(res => {
      this.setState({svgXmlData:res._bodyText})
    })
  }

  renderPixela() {
    return this.state.svgXmlData ? (
      <Pixela data={this.state.svgXmlData} />
    ) : (
      <Text>{"Loading ..."}</Text>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderPixela()}
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
  