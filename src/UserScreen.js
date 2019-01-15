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

  render() {
    return (
      <View style={styles.container}>
        <FormLabel>User Id</FormLabel>
        <FormInput
          editable={false}
          value={`${LoginStore.getUserId()}`}
        />
        <FormLabel>New password</FormLabel>
        <FormInput
        />
        <FormLabel>Confirm new password</FormLabel>
        <FormInput
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
