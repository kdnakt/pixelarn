import React from 'react'
import {
  StyleSheet,
  Text,
  View,
} from 'react-native'
import {
  Icon,
} from 'react-native-elements'

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
        <Text>User Screen</Text>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  }
})