import React, {
  Component,
} from 'react'
import {
  Alert,
  StyleSheet,
  View,
} from 'react-native'
import {
  Button,
  Divider,
  FormLabel,
  FormInput,
  FormValidationMessage,
} from 'react-native-elements'
import {
  type NavigationScreenProp,
} from 'react-navigation/src/TypeDefinition';
import LoginStore from '../store/LoginStore'
import { createGraph } from '../PixelaApi';

type Prop = {
  navigation: NavigationScreenProp<*>,
}

export default class GraphEditScreen extends Component<Prop> {
  static navigationOptions = ({navigation}) => {
    return {
        title: 'CREATE',
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
      timezone: "Asia/Tokyo",
    }
    createGraph(body).then(res => {
      Alert.alert(res.message)
      if (res.isSuccess) {
        LoginStore.addGraph(body)
        const { navigation } = this.props
        navigation.navigate('GraphList', LoginStore.getGraphs());
      }
    })
  }

  render() {
    const { navigation } = this.props,
      graphs = navigation.getParam('graphs')
    return (
      <View style={styles.container}>
        <FormLabel>Graph Id</FormLabel>
        <FormInput
          placeholder={"Enter new graph id"}
          maxLength={17}
          autoCapitalize={"none"}
          keyboardType={"ascii-capable"}
          onChangeText={(text) => {
            if (!text) {
              this.setState({graphId: text, graphIdValidationMessage: 'This item is required'})
              return
            }
            const r1 = /[a-z]/
            const r2 = /[a-z0-9-]/
            if (!r1.test(text.charAt(0))) {
              this.setState({graphId: text, graphIdValidationMessage: 'This should start with a lowercase alphabet.'})
            } else if (text.length < 2) {
              this.setState({graphId: text, graphIdValidationMessage: '2 characters required.'})
            } else {
              for (let i = 1, l = text.length; i < l; i++) {
                if (!r2.test(text.charAt(i))) {
                  this.setState({graphId: text, graphIdValidationMessage: 'Lowercase alphabets, numbers and "-" are allowed.'})
                  return
                }
              }
              this.setState({graphId: text, graphIdValidationMessage: ''})
            }
          }}
          value={this.state.graphId}
        />
        <FormValidationMessage>
          {this.state.graphIdValidationMessage}
        </FormValidationMessage>
        <FormLabel>Graph Name</FormLabel>
        <FormInput
          placeholder={"Enter new graph name"}
          onChangeText={(text) => this.setState({graphName:text})}
        />
        <Divider style={{height:16, backgroundColor: 'white'}} />
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

let styles = StyleSheet.create({
  container: {
    margin: "5% 30%"
  }
});
