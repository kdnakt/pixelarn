import React from 'react'
import {
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
      oldPassword: null,
      oldPasswordValidationMessage: null,
      newPassword: null,
      newPasswordValidationMessage: null,
      confirmNewPassword: null,
      confirmNewPasswordValidationMessage: null,
    }
  }

  _send() {
    // TODO: implement
  }

  render() {
    return (
      <View style={styles.container}>
        <FormLabel>User Id</FormLabel>
        <FormInput
          editable={false}
          value={LoginStore.getUserId()}
        />
        <FormLabel>Old Password</FormLabel>
        <FormInput
          secureTextEntry={true}
          maxLength={128}
          onChangeText={(text) => {
            if (!text) {
              this.setState({oldPasswordValidationMessage: 'This item is required.'})
            } else if (text.length < 8) {
              this.setState({oldPasswordValidationMessage: '8 characters required.'})
            } else {
              this.setState({oldPassword: text, oldPasswordValidationMessage: null})
            }
          }}
        />
        <FormValidationMessage>
          {this.state.oldPasswordValidationMessage}
        </FormValidationMessage>
        <FormLabel>New Password</FormLabel>
        <FormInput
          secureTextEntry={true}
          maxLength={128}
          onChangeText={(text) => {
            if (!text) {
              this.setState({newPassword: text, newPasswordValidationMessage: 'This item is required.'})
            } else if (text.length < 8) {
              this.setState({newPassword: text, newPasswordValidationMessage: '8 characters required.'})
            } else {
              this.setState({newPassword: text, newPasswordValidationMessage: null})
            }
          }}
        />
        <FormValidationMessage>
          {this.state.newPasswordValidationMessage}
        </FormValidationMessage>
        <FormLabel>Confirm New Password</FormLabel>
        <FormInput
          secureTextEntry={true}
          maxLength={128}
          onChangeText={(text) => {
            if (!text) {
              this.setState({confirmNewPasswordValidationMessage: 'This item is required.'})
            } else if (text != this.state.newPassword) {
              this.setState({confirmNewPasswordValidationMessage: 'This item should match new password.'})
            } else {
              this.setState({confirmNewPassword: text, confirmNewPasswordValidationMessage: null})
            }
          }}
        />
        <FormValidationMessage>
          {this.state.confirmNewPasswordValidationMessage}
        </FormValidationMessage>
        <Button
          title="Update password"
          large
          backgroundColor={'#00aced'}
          onPress={() => this._send()}
          disabled={
            !this.state.oldPassword
            || !this.state.newPassword
            || !this.state.confirmNewPassword
            || this.state.oldPasswordValidationMessage
            || this.state.newPasswordValidationMessage
            || this.state.confirmNewPasswordValidationMessage}
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
