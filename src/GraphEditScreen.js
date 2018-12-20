import React, {
  Component,
} from 'react'
import {
  Button,
  StyleSheet,
  TextInput,
  View,
} from 'react-native'
import {
  type NavigationScreenProp,
} from 'react-navigation/src/TypeDefinition';
import LoginStore from './LoginStore'

type Prop = {
  navigation: NavigationScreenProp<*>,
}

export default class GraphEditScreen extends Component<Prop> {
  static navigationOptions = ({navigation}) => {
    return {
        title: 'EDIT',
    }
  }

  constructor(props: Prop) {
    super(props)
    this.state = {
      graphId: null,
      graphName: null,
    }
  }

  _sendRequest() {
    const body = {
      id: `${this.state.graphId}`,
      name: `${this.state.graphName}`,
      unit: "commit",
      type: "int",
      color: "shibafu",
    }
    fetch(`https://pixe.la/v1/users/${LoginStore.getUserId()}/graphs`, {
      method: 'POST',
      headers: {
        'X-USER-TOKEN': `${LoginStore.getUserToken()}`
      },
      body: JSON.stringify(body),
    }).then(res => {
      if (res.ok) {
        LoginStore.addGraph({
            id: this.state.graphId,
            name: this.state.graphName,
        })
        console.log(LoginStore.getGraphs())
        const { navigation } = this.props
        navigation.navigate('GraphList');
      } else {
        console.log(res)
      }
    })
  }

  render() {
    const { navigation } = this.props,
      graphs = navigation.getParam('graphs')
    return (
      <View style={styles.container}>
        <TextInput
          placeholder={"graphid"}
          maxLength={16}
          keyboardType={"ascii-capable"}
          onChangeText={(text) => this.setState({graphId:text})}
        />
        <TextInput
          placeholder={"Graph name"}
          onChangeText={(text) => this.setState({graphName:text})}
        />
        <Button
          title="Create"
          disabled={!this.state.graphId || !this.state.graphName}
          onPress={() => this._sendRequest()}
        />
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  text: {
    margin: 10,
  }
});
    