import React, {
  Component
} from 'react'
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import Pixela from './Pixela'
import LoginStore from './LoginStore'
//const svgurl = "https://pixe.la/v1/users/kdnakt/graphs/"

type Prop = {
  navigation: NavigationScreenProp<*>,
}

export default class GraphScreen extends Component<Prop> {
  static navigationOptions = ({navigation}) => {
    const { name } = navigation.state.params;
    return {
        title: name
    }
  }

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
    fetch(`https://pixe.la/v1/users/${LoginStore.getUserId()}/graphs/` + id)
        .then(res => {
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
  