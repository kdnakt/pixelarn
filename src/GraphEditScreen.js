import React, {
  Component,
} from 'react'
import {
  Alert,
  View,
} from 'react-native'
import {
  Button,
  FormLabel,
  FormInput,
} from 'react-native-elements'
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
        navigation.goBack();
      } else {
        Alert.alert(JSON.parse(res._bodyText).message)
      }
    })
  }

  render() {
    const { navigation } = this.props,
      graphs = navigation.getParam('graphs')
    return (
      <View>
        <FormLabel>Graph Id</FormLabel>
        <FormInput
          placeholder={"Enter new graph id"}
          maxLength={16}
          autoCapitalize={"none"}
          keyboardType={"ascii-capable"}
          onChangeText={(text) => this.setState({graphId:text})}
        />
        <FormLabel>Graph Name</FormLabel>
        <FormInput
          placeholder={"Enter new graph name"}
          onChangeText={(text) => this.setState({graphName:text})}
        />
        <Button
          title="Create"
          large
          backgroundColor={'#00aced'}
          disabled={!this.state.graphId || !this.state.graphName}
          onPress={() => this._sendRequest()}
        />
      </View>
    )
  }

}
    