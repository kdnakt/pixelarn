import React from 'react'
import {
  StyleSheet,
  Text,
  View,
} from 'react-native'
import {
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
        <FormValidationMessage>{this.state.oldPasswordValidationMessage}</FormValidationMessage>
        <FormLabel>New Password</FormLabel>
        <FormInput
        />
        <FormValidationMessage></FormValidationMessage>
        <FormLabel>Confirm New Password</FormLabel>
        <FormInput
        />
        <FormValidationMessage></FormValidationMessage>
      </View>
    )
  }

}

let styles = StyleSheet.create({
  container: {
    margin: "5% 30%"
  }
});
