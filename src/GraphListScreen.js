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
import {
  type NavigationScreenProp,
} from 'react-navigation/src/TypeDefinition';

const graphsUrl = "https://pixe.la/v1/users/kdnakt/graphs"

type Prop = {
  navigation: NavigationScreenProp<*>,
}

export default class GraphListScreen extends Component<Prop> {
  static navigationOptions = () => {
    return {
        title: 'GRAPH LIST'
    }
  }

  constructor(props: Prop) {
    super(props)
  }

  _onPress(item) {
    if (item.id == 'loading') return
    const { navigation } = this.props;
    navigation.navigate('Graph', { graphId: item.id, name: item.name });
  }

  render() {
    const { navigation } = this.props,
      graphs = navigation.getParam('graphs')
    return (
      <View style={styles.container}>
        <FlatList
          data={graphs}
          keyExtractor={(item, index) => item.id}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => this._onPress(item)}>
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
    