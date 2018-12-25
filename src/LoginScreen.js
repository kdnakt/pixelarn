import React, {
  Component,
} from 'react'
import {
  Alert,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import {
  Button,
  FormLabel,
  FormInput,
} from 'react-native-elements'
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
        <FormLabel>User Id</FormLabel>
        <FormInput
          placeholder={"User id"}
          autoCapitalize={"none"}
          onChangeText={(text) => this.setState({userId:text})}
        />
        <FormLabel>User Token</FormLabel>
        <FormInput
          placeholder={"User token"}
          secureTextEntry={true}
          onChangeText={(text) => this.setState({userToken:text})}
        />
        <Button
          title="Login"
          backgroundColor={'#00aced'}
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
