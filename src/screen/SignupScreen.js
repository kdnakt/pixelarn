import React, {
  Component,
} from 'react'
import {
  StyleSheet,
  View,
} from 'react-native'
import {
  Button,
  CheckBox,
  Divider,
  FormLabel,
  FormInput,
  ListItem,
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
      notMinor: false,
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
      notMinor: this.state.notMinor,
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
        <ListItem
          title="Terms of Service (English)"
          containerStyle={styles.listitem}
          onPress={() => this.props.navigation.navigate('Terms', {
            uri: 'https://github.com/a-know/Pixela/wiki/Terms-of-Service'
          })}
        />
        <ListItem
          title="Terms of Service (Japanese)"
          containerStyle={styles.listitem}
          onPress={() => this.props.navigation.navigate('Terms', {
            uri: 'https://github.com/a-know/Pixela/wiki/%E5%88%A9%E7%94%A8%E8%A6%8F%E7%B4%84%EF%BC%88Terms-of-Service-Japanese-Version%EF%BC%89'
          })}
        />
        <Divider style={{height:16, backgroundColor: 'white'}} />
        <CheckBox
          title='I have read and agree to the Terms of Service.'
          checkedColor='#00aced'
          checked={this.state.agree}
          onPress={() => this.setState({agree: !this.state.agree})}
        />
        <CheckBox
          title='I am not a minor or have my parent/legal guardian provide consent to use this.'
          checkedColor='#00aced'
          checked={this.state.notMinor}
          onPress={() => this.setState({notMinor: !this.state.notMinor})}
        />
        <Divider style={{height:16, backgroundColor: 'white'}} />
        <Button
          title="Sign Up"
          large
          backgroundColor="gold"
          disabled={!this.state.agree}
          onPress={() => this._send()}
        />
      </View>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    margin: "5% 30%",
  },
  listitem: {
    marginLeft: "5%",
    marginRight: "5%",
  }
});
