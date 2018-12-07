import React, {
  Component,
} from 'react'
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

const graphsUrl = "https://pixe.la/v1/users/kdnakt/graphs"

export default class GraphListScreen extends Component {

  constructor(props) {
    super(props)
    this.state = {graphs: [{key: 'a'}, {key: 'b'}]}
  }

  componentDidMount() {
    fetch(graphsUrl, {
      method: 'GET',
      headers: {
        'X-USER-TOKEN': 'myusertoken'
      }
    }).then(res => {
      this.setState(JSON.parse(res._bodyText))
    })
  }

  _onPress(id) {
    console.log(this.children._owner.key)
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.graphs}
          keyExtractor={(item, index) => item.id}
          renderItem={({item}) => (
            <TouchableOpacity onPress={this._onPress}>
              <Text style={styles.text}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  text: {
    margin: 10,
  }
});
    