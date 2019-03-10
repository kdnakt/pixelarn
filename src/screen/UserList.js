import React from 'react'
import {
  Text,
  FlatList,
  View,
} from 'react-native'

export default class UserList extends React.Component {

  constructor(props) {
    super(props)
  }

  renderItem(user) {
    console.log(user)
    return (
      <Text>{user.item.id}</Text>
    )    
  }

  render() {
    return (
      <View>
        <FlatList
          data={this.props.users}
          keyExtractor={(item, _) => item.id}
          renderItem={(item) => this.renderItem(item)}
        />
      </View>
    )
  }

}