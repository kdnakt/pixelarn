import React, {
  Component,
} from 'react'
import {
  FlatList,
  ScrollView,
  RefreshControl,
  View,
} from 'react-native'
import {
  ListItem,
  Icon,
} from 'react-native-elements'
import LoginStore from '../store/LoginStore'
import {
  getGraphs,
} from '../PixelaApi'

export default class GraphListScreen extends Component {
  static navigationOptions = ({navigation}) => {
    return {
        title: 'GRAPH LIST',
        headerLeft: (
          <Icon
            name="bars"
            type="font-awesome"
            iconStyle={{borderLeftWidth: 8}}
            onPress={() => navigation.toggleDrawer()}
          />
        ),
        headerRight: (
          <Icon
            name="plus-square"
            type="font-awesome"
            iconStyle={{borderRightWidth: 8}}
            onPress={() => navigation.navigate('GraphEdit')}
          />
        )
    }
  }
  constructor(props) {
    super(props)
    this.state = {
      refreshing: false,
    }
  }

  _onPress(item) {
    const { navigation } = this.props;
    navigation.navigate('Graph', {graphId: item.id})
  }

  renderItem({item}) {
    const nodata = item.id == 'nodata'
    return (
      <ListItem
        leftIcon={nodata ? null : {name: 'apps'}}
        title={item.name}
        key={item.id}
        hideChevron={nodata}
        onPress={nodata ? () => {} : () => this._onPress(item)}
      />
    )
  }

  _onRefresh() {
    this.setState({refreshing: true})
    getGraphs(LoginStore.getUserId(), LoginStore.getUserToken()).then(res => {
      if (res.graphs) {
        const {navigation} = this.props
        navigation.setParams({'graphs': res.graphs})
      }
      this.setState({refreshing: false})
    })
  }

  render() {
    const {navigation} = this.props
    let graphs = navigation.getParam('graphs');
    if (!graphs || graphs.length == 0) {
      graphs = [{id:'nodata', name:'No Data'}]
    }
    return (
      <View>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this._onRefresh()}
            />
          }
        >
          <FlatList
            data={graphs}
            keyExtractor={(item, index) => item.id}
            renderItem={(item) => this.renderItem(item)}
          />
        </ScrollView>
      </View>
    )
  }

}
