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
  Input,
} from 'react-native-elements'
import Realm from 'realm'
import {
  UserSchema,
  Schema,
} from '../store/Schema'
import LoginStore from '../store/LoginStore'
import {
  getGraphs,
} from '../PixelaApi'

export default class LoginScreen extends Component {
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
    getGraphs(this.state.userId, this.state.userToken).then(res => {
      if (res.graphs) {
        if (!skipSave) this._save()
        LoginStore.setUserId(this.state.userId)
        LoginStore.setUserToken(this.state.userToken)
        LoginStore.setGraphs(res.graphs)
        const { navigation } = this.props
        navigation.navigate('GraphList', LoginStore.getGraphs())
      } else {
        Alert.alert(res.message)
        this.setState({userExists: false})
      }
    })
  }

  _signup() {
    const { navigation } = this.props
    navigation.navigate('Signup')
  }

  render() {
    const {navigation} = this.props,
        isSignout = navigation.getParam('isSignout'),
        isAutoLogin = this.state.userExists && !isSignout
    return (
      <View style={styles.container}>
        <Input
          label="User Id"
          placeholder={"Please enter your user id"}
          autoCapitalize={"none"}
          onChangeText={(text) => this.setState({userId:text})}
          value={this.state.userId}
        />
        <Divider style={{height:16, backgroundColor: 'white'}} />
        <Input
          label="User Token"
          placeholder={"Please enter your user token"}
          secureTextEntry={true}
          onChangeText={(text) => this.setState({userToken:text})}
          value={this.state.userToken}
        />
        <Divider style={{height:16, backgroundColor: 'white'}} />
        <Button
          title={isAutoLogin ? "Loading..." : "Login"}
          buttonStyle={{backgroundColor:'#00aced', padding: 16}}
          titleStyle={{fontSize: 24}}
          onPress={() => this._send()}
          disabled={(!this.state.userId || !this.state.userToken) || isAutoLogin}
        />
        <Divider style={{height:16, backgroundColor: 'white'}} />
        <Button
          title="Sign Up"
          buttonStyle={{backgroundColor:"gold", padding: 16}}
          titleStyle={{fontSize: 24}}
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
