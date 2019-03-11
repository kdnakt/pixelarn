import React from 'react'
import {
  Text,
  FlatList,
  View,
} from 'react-native'
import { ListItem } from 'react-native-elements';

export default class UserList extends React.Component {

  constructor(props) {
    super(props)
  }

  renderItem(user) {
    console.log(user)
    return (
      <ListItem
        leftIcon={{name: 'user', type: 'font-awesome'}}
        title={user.item.id}
      />
    )    
  }

  render() {
    return (
      <View>
        <Text>Select a user to log in</Text>
        <FlatList
          data={this.props.users}
          keyExtractor={(item, _) => item.id}
          renderItem={(item) => this.renderItem(item)}
        />
      </View>
    )
  }

}