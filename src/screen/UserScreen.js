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
  Input,
} from 'react-native-elements'
import Realm from 'realm'
import {
  Schema,
  UserSchema,
} from '../store/Schema'
import LoginStore from '../store/LoginStore';
import { updateToken } from '../PixelaApi';
import { validateTokens, validateToken } from '../PixelaValidator';

const save = (newToken, navigation) => {
  Realm.open(Schema).then(realm => {
    realm.write(() => {
      realm.create(UserSchema.name, {
        id: LoginStore.getUserId(),
        token: newToken,
      }, true)
      LoginStore.setUserToken(newToken)
      if (!newToken) {
        navigation.navigate('Login', {isSignout: true})
      }
    })
  })
}

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
        headerRight: (
          <Icon
            name="sign-out"
            type="font-awesome"
            iconStyle={{borderRightWidth: 8}}
            onPress={() => {
              save("", navigation)
            }}
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
    const {navigation} = this.props
    save(newToken, navigation)
  }

  render() {
    return (
      <View style={styles.container}>
        <Input
          label="User Id"
          editable={false}
          value={LoginStore.getUserId()}
        />
        <Divider style={{height: 16, backgroundColor: 'white'}}/>
        <Input
          label="Old Token"
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
          errorMessage={this.state.oldTokenValidationMessage}
        />
        <Divider style={{height: 16, backgroundColor: 'white'}}/>
        <Input
          label="New Token"
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
          errorMessage={this.state.newTokenValidationMessage}
        />
        <Divider style={{height: 16, backgroundColor: 'white'}}/>
        <Input
          label="Confirm New Token"
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
          errorMessage={this.state.confirmNewTokenValidationMessage}
        />
        <Divider style={{height: 16, backgroundColor: 'white'}}/>
        <Button
          title="Update token"
          buttonStyle={{backgroundColor:'#00aced', padding: 16}}
          titleStyle={{fontSize: 24}}
          onPress={() => this._send()}
          disabled={
            !this.state.oldToken
            || !this.state.newToken
            || !this.state.confirmNewToken
            || !!this.state.oldTokenValidationMessage
            || !!this.state.newTokenValidationMessage
            || !!this.state.confirmNewTokenValidationMessage}
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
