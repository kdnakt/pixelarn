import React, {
  Component,
} from 'react'
import {
  Button,
  FlatList,
  StyleSheet,
  View,
} from 'react-native'
import {
  List,
  ListItem
} from 'react-native-elements'
import {
  type NavigationScreenProp,
} from 'react-navigation/src/TypeDefinition';
import LoginStore from './LoginStore';

type Prop = {
  navigation: NavigationScreenProp<*>,
}

export default class GraphListScreen extends Component<Prop> {
  static navigationOptions = ({navigation}) => {
    return {
        title: 'GRAPH LIST',
        headerLeft: null,
        headerRight: (
          <Button
            title="New Graph"
            onPress={() => navigation.navigate('GraphEdit')}
          />
        )
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

  renderItem({item}) {
    return (
      <ListItem
        leftIcon={{name: 'apps'}}
        title={item.name}
        key={item.id}
      />
    )
  }

  render() {
    const graphs = LoginStore.getGraphs()
    return (
      <View>
        <List>
          <FlatList
            data={graphs}
            keyExtractor={(item, index) => item.id}
            renderItem={this.renderItem}
          />
        </List>
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
    