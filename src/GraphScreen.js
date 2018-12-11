import React, {
  Component
} from 'react'
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import Pixela from './Pixela'
const svgurl = "https://pixe.la/v1/users/kdnakt/graphs/"

type Prop = {
  navigation: NavigationScreenProp<*>,
}

export default class GraphScreen extends Component<Prop> {
  constructor(props) {
    super(props)
    this.state = {
        svgXmlData: null,
        isSuccessful: true,
    }
  }

  componentDidMount() {
    const { navigation } = this.props,
      id = navigation.getParam('graphId')
    fetch(svgurl + id).then(res => {
      this.setState({
          svgXmlData: res._bodyText,
          isSuccessful: res.ok,
      })
    })
  }

  renderPixela() {
    return this.state.svgXmlData ? (
      <Pixela
        data={this.state.svgXmlData}
        name={this.props.navigation.getParam('name')}
      />
    ) : (
      <Text>{"Loading ..."}</Text>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {!this.state.isSuccessful ? (
          <Text>{JSON.parse(this.state.svgXmlData).message}</Text>
        ) : this.renderPixela()}
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
  