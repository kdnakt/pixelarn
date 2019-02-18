import React from 'react'
import {
  Alert,
  StyleSheet,
  View,
} from 'react-native'
import {
  Button,
  Divider,
  Icon,
  FormLabel,
  FormInput,
  FormValidationMessage,
} from 'react-native-elements'
import Realm from 'realm'
import {
  Schema,
  UserSchema,
} from '../store/Schema'
import LoginStore from '../store/LoginStore';
import { updateToken } from '../PixelaApi';

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
    this.setState({sending:true})
    const { oldToken, newToken } = this.state
    updateToken(oldToken, newToken).then(res => {
      Alert.alert(res.message)
      const state = {sending:false}
      if (res.isSuccess) {
        this._save(newToken)
        this.setState(Object.assign(state, {
          oldToken: null,
          oldTokenValidationMessage: null,
          newToken: null,
          newTokenValidationMessage: null,
          confirmNewToken: null,
          confirmNewTokenValidationMessage: null,
        }), () => this.forceUpdate())
      } else {
        this.setState(state)
      }
    })
  }

  _save(newToken) {
    Realm.open(Schema).then(realm => {
      realm.write(() => {
        realm.create(UserSchema.name, {
          id: LoginStore.getUserId(),
          token: newToken,
        }, true)
        LoginStore.setUserToken(newToken)
        if (!newToken) {
          const {navigation} = this.props
          navigation.navigate('Login', {isSignout: true})
        }
      })
    })
  }

  _signout() {
    this._save("")
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
          keyboardType={"email-address"}
          onChangeText={(text) => {
            this.setState({
              oldToken: text,
              oldTokenValidationMessage: validateToken(text),
            })
          }}
          value={this.state.oldToken}
        />
        <FormValidationMessage>
          {this.state.oldTokenValidationMessage}
        </FormValidationMessage>
        <FormLabel>New Token</FormLabel>
        <FormInput
          secureTextEntry={true}
          maxLength={128}
          keyboardType={"email-address"}
          onChangeText={(text) => {
            this.setState({
              newToken: text,
              newTokenValidationMessage: validateToken(text),
            })
          }}
          value={this.state.newToken}
        />
        <FormValidationMessage>
          {this.state.newTokenValidationMessage}
        </FormValidationMessage>
        <FormLabel>Confirm New Token</FormLabel>
        <FormInput
          secureTextEntry={true}
          maxLength={128}
          keyboardType={"email-address"}
          onChangeText={(text) => {
            this.setState({
              confirmNewToken: text,
              confirmNewTokenValidationMessage: validateTokens(text, this.state.newToken, 'new token'),
            })
          }}
          value={this.state.confirmNewToken}
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
            || !!this.state.oldTokenValidationMessage
            || !!this.state.newTokenValidationMessage
            || !!this.state.confirmNewTokenValidationMessage}
        />
        <Divider style={{height:16, backgroundColor: "white"}}/>
        <Button
          title="Sign out"
          large
          backgroundColor="gold"
          disabled={this.state.sending}
          onPress={() => this._signout()}
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
