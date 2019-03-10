import React, {
  Component,
} from 'react'
import {
  Alert,
  Text,
  View,
} from 'react-native'
import {
  Button,
  Icon,
  CheckBox,
  Input,
  FormValidationMessage,
} from 'react-native-elements'
import {
  HeaderBackButton,
} from 'react-navigation'
import LoginStore from '../store/LoginStore'
import Colors from './pixela/Colors'
import {
  deleteGraph,
  updateGraph,
} from '../PixelaApi'

export default class GraphEditScreen extends Component<Prop> {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'CONFIG',
      headerLeft: (
        <HeaderBackButton
          onPress={() => navigation.navigate('Graph', {
            graphId: navigation.getParam('graphId'),
            needReload: navigation.getParam('needReload'),
          })}
        />
      ),
      headerRight: (
        <Icon
          name="trash"
          type="font-awesome"
          iconStyle={{borderRightWidth: 8}}
          onPress={() => {
            Alert.alert(
              "Delete",
              `Are you sure to delete this graph?`,
              [
                {text: "Delete", onPress: () => {
                  const id = navigation.getParam("graphId")
                  deleteGraph(id).then(res => {
                    Alert.alert(res.message)
                    if (res.isSuccess) {
                      LoginStore.removeGraph(id)
                      navigation.navigate('GraphList', LoginStore.getGraphs())
                    }
                  })
                }},
                {text: "Cancel", onPress: () => Alert.alert("cancelled")}
              ]
            )
          }}
        />
      ),
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      changed: false,
      graph: LoginStore.getGraph(props.navigation.getParam('graphId')),
    }
  }

  _sendRequest() {
    const body = this.state.graph
    updateGraph(body).then(res => {
      Alert.alert(res.message)
      if (res.isSuccess) {
        LoginStore.setGraph(body.id, body)
        const {navigation} = this.props
        navigation.setParams({needReload: true})
      }
    })
  }

  newState(nextProps) {
    this.setState({
      changed: true,
      graph: Object.assign(
        this.state.graph,
        nextProps
      ),
    })
  }

  renderColorRadio() {
    const ret = []
    Colors.forEach(c => ret.push(<CheckBox
        key={c[0]}
        title={c[1]}
        textStyle={{color: c[2]}}
        checkedColor='#00aced'
        checkedIcon='dot-circle-o'
        uncheckedIcon='circle-o'
        checked={this.state.graph.color == c[0]}
        onPress={() => this.newState({color: c[0]})}
      />))
    return ret
  }

  render() {
    const graph = this.state.graph
    return (
      <View>
        <Input
          label="Graph Name (Required)"
          value={graph.name}
          onChangeText={(text) => this.newState({name: text})}
          errorMessage={!this.state.graph.name ? "Required" : ""}
        />
        <Text>Color</Text>
        {this.renderColorRadio()}
        <Text>Timezone</Text>
        <CheckBox
          title='Asia/Tokyo'
          checkedColor='#00aced'
          checkedIcon='dot-circle-o'
          uncheckedIcon='circle-o'
          checked={graph.timezone == 'Asia/Tokyo'}
          onPress={() => this.newState({timezone: 'Asia/Tokyo'})}
        />
        <CheckBox
          title='UTC'
          checkedColor='#00aced'
          checkedIcon='dot-circle-o'
          uncheckedIcon='circle-o'
          checked={!graph.timezone || graph.timezone == 'UTC'}
          onPress={() => this.newState({timezone: 'UTC'})}
        />
        <Button
          title="Update"
          buttonStyle={{backgroundColor:'#00aced', padding: 16}}
          titleStyle={{fontSize: 24}}
          disabled={!graph.name || !this.state.changed}
          onPress={() => this._sendRequest()}
        />
      </View>
    )
  }
}