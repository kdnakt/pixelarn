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
  Input,
  ListItem,
} from 'react-native-elements'
import Realm from 'realm'
import {
  UserSchema,
  Schema,
} from '../store/Schema'
import LoginStore from '../store/LoginStore'
import { createUser } from '../PixelaApi';
import { validateId, validateTokens, validateToken } from '../PixelaValidator';

export default class SignupScreen extends Component {
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
        <Input
          label="User Id"
          placeholder={"Please enter your user id"}
          autoCapitalize={"none"}
          keyboardType={"default"}
          maxLength={32}
          onChangeText={(text) => this.setState({
            userId: text,
            userIdValidationMessage: validateId(text),
          })}
          value={this.state.userId}
          errorMessage={this.state.userIdValidationMessage}
        />
        <Input
          label="User Token"
          placeholder={"Please enter your user token"}
          secureTextEntry={true}
          maxLength={128}
          keyboardType={"email-address"}
          onChangeText={(text) => {
            this.setState({
              userToken: text,
              userTokenValidationMessage: validateToken(text),
            })
          }}
          value={this.state.userToken}
          errorMessage={this.state.userTokenValidationMessage}
        />
        <Input
          label="Confirm User Token"
          placeholder={"Please enter your user token again"}
          secureTextEntry={true}
          maxLength={128}
          keyboardType={"email-address"}
          onChangeText={(text) => {
            this.setState({
              confirmUserToken: text,
              confirmUserTokenValidationMessage: validateTokens(text, this.state.userToken, 'user token'),
            })
          }}
          value={this.state.confirmUserToken}
          errorMessage={this.state.confirmUserTokenValidationMessage}
        />
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
          buttonStyle={{backgroundColor:"gold", padding: 16}}
          titleStyle={{fontSize: 24}}
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
