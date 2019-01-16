import React from 'react'
import {
  Alert,
  StyleSheet,
  View,
} from 'react-native'
import {
  Button,
  Icon,
  FormLabel,
  FormInput,
  FormValidationMessage,
} from 'react-native-elements'
import LoginStore from './LoginStore';

export default class UserScreen extends React.Component {

  static navigationOptions = ({navigation}) => {
    return {
        title: 'USER SETTING',
        headerLeft: (
          <Icon
            name="bars"
            type="font-awesome"
            iconStyle={{borderLeftWidth: 8}}
            onPress={() => navigation.toggleDrawer()}
          />
        ),
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      oldToken: null,
      oldTokenValidationMessage: null,
      newToken: null,
      newTokenValidationMessage: null,
      confirmNewToken: null,
      confirmNewTokenValidationMessage: null,
    }
  }

  _send() {
    const { oldToken, newToken } = this.state,
      body = { newToken : newToken }
    fetch(`https://pixe.la/v1/users/${LoginStore.getUserId()}/`, {
      method: 'PUT',
      headers: {
        'X-USER-TOKEN': `${oldToken}`
      },
      body: JSON.stringify(body),
    }).then(res => {
      Alert.alert(JSON.parse(res._bodyText).message)
      if (res.ok) {
        LoginStore.setUserToken(newToken)
        this.setState({
          oldToken: null,
          oldTokenValidationMessage: null,
          newToken: null,
          newTokenValidationMessage: null,
          confirmNewToken: null,
          confirmNewTokenValidationMessage: null,
        }, () => this.forceUpdate())
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <FormLabel>User Id</FormLabel>
        <FormInput
          editable={false}
          value={LoginStore.getUserId()}
        />
        <FormLabel>Old Token</FormLabel>
        <FormInput
          secureTextEntry={true}
          maxLength={128}
          onChangeText={(text) => {
            if (!text) {
              this.setState({oldTokenValidationMessage: 'This item is required.'})
            } else if (text.length < 8) {
              this.setState({oldTokenValidationMessage: '8 characters required.'})
            } else {
              this.setState({oldToken: text, oldTokenValidationMessage: null})
            }
          }}
        />
        <FormValidationMessage>
          {this.state.oldTokenValidationMessage}
        </FormValidationMessage>
        <FormLabel>New Token</FormLabel>
        <FormInput
          secureTextEntry={true}
          maxLength={128}
          onChangeText={(text) => {
            if (!text) {
              this.setState({newToken: text, newTokenValidationMessage: 'This item is required.'})
            } else if (text.length < 8) {
              this.setState({newToken: text, newTokenValidationMessage: '8 characters required.'})
            } else {
              this.setState({newToken: text, newTokenValidationMessage: null})
            }
          }}
        />
        <FormValidationMessage>
          {this.state.newTokenValidationMessage}
        </FormValidationMessage>
        <FormLabel>Confirm New Token</FormLabel>
        <FormInput
          secureTextEntry={true}
          maxLength={128}
          onChangeText={(text) => {
            if (!text) {
              this.setState({confirmNewTokenValidationMessage: 'This item is required.'})
            } else if (text != this.state.newToken) {
              this.setState({confirmNewTokenValidationMessage: 'This item should match new token.'})
            } else {
              this.setState({confirmNewToken: text, confirmNewTokenValidationMessage: null})
            }
          }}
        />
        <FormValidationMessage>
          {this.state.confirmNewTokenValidationMessage}
        </FormValidationMessage>
        <Button
          title="Update token"
          large
          backgroundColor={'#00aced'}
          onPress={() => this._send()}
          disabled={
            !this.state.oldToken
            || !this.state.newToken
            || !this.state.confirmNewToken
            || this.state.oldTokenValidationMessage
            || this.state.newTokenValidationMessage
            || this.state.confirmNewTokenValidationMessage}
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
