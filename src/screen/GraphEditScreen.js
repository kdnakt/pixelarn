import React, {
  Component,
} from 'react'
import {
  Alert,
  StyleSheet,
  View,
} from 'react-native'
import {
  Button,
  Divider,
  Input,
} from 'react-native-elements'
import LoginStore from '../store/LoginStore'
import { createGraph } from '../PixelaApi';
import { validateId } from '../PixelaValidator';

export default class GraphEditScreen extends Component {
  static navigationOptions = ({navigation}) => {
    return {
        title: 'CREATE',
    }
  }

  constructor() {
    this.state = {
      graphId: null,
      graphName: null,
    }
  }

  _sendRequest() {
    const body = {
      id: `${this.state.graphId}`,
      name: `${this.state.graphName}`,
      unit: "commit",
      type: "int",
      color: "shibafu",
      timezone: "Asia/Tokyo",
    }
    createGraph(body).then(res => {
      Alert.alert(res.message)
      if (res.isSuccess) {
        LoginStore.addGraph(body)
        const { navigation } = this.props
        navigation.navigate('GraphList', LoginStore.getGraphs());
      }
    })
  }

  render() {
    const { navigation } = this.props,
      graphs = navigation.getParam('graphs')
    return (
      <View style={styles.container}>
        <Input
          label="Graph Id"
          placeholder={"Enter new graph id"}
          maxLength={17}
          autoCapitalize={"none"}
          keyboardType={"ascii-capable"}
          onChangeText={(text) => this.setState({
            graphId: text,
            graphIdValidationMessage: validateId(text),
          })}
          value={this.state.graphId}
          errorMessage={this.state.graphIdValidationMessage}
        />
        <Input
          label="Graph Name"
          placeholder={"Enter new graph name"}
          onChangeText={(text) => this.setState({graphName:text})}
        />
        <Divider style={{height:16, backgroundColor: 'white'}} />
        <Button
          title="Create"
          buttonStyle={{backgroundColor:'#00aced', padding: 16}}
          titleStyle={{fontSize: 24}}
          disabled={!this.state.graphId || !this.state.graphName}
          onPress={() => this._sendRequest()}
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
