import React from 'react'
import {
  StyleSheet,
  Text,
  View,
} from 'react-native'

export default class UserScreen extends React.Component {

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