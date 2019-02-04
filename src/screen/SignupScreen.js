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

export default class SignupScreen extends Component<Prop> {
  static navigationOptions = ({navigation}) => {
    return {
        title: "Pixelarn - Sign Up"
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      userId: null,
      userToken: null,
      agree: false,
      notMonitor: false,
    }
  }

  componentWillMount() {
    Realm.open(Schema).then(realm => {
      const users = realm.objects(UserSchema.name)
      console.log(users)
      this.setState({
        users: users
      })
    })
  }

  _save() {
    // Realm.open(Schema).then(realm => {
    //   realm.write(() => {
    //     realm.create(UserSchema.name, {
    //       id: this.state.userId,
    //       token: this.state.userToken,
    //     }, this.state.isUpdate)
    //   })
    // })
  }

  _send() {
    const user = {
      token: this.state.userToken,
      username: this.state.userId,
      agreeTermsOfService: this.state.agree,
      notMonitor: this.state.notMonitor,
    }
    fetch('https://pixe.la/v1/users/', {
      method: 'POST',
      body: JSON.stringify(user),
    }).then(res => {
      console.log(res)
      // if (res.ok) {
      //   if (!skipSave) this._save()
      //   LoginStore.setUserId(this.state.userId)
      //   LoginStore.setUserToken(this.state.userToken)
      //   LoginStore.setGraphs(JSON.parse(res._bodyText).graphs)
      //   const { navigation } = this.props
      //   navigation.navigate('GraphList', LoginStore.getGraphs())
      // } else {
      //   Alert.alert(JSON.parse(res._bodyText).message)
      // }
    })
  }

  render() {
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
          title="Sign Up"
          large
          backgroundColor="gold"
          onPress={() => this._send()}
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
