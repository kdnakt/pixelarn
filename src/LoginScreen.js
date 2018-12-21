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
import LoginStore from './LoginStore'

export default class LoginScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userId: null,
      userToken: null,
    }
  }

  _send() {
    fetch(`https://pixe.la/v1/users/${this.state.userId}/graphs`, {
      method: 'GET',
      headers: {
        'X-USER-TOKEN': `${this.state.userToken}`
      }
    }).then(res => {
      if (res.ok) {
        LoginStore.setUserId(this.state.userId)
        LoginStore.setUserToken(this.state.userToken)
        LoginStore.setGraphs(JSON.parse(res._bodyText).graphs)
        const { navigation } = this.props
        navigation.navigate('GraphList')
      } else {
        Alert.alert(JSON.parse(res._bodyText).message)
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>{"Enter user id and token."}</Text>
        <TextInput
          placeholder={"User id"}
          autoCapitalize={false}
          onChangeText={(text) => this.setState({userId:text})}
        />
        <TextInput
          placeholder={"User token"}
          secureTextEntry={true}
          onChangeText={(text) => this.setState({userToken:text})}
        />
        <Button
          title="Login"
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
