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
} from 'react-native-elements'
import {
  type NavigationScreenProp,
} from 'react-navigation/src/TypeDefinition'
import Realm from 'realm'
import {
  UserSchema,
  Schema,
} from '../store/Schema'
import LoginStore from '../store/LoginStore'

type Prop = {
  navigation: NavigationScreenProp<*>,
}

export default class LoginScreen extends Component<Prop> {
  static navigationOptions = ({navigation}) => {
    return {
        title: "Pixelarn - Login"
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      userId: null,
      userToken: null,
      userExists: false,
    }
  }

  componentWillMount() {
    Realm.open(Schema).then(realm => {
      const users = realm.objects(UserSchema.name)
      if (users[0]) {
        this.setState({
          userId: users[0].id,
          userToken: users[0].token,
          isUpdate: true,
          userExists: !!users[0].id && !!users[0].token,
        }, () => {
          if (users[0].token) this._send(true)
        })
      }
    })
  }

  _save() {
    Realm.open(Schema).then(realm => {
      realm.write(() => {
        realm.create(UserSchema.name, {
          id: this.state.userId,
          token: this.state.userToken,
        }, this.state.isUpdate)
      })
    })
  }

  _send(skipSave) {
    fetch(`https://pixe.la/v1/users/${this.state.userId}/graphs`, {
      method: 'GET',
      headers: {
        'X-USER-TOKEN': `${this.state.userToken}`
      }
    }).then(res => {
      if (res.ok) {
        if (!skipSave) this._save()
        LoginStore.setUserId(this.state.userId)
        LoginStore.setUserToken(this.state.userToken)
        LoginStore.setGraphs(JSON.parse(res._bodyText).graphs)
        const { navigation } = this.props
        navigation.navigate('GraphList', LoginStore.getGraphs())
      } else {
        Alert.alert(JSON.parse(res._bodyText).message)
      }
    })
  }

  _signup() {
    const { navigation } = this.props
    navigation.navigate('Signup')
  }

  render() {
    const {navigation} = this.props,
      isSignout = LoginStore.getGraph(navigation.getParam('isSignout'))
    if (isSignout) {
      navigation.setParams({isSignout: false})
      this.setState({userExists: false})
    }
    return (
      <View style={styles.container}>
        <FormLabel>User Id</FormLabel>
        <FormInput
          placeholder={"Please enter your user id"}
          autoCapitalize={"none"}
          onChangeText={(text) => this.setState({userId:text})}
          value={this.state.userId}
        />
        <FormLabel>User Token</FormLabel>
        <FormInput
          placeholder={"Please enter your user token"}
          secureTextEntry={true}
          onChangeText={(text) => this.setState({userToken:text})}
          value={this.state.userToken}
        />
        <Divider style={{height:16, backgroundColor: 'white'}} />
        <Button
          title={this.state.userExists ? "Loading..." : "Login"}
          large
          backgroundColor={'#00aced'}
          onPress={() => this._send()}
          disabled={(!this.state.userId || !this.state.userToken) || this.state.userExists}
        />
        <Divider style={{height:16, backgroundColor: 'white'}} />
        <Button
          title="Sign Up"
          large
          backgroundColor="gold"
          onPress={() => this._signup()}
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
