import React, {
  Component,
} from 'react'
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'

export default class LoginScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userId: null,
      userToken: null,
    }
  }

  _send() {
    Alert.alert(`UserId: ${this.state.userId}, Token: ${this.state.userToken}`)
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>{"Enter user id and token."}</Text>
        <TextInput
          placeholder={"User id"}
          onChangeText={(text) => this.setState({userId:text})}
        />
        <TextInput
          placeholder={"User token"}
          onChangeText={(text) => this.setState({userToken:text})}
        />
        <Button
          title="Send"
          onPress={() => this._send()}
          disabled={!this.state.userId || !this.state.userToken}
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
