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
  CheckBox,
  Divider,
  FormLabel,
  FormInput,
  FormValidationMessage,
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
import { createUser } from '../PixelaApi';
import { validateId } from '../PixelaValidator';

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
      userIdValidationMessage: null,
      userToken: null,
      confirmUserToken: null,
      agree: false,
      notMinor: false,
      readTerms: false,
    }
  }

  _save() {
    Realm.open(Schema).then(realm => {
      realm.write(() => {
        realm.create(UserSchema.name, {
          id: this.state.userId,
          token: this.state.userToken,
        })
      })
    })
  }

  _send() {
    const user = {
      token: this.state.userToken,
      username: this.state.userId,
      agreeTermsOfService: this.state.agree ? "yes" : "no",
      notMinor: this.state.notMinor ? "yes" : "no",
    }
    createUser(user).then(res => {
      if (res.isSuccess) {
        this._save()
        LoginStore.setUserId(this.state.userId)
        LoginStore.setUserToken(this.state.userToken)
        LoginStore.setGraphs(res.graphs)
        const { navigation } = this.props
        navigation.navigate('GraphList', LoginStore.getGraphs())
      } else {
        Alert.alert(res.message)
      }
    })
  }

  _openTerms(uri) {
    this.props.navigation.navigate('Terms', { uri: uri })
    this.setState({readTerms: true})
  }

  render() {
    return (
      <View style={styles.container}>
        <FormLabel>User Id</FormLabel>
        <FormInput
          placeholder={"Please enter your user id"}
          autoCapitalize={"none"}
          keyboardType={"default"}
          maxLength={32}
          onChangeText={(text) => this.setState({
            userId: text,
            userIdValidationMessage: validateId(text),
          })}
          value={this.state.userId}
        />
        <FormValidationMessage>
          {this.state.userIdValidationMessage}
        </FormValidationMessage>
        <FormLabel>User Token</FormLabel>
        <FormInput
          placeholder={"Please enter your user token"}
          secureTextEntry={true}
          maxLength={128}
          keyboardType={"email-address"}
          onChangeText={(text) => {
            if (!text) {
              this.setState({userToken: text, userTokenValidationMessage: 'This item is required.'})
              return
            } else if (text.length < 8) {
              this.setState({userToken: text, userTokenValidationMessage: '8 characters required.'})
            } else {
              this.setState({userToken: text, userTokenValidationMessage: null})
            }
          }}
          value={this.state.userToken}
        />
        <FormValidationMessage>
          {this.state.userTokenValidationMessage}
        </FormValidationMessage>
        <FormLabel>Confirm User Token</FormLabel>
        <FormInput
          placeholder={"Please enter your user token again"}
          secureTextEntry={true}
          maxLength={128}
          keyboardType={"email-address"}
          onChangeText={(text) => {
            if (!text) {
              this.setState({confirmUserToken: text, confirmUserTokenValidationMessage: 'This item is required.'})
            } else if (text != this.state.userToken) {
              this.setState({confirmUserToken: text, confirmUserTokenValidationMessage: 'This item should match user token.'})
            } else {
              this.setState({confirmUserToken: text, confirmUserTokenValidationMessage: null})
            }
          }}
          value={this.state.confirmUserToken}
        />
        <FormValidationMessage>
          {this.state.confirmUserTokenValidationMessage}
        </FormValidationMessage>
        <Divider style={{height:16, backgroundColor: 'white'}} />
        <ListItem
          title="Terms of Service (English)"
          containerStyle={styles.listitem}
          onPress={() => this._openTerms('https://github.com/a-know/Pixela/wiki/Terms-of-Service')}
        />
        <ListItem
          title="Terms of Service (Japanese)"
          containerStyle={styles.listitem}
          onPress={() => this._openTerms('https://github.com/a-know/Pixela/wiki/%E5%88%A9%E7%94%A8%E8%A6%8F%E7%B4%84%EF%BC%88Terms-of-Service-Japanese-Version%EF%BC%89')}
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
          disabled={!this.state.agree || !this.state.notMinor || !this.state.readTerms}
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
